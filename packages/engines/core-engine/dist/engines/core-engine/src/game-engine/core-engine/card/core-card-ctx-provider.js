export class CoreCardCtxProvider {
    engineRef;
    constructor({ engine, }) {
        this.engineRef = new WeakRef(engine);
    }
    getCtx() {
        const engine = this.engineRef.deref();
        if (!engine) {
            throw new Error("Engine has been garbage collected - CoreCardCtxProvider cannot access context");
        }
        return engine.getGameState().ctx;
    }
    /**
     * Check if the underlying engine is still available
     * Useful for debugging and error handling
     */
    isEngineAvailable() {
        return this.engineRef.deref() !== undefined;
    }
}
//# sourceMappingURL=core-card-ctx-provider.js.map