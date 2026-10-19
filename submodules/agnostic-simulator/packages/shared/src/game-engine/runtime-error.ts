/** Operational failures must not be reported as illegal player actions. */
export class GameRuntimeError extends Error {
  constructor(
    readonly code: "game_state_incompatible" | "game_engine_failed",
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "GameRuntimeError";
  }
}
