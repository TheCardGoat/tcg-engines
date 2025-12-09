/**
 * Move implementations for Riftbound TCG
 * Following the CoreEngine move pattern with proper ctx usage
 */
import type { Move } from "~/game-engine/core-engine/move/move-types";
import type { RiftboundGameState } from "../riftbound-generic-types";
export type RiftboundMove = Move<RiftboundGameState>;
/**
 * Setup and pregame moves
 */
export declare const chooseDomainIdentity: ({ G, ctx, playerID, coreOps }: {
    G: any;
    ctx: any;
    playerID: any;
    coreOps: any;
}, domains: string[]) => any;
export declare const chooseFirstPlayer: RiftboundMove;
export declare const mulligan: RiftboundMove;
/**
 * Resource management moves
 */
export declare const channelRunes: RiftboundMove;
/**
 * Card play moves
 */
export declare const playCard: RiftboundMove;
/**
 * Combat moves
 */
export declare const declareCombat: RiftboundMove;
/**
 * Utility moves
 */
export declare const drawCard: RiftboundMove;
export declare const discardCard: RiftboundMove;
export declare const endTurn: RiftboundMove;
export declare const passPriority: RiftboundMove;
export declare const concede: RiftboundMove;
/**
 * Export all moves
 */
export declare const riftboundMoves: Record<string, any>;
//# sourceMappingURL=moves.d.ts.map