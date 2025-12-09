import type { CoreCardCtxProvider } from "~/game-engine/core-engine/card/core-card-ctx-provider";
export declare class CoreCardInstance<T extends {
    id: string;
} = {
    id: string;
}> {
    readonly instanceId: string;
    readonly ownerId: string;
    readonly card: T;
    readonly contextProvider: CoreCardCtxProvider;
    protected engineRef?: WeakRef<any>;
    constructor({ instanceId, ownerId, definition, contextProvider, engine, }: {
        instanceId: string;
        ownerId: string;
        definition: T;
        contextProvider: CoreCardCtxProvider;
        engine?: any;
    });
    get publicId(): string;
    get owner(): string | undefined;
    get zone(): string | undefined;
    /**
     * Get the engine reference if still available
     * Should be used sparingly and with proper null checking
     */
    protected getEngine<TEngine = any>(): TEngine | undefined;
    /**
     * Check if the underlying engine is still available
     * Useful for debugging and error handling
     */
    isEngineAvailable(): boolean;
    /**
     * Execute a function with the engine if available
     * Provides safe access pattern for engine operations
     */
    protected withEngine<TEngine = any, TResult = any>(callback: (engine: TEngine) => TResult, errorMessage?: string): TResult;
}
//# sourceMappingURL=core-card-instance.d.ts.map