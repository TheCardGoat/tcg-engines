// biome-ignore lint/suspicious/noShadowRestrictedNames: Object import from ts-toolbelt is necessary
import type { Object } from "ts-toolbelt";
import type * as ActionCreators from "./action-creators";

export namespace ActionShape {
  type StripCredentials<T extends CredentialedActionShape.Any> = Object.P.Omit<
    T,
    ["credentials"]
  >;
  export type MakeMove = StripCredentials<CredentialedActionShape.MakeMove>;
  export type GameEvent = StripCredentials<CredentialedActionShape.GameEvent>;
  export type AutomaticGameEvent =
    StripCredentials<CredentialedActionShape.AutomaticGameEvent>;
  export type Sync = ReturnType<typeof ActionCreators.sync>;
  export type Update = ReturnType<typeof ActionCreators.update>;
  export type Patch = ReturnType<typeof ActionCreators.patch>;
  export type Reset = ReturnType<typeof ActionCreators.reset>;
  export type Undo = StripCredentials<CredentialedActionShape.Undo>;
  export type Redo = StripCredentials<CredentialedActionShape.Redo>;
  // Private type used only for internal error processing.
  // Included here to preserve type-checking of reducer inputs.
  export type StripTransients = ReturnType<
    typeof ActionCreators.stripTransients
  >;

  export type Any =
    | MakeMove
    | GameEvent
    | AutomaticGameEvent
    | Sync
    | Update
    | Patch
    | Reset
    | Undo
    | Redo
    | StripTransients;
}

export namespace ActionPayload {
  type GetPayload<T extends ActionShape.Any> = Object.At<T, "payload">;
  export type MakeMove = GetPayload<ActionShape.MakeMove>;
  export type GameEvent = GetPayload<ActionShape.GameEvent>;
}

export namespace CredentialedActionShape {
  export type MakeMove = ReturnType<typeof ActionCreators.makeMove>;
  export type GameEvent = ReturnType<typeof ActionCreators.gameEvent>;
  export type AutomaticGameEvent = ReturnType<
    typeof ActionCreators.automaticGameEvent
  >;
  export type Undo = ReturnType<typeof ActionCreators.undo>;
  export type Redo = ReturnType<typeof ActionCreators.redo>;
  export type Any = MakeMove | GameEvent | AutomaticGameEvent | Undo | Redo;
}
