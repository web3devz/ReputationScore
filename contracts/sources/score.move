module reputation_score::score {
    use sui::event;
    use sui::object::{Self, UID};
    use sui::table::{Self, Table};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    public struct ScoreBoard has key, store {
        id: UID,
        authority: address,
        scores: Table<address, u64>,
    }

    public struct ScoreEvent has copy, drop {
        actor: address,
        delta: i64,
        new_score: u64,
    }

    const E_NOT_AUTHORITY: u64 = 0;

    fun init(ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let board = ScoreBoard {
            id: object::new(ctx),
            authority: sender,
            scores: table::new(ctx),
        };
        transfer::transfer(board, sender);
    }

    public entry fun grant(
        board: &mut ScoreBoard,
        beneficiary: address,
        delta: u64,
        ctx: &TxContext,
    ) {
        assert!(is_authority(board, ctx), E_NOT_AUTHORITY);
        apply_delta(board, beneficiary, delta, true, ctx);
    }

    public entry fun slash(
        board: &mut ScoreBoard,
        beneficiary: address,
        delta: u64,
        ctx: &TxContext,
    ) {
        assert!(is_authority(board, ctx), E_NOT_AUTHORITY);
        apply_delta(board, beneficiary, delta, false, ctx);
    }

    public entry fun self_report(board: &mut ScoreBoard, ctx: &TxContext) {
        let actor = tx_context::sender(ctx);
        apply_delta(board, actor, 1, true, ctx);
    }

    public fun get_score(board: &ScoreBoard, user: address): u64 {
        if (table::contains(&board.scores, &user)) {
            *table::borrow(&board.scores, &user)
        } else {
            0
        }
    }

    fun apply_delta(
        board: &mut ScoreBoard,
        actor: address,
        delta: u64,
        positive: bool,
        ctx: &TxContext,
    ) {
        let new_score = if (table::contains(&board.scores, &actor)) {
            let current_ref = table::borrow_mut(&mut board.scores, &actor);
            let current = *current_ref;
            let updated = if positive {
                current + delta
            } else if delta >= current {
                0
            } else {
                current - delta
            };
            *current_ref = updated;
            updated
        } else {
            let start = if positive { delta } else { 0 };
            table::add(&mut board.scores, actor, start);
            start
        };

        emit_event(actor, delta, positive, new_score);
    }

    fun emit_event(actor: address, delta: u64, positive: bool, new_score: u64) {
        let signed_delta: i64 = if positive {
            delta as i64
        } else {
            -1 * (delta as i64)
        };
        event::emit(ScoreEvent {
            actor,
            delta: signed_delta,
            new_score,
        });
    }

    fun is_authority(board: &ScoreBoard, ctx: &TxContext): bool {
        board.authority == tx_context::sender(ctx)
    }
}
