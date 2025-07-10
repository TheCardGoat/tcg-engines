import { logger } from "../../shared/logger";
import type { CombinedLobbyState } from "../lobby-engine-types";
import type { Plugin, PluginAPI, PluginManagerOptions } from "./types";
import { CoreEvents } from "./types";

type EventCallback = (payload?: unknown) => void;
// type PluginHookPayload = { state: unknown; [key: string]: unknown };

/**
 * Manages plugins in the engine system
 */
export class PluginManager<State, Context> {
  private plugins: Record<string, Plugin<CombinedLobbyState<State, Context>>> =
    {};
  private eventHandlers: Record<string, EventCallback[]> = {};
  private api: PluginAPI<CombinedLobbyState<State, Context>>;

  constructor(
    private getState: () => CombinedLobbyState<State, Context>,
    private setState: (
      updater:
        | CombinedLobbyState<State, Context>
        | ((
            state: CombinedLobbyState<State, Context>,
          ) => CombinedLobbyState<State, Context>),
    ) => CombinedLobbyState<State, Context>,
    options?: PluginManagerOptions<CombinedLobbyState<State, Context>>,
  ) {
    this.api = {
      getState: this.getState,
      setState: this.setState,
      on: this.on.bind(this),
      off: this.off.bind(this),
      emit: this.emit.bind(this),
      dispatch: this.dispatch.bind(this),
      getPlugin: this.getPlugin.bind(this),
      hasPlugin: this.hasPlugin.bind(this),
    };

    // Register initial plugins if provided
    if (options?.plugins) {
      for (const plugin of options.plugins) {
        this.register(plugin);
      }
    }

    // Emit initialization event
    this.emit(CoreEvents.INIT);
  }

  /**
   * Register a new plugin
   */
  register(plugin: Plugin<CombinedLobbyState<State, Context>>): void {
    if (this.plugins[plugin.name]) {
      logger.warn(
        `Plugin with name '${plugin.name}' already registered. Skipping.`,
      );
      return;
    }

    this.plugins[plugin.name] = plugin;
    logger.info(`Registered plugin: ${plugin.name}`);

    // Call plugin setup if available
    if (plugin.setup) {
      try {
        this.emit(CoreEvents.BEFORE_SETUP, { plugin: plugin.name });
        plugin.setup(this.api);
        this.emit(CoreEvents.AFTER_SETUP, { plugin: plugin.name });
      } catch (error) {
        logger.error(`Error setting up plugin ${plugin.name}:`, error);
      }
    }
  }

  /**
   * Unregister a plugin by name
   */
  unregister(pluginName: string): boolean {
    const plugin = this.plugins[pluginName];

    if (!plugin) {
      logger.warn(`Plugin '${pluginName}' not found. Nothing to unregister.`);
      return false;
    }

    // Call plugin teardown if available
    if (plugin.teardown) {
      try {
        this.emit(CoreEvents.BEFORE_TEARDOWN, { plugin: pluginName });
        plugin.teardown();
      } catch (error) {
        logger.error(`Error during teardown of plugin ${pluginName}:`, error);
      }
    }

    delete this.plugins[pluginName];
    logger.info(`Unregistered plugin: ${pluginName}`);
    this.emit(CoreEvents.AFTER_TEARDOWN, { plugin: pluginName });
    return true;
  }

  /**
   * Get a plugin by name
   */
  getPlugin(
    name: string,
  ): Plugin<CombinedLobbyState<State, Context>> | undefined {
    return this.plugins[name];
  }

  /**
   * Check if a plugin with the given name is registered
   */
  hasPlugin(name: string): boolean {
    return !!this.plugins[name];
  }

  /**
   * Register an event handler
   */
  on(eventName: string, callback: EventCallback): void {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = [];
    }

    this.eventHandlers[eventName].push(callback);
  }

  /**
   * Unregister an event handler
   */
  off(eventName: string, callback: EventCallback): void {
    const handlers = this.eventHandlers[eventName];
    if (handlers) {
      const index = handlers.indexOf(callback);
      if (index > -1) {
        handlers.splice(index, 1);
      }

      // Clean up if no more handlers for this event
      if (handlers.length === 0) {
        delete this.eventHandlers[eventName];
      }
    }
  }

  /**
   * Emit an event to all registered handlers
   */
  emit(eventName: string, payload?: unknown): void {
    const handlers = this.eventHandlers[eventName];
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(payload);
        } catch (error) {
          logger.error(`Error in event handler for ${eventName}:`, error);
        }
      }
    }
  }

  /**
   * Dispatch an action to be processed by the engine
   */
  dispatch(action: { type: string; payload?: unknown }): void {
    // This is a placeholder for action dispatching
    // Actual implementation would depend on your engine's action handling system
    logger.info(`Dispatching action: ${action.type}`);
    this.emit(`action:${action.type}`, action.payload);
  }

  /**
   * Run the onGameInit hook for all plugins
   */
  onGameInit(state: CombinedLobbyState<State, Context>): void {
    for (const plugin of Object.values(this.plugins)) {
      if (plugin.onGameInit) {
        try {
          plugin.onGameInit(state);
        } catch (error) {
          logger.error(
            `Error running onGameInit for plugin ${plugin.name}:`,
            error,
          );
        }
      }
    }
  }

  /**
   * Run the preMove hook for all plugins
   * Returns false if any plugin returns false
   */
  preMove(state: unknown, action: unknown, playerId: string): boolean {
    for (const plugin of Object.values(this.plugins)) {
      if (plugin.preMove) {
        try {
          const result = plugin.preMove(state, action, playerId);
          if (result === false) {
            logger.info(`Plugin ${plugin.name} blocked move execution`);
            return false;
          }
        } catch (error) {
          logger.error(
            `Error running preMove for plugin ${plugin.name}:`,
            error,
          );
        }
      }
    }
    return true;
  }

  /**
   * Run the postMove hook for all plugins
   */
  postMove(state: unknown, action: unknown, playerId: string): void {
    for (const plugin of Object.values(this.plugins)) {
      if (plugin.postMove) {
        try {
          plugin.postMove(state, action, playerId);
        } catch (error) {
          logger.error(
            `Error running postMove for plugin ${plugin.name}:`,
            error,
          );
        }
      }
    }
    this.emit(CoreEvents.MOVE_PROCESSED, { state, action, playerId });
  }

  /**
   * Run the onPlayerJoin hook for all plugins
   */
  onPlayerJoin(state: unknown, playerId: string, playerData?: unknown): void {
    for (const plugin of Object.values(this.plugins)) {
      if (plugin.onPlayerJoin) {
        try {
          plugin.onPlayerJoin(state, playerId, playerData);
        } catch (error) {
          logger.error(
            `Error running onPlayerJoin for plugin ${plugin.name}:`,
            error,
          );
        }
      }
    }
  }

  /**
   * Run the onPlayerLeave hook for all plugins
   */
  onPlayerLeave(state: unknown, playerId: string): void {
    for (const plugin of Object.values(this.plugins)) {
      if (plugin.onPlayerLeave) {
        try {
          plugin.onPlayerLeave(state, playerId);
        } catch (error) {
          logger.error(
            `Error running onPlayerLeave for plugin ${plugin.name}:`,
            error,
          );
        }
      }
    }
  }

  /**
   * Run the onPlayerReady hook for all plugins
   */
  onPlayerReady(state: unknown, playerId: string, isReady: boolean): void {
    for (const plugin of Object.values(this.plugins)) {
      if (plugin.onPlayerReady) {
        try {
          plugin.onPlayerReady(state, playerId, isReady);
        } catch (error) {
          logger.error(
            `Error running onPlayerReady for plugin ${plugin.name}:`,
            error,
          );
        }
      }
    }
  }

  /**
   * Clean up all plugins and event handlers
   */
  dispose(): void {
    this.emit(CoreEvents.BEFORE_TEARDOWN);

    // Teardown all plugins
    for (const [name, plugin] of Object.entries(this.plugins)) {
      if (plugin.teardown) {
        try {
          plugin.teardown();
        } catch (error) {
          logger.error(`Error during teardown of plugin ${name}:`, error);
        }
      }
    }

    // Clear all plugins and event handlers
    this.plugins = {};
    this.eventHandlers = {};

    this.emit(CoreEvents.AFTER_TEARDOWN);
  }
}
