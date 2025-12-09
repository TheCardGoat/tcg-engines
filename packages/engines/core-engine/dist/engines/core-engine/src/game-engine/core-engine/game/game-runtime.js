import { FlowManager } from "~/game-engine/core-engine/flow/flow-manager";
import { MoveProcessor, } from "~/game-engine/core-engine/move/move-processor";
import { createCtx } from "~/game-engine/core-engine/state/context";
// This class is responsible for turning a GameDefinition into a live object, it encapsulates it
// and provides a runtime interface to interact with the game state and moves.
export class CoreGameRuntime {
    processedGame;
    initialState;
    flowManager;
    moveProcessor;
    constructor({ game, initialState, initialCoreCtx, cards, players, seed, debug = false, }) {
        // Process game definition with defaults
        const processedGameDef = this.processGameDefinition(game, seed);
        // Create FlowManager (consolidates Flow function logic)
        this.flowManager = new FlowManager(processedGameDef, cards, players);
        // Create initial context
        const ctx = createCtx({
            playerOrder: players || [],
            initialSegment: this.flowManager.startingSegment || undefined,
            initialPhase: this.flowManager.initialPhase || undefined,
            initialStep: this.flowManager.initialStep || undefined,
            cards,
            players: players?.reduce((acc, player) => {
                acc[player] = { id: player, name: player, turnHistory: [] };
                return acc;
            }, {}),
        });
        // Create initial game state
        const state = {
            G: (initialState || {}),
            ctx: initialCoreCtx ? { ...ctx, ...initialCoreCtx } : ctx,
        };
        this.initialState = {
            ...state,
            _undo: processedGameDef.disableUndo
                ? []
                : [{ G: state.G, ctx: state.ctx }],
            _redo: [],
            _stateID: 0,
        };
        // Create processed game runtime
        this.processedGame = {
            ...processedGameDef,
            moveNames: this.flowManager.moveNames,
            flow: this.flowManager, // FlowManager replaces Flow function return
        };
        this.moveProcessor = new MoveProcessor(debug);
    }
    /**
     * Process game definition and set defaults (consolidates processGameDefinition)
     */
    processGameDefinition(game, seed) {
        const processed = { ...game };
        if (seed) {
            processed.seed = seed;
        }
        // Set defaults
        if (processed.name === undefined)
            processed.name = "default";
        if (processed.deltaState === undefined)
            processed.deltaState = false;
        if (processed.disableUndo === undefined)
            processed.disableUndo = true;
        if (processed.moves === undefined)
            processed.moves = {};
        if (processed.playerView === undefined)
            processed.playerView = ({ G }) => G;
        if (processed.name.includes(" ")) {
            throw new Error(`${processed.name}: Game name must not include spaces`);
        }
        return processed;
    }
    processMove(request, fnContext) {
        return this.moveProcessor.process(request, this.flowManager, // Pass FlowManager instead of Flow function return
        fnContext);
    }
}
//# sourceMappingURL=game-runtime.js.map