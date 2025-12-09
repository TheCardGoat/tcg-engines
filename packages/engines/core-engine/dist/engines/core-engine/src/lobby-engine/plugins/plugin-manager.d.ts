import type { CombinedLobbyState } from "../lobby-engine-types";
import type { Plugin, PluginManagerOptions } from "./types";
type EventCallback = (payload?: unknown) => void;
/**
 * Manages plugins in the engine system
 */
export declare class PluginManager<State, Context> {
    private getState;
    private setState;
    private plugins;
    private eventHandlers;
    private api;
    constructor(getState: () => CombinedLobbyState<State, Context>, setState: (updater: CombinedLobbyState<State, Context> | ((state: CombinedLobbyState<State, Context>) => CombinedLobbyState<State, Context>)) => CombinedLobbyState<State, Context>, options?: PluginManagerOptions<CombinedLobbyState<State, Context>>);
    /**
     * Register a new plugin
     */
    register(plugin: Plugin<CombinedLobbyState<State, Context>>): void;
    /**
     * Unregister a plugin by name
     */
    unregister(pluginName: string): boolean;
    /**
     * Get a plugin by name
     */
    getPlugin(name: string): Plugin<CombinedLobbyState<State, Context>> | undefined;
    /**
     * Check if a plugin with the given name is registered
     */
    hasPlugin(name: string): boolean;
    /**
     * Register an event handler
     */
    on(eventName: string, callback: EventCallback): void;
    /**
     * Unregister an event handler
     */
    off(eventName: string, callback: EventCallback): void;
    /**
     * Emit an event to all registered handlers
     */
    emit(eventName: string, payload?: unknown): void;
    /**
     * Dispatch an action to be processed by the engine
     */
    dispatch(action: {
        type: string;
        payload?: unknown;
    }): void;
    /**
     * Run the onGameInit hook for all plugins
     */
    onGameInit(state: CombinedLobbyState<State, Context>): void;
    /**
     * Run the preMove hook for all plugins
     * Returns false if any plugin returns false
     */
    preMove(state: unknown, action: unknown, playerId: string): boolean;
    /**
     * Run the postMove hook for all plugins
     */
    postMove(state: unknown, action: unknown, playerId: string): void;
    /**
     * Run the onPlayerJoin hook for all plugins
     */
    onPlayerJoin(state: unknown, playerId: string, playerData?: unknown): void;
    /**
     * Run the onPlayerLeave hook for all plugins
     */
    onPlayerLeave(state: unknown, playerId: string): void;
    /**
     * Run the onPlayerReady hook for all plugins
     */
    onPlayerReady(state: unknown, playerId: string, isReady: boolean): void;
    /**
     * Clean up all plugins and event handlers
     */
    dispose(): void;
}
export {};
//# sourceMappingURL=plugin-manager.d.ts.map