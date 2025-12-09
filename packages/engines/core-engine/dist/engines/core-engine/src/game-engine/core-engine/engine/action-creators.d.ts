import type { Operation } from "rfc6902";
import type { CoreEngineState, LogEntry, SyncInfo } from "~/game-engine/core-engine/game-configuration";
import * as Actions from "./action-types";
/**
 * Generate a move to be dispatched to the game move reducer.
 *
 * @param {string} type - The move type.
 * @param {Array}  args - Additional arguments.
 * @param {string}  playerID - The ID of the player making this action.
 * @param {string}  credentials - (optional) The credentials for the player making this action.
 */
export declare const makeMove: (type: string, args?: unknown, playerID?: string | null) => {
    type: typeof Actions.MAKE_MOVE;
    payload: {
        type: string;
        args: unknown;
        playerID: string;
    };
};
/**
 * Generate a game event to be dispatched to the flow reducer.
 *
 * @param {string} type - The event type.
 * @param {Array}  args - Additional arguments.
 * @param {string}  playerID - The ID of the player making this action.
 * @param {string}  credentials - (optional) The credentials for the player making this action.
 */
export declare const gameEvent: (type: string, args?: any, playerID?: string | null) => {
    type: typeof Actions.GAME_EVENT;
    payload: {
        type: string;
        args: any;
        playerID: string;
    };
};
/**
 * Generate an automatic game event that is a side-effect of a move.
 * @param {string} type - The event type.
 * @param {Array}  args - Additional arguments.
 * @param {string}  playerID - The ID of the player making this action.
 * @param {string}  credentials - (optional) The credentials for the player making this action.
 */
export declare const automaticGameEvent: (type: string, args: any, playerID?: string | null) => {
    type: typeof Actions.GAME_EVENT;
    payload: {
        type: string;
        args: any;
        playerID: string;
    };
    automatic: boolean;
};
export declare const sync: (info: SyncInfo) => {
    type: typeof Actions.SYNC;
    state: CoreEngineState<unknown>;
    log: LogEntry[];
    initialState: CoreEngineState<unknown>;
    clientOnly: true;
};
/**
 * Used to update the Redux store's state with patch in response to
 * an action coming from another player.
 * @param prevStateID previous stateID
 * @param stateID stateID after this patch
 * @param {Operation[]} patch - The patch to apply.
 * @param {LogEntry[]} deltalog - A log delta.
 */
export declare const patch: (prevStateID: number, stateID: number, patch: Operation[], deltalog: LogEntry[]) => {
    type: typeof Actions.PATCH;
    prevStateID: number;
    stateID: number;
    patch: Operation[];
    deltalog: LogEntry[];
    clientOnly: true;
};
/**
 * Used to update the Redux store's state in response to
 * an action coming from another player.
 * @param {object} state - The state to restore.
 * @param {Array} deltalog - A log delta.
 */
export declare const update: (state: CoreEngineState, deltalog: LogEntry[]) => {
    type: typeof Actions.UPDATE;
    state: CoreEngineState<unknown>;
    deltalog: LogEntry[];
    clientOnly: true;
};
/**
 * Used to reset the game state.
 * @param {object} state - The initial state.
 */
export declare const reset: (state: CoreEngineState) => {
    type: typeof Actions.RESET;
    state: CoreEngineState<unknown>;
    clientOnly: true;
};
/**
 * Used to undo the last move.
 * @param {string}  playerID - The ID of the player making this action.
 * @param {string}  credentials - (optional) The credentials for the player making this action.
 */
export declare const undo: (playerID?: string | null) => {
    type: typeof Actions.UNDO;
    payload: {
        type: any;
        args: any;
        playerID: string;
    };
};
/**
 * Used to redo the last undone move.
 * @param {string}  playerID - The ID of the player making this action.
 * @param {string}  credentials - (optional) The credentials for the player making this action.
 */
export declare const redo: (playerID?: string | null) => {
    type: typeof Actions.REDO;
    payload: {
        type: any;
        args: any;
        playerID: string;
    };
};
/**
 * Private action used to strip transient metadata (e.g. errors) from the game
 * state.
 */
export declare const stripTransients: () => {
    type: typeof Actions.STRIP_TRANSIENTS;
};
//# sourceMappingURL=action-creators.d.ts.map