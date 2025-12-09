/**
 * Events that can be triggered in the core engine
 */
export var CoreEvents;
(function (CoreEvents) {
    // Lifecycle events
    CoreEvents["INIT"] = "core:init";
    CoreEvents["BEFORE_SETUP"] = "core:before_setup";
    CoreEvents["AFTER_SETUP"] = "core:after_setup";
    CoreEvents["BEFORE_TEARDOWN"] = "core:before_teardown";
    CoreEvents["AFTER_TEARDOWN"] = "core:after_teardown";
    // Lobby events
    CoreEvents["LOBBY_CREATED"] = "lobby:created";
    CoreEvents["LOBBY_JOINED"] = "lobby:joined";
    CoreEvents["LOBBY_LEFT"] = "lobby:left";
    CoreEvents["LOBBY_PLAYER_READY"] = "lobby:player_ready";
    CoreEvents["LOBBY_STATE_UPDATE"] = "lobby:state_update";
    CoreEvents["LOBBY_FULL"] = "lobby:full";
    CoreEvents["LOBBY_READY"] = "lobby:ready";
    CoreEvents["LOBBY_TIMED_OUT"] = "lobby:timed_out";
    // Game events (to be expanded based on game engine needs)
    CoreEvents["GAME_STARTED"] = "game:started";
    CoreEvents["GAME_ENDED"] = "game:ended";
    CoreEvents["TURN_STARTED"] = "game:turn_started";
    CoreEvents["TURN_ENDED"] = "game:turn_ended";
    CoreEvents["PHASE_CHANGED"] = "game:phase_changed";
    // Player events
    CoreEvents["PLAYER_CHANGED"] = "player:changed";
    CoreEvents["ACTIVE_PLAYERS_CHANGED"] = "player:active_changed";
    // Move events
    CoreEvents["MOVE_PROCESSED"] = "move:processed";
})(CoreEvents || (CoreEvents = {}));
/**
 * Standard plugin names used internally or for default plugins
 */
export var PluginNames;
(function (PluginNames) {
    PluginNames["EVENTS"] = "events";
    PluginNames["LOGGER"] = "logger";
    PluginNames["TIMER"] = "timer";
})(PluginNames || (PluginNames = {}));
//# sourceMappingURL=types.js.map