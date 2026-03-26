module reputation_score::score {
    use one::event;
    use one::table::{Self, Table};

    /// Shared scoreboard — tracks reputation for all users
    public struct ScoreBoard has key {
        id: object::UID,
        authority: address,
        scores: Table<address, u64>,
        total_users: u64,
    }

    public struct ScoreUpdated has copy, drop {
        user: address,
        amount: u64,
        is_positive: bool,
        new_score: u64,
        epoch: u64,
    }

    const E_NOT_AUTHORITY: u64 = 0;
    const E_INVALID_DELTA: u64 = 1;

    fun init(ctx: &mut TxContext) {
        let board = ScoreBoard {
            id: object::new(ctx),
            authority: ctx.sender(),
            scores: table::new(ctx),
            total_users: 0,
        };
        transfer::share_object(board);
    }

    /// Authority grants reputation to a user
    public fun grant(
        board: &mut ScoreBoard,
        user: address,
        amount: u64,
        ctx: &mut TxContext,
    ) {
        assert!(board.authority == ctx.sender(), E_NOT_AUTHORITY);
        assert!(amount > 0, E_INVALID_DELTA);
        apply_delta(board, user, amount, true, ctx);
    }

    /// Authority slashes reputation from a user
    public fun slash(
        board: &mut ScoreBoard,
        user: address,
        amount: u64,
        ctx: &mut TxContext,
    ) {
        assert!(board.authority == ctx.sender(), E_NOT_AUTHORITY);
        assert!(amount > 0, E_INVALID_DELTA);
        apply_delta(board, user, amount, false, ctx);
    }

    /// Any user can self-report +1 reputation
    public fun self_report(board: &mut ScoreBoard, ctx: &mut TxContext) {
        apply_delta(board, ctx.sender(), 1, true, ctx);
    }

    /// Get a user's current reputation score
    public fun get_score(board: &ScoreBoard, user: address): u64 {
        if (table::contains(&board.scores, user)) {
            *table::borrow(&board.scores, user)
        } else {
            0
        }
    }

    public fun total_users(board: &ScoreBoard): u64 { board.total_users }

    fun apply_delta(
        board: &mut ScoreBoard,
        user: address,
        amount: u64,
        positive: bool,
        ctx: &mut TxContext,
    ) {
        let new_score = if (table::contains(&board.scores, user)) {
            let current = *table::borrow(&board.scores, user);
            let updated = if (positive) {
                current + amount
            } else if (amount >= current) {
                0
            } else {
                current - amount
            };
            *table::borrow_mut(&mut board.scores, user) = updated;
            updated
        } else {
            let start = if (positive) { amount } else { 0 };
            table::add(&mut board.scores, user, start);
            board.total_users = board.total_users + 1;
            start
        };

        event::emit(ScoreUpdated {
            user,
            amount,
            is_positive: positive,
            new_score,
            epoch: ctx.epoch(),
        });
    }
}
