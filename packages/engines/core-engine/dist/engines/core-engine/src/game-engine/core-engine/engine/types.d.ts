import type { Object } from "ts-toolbelt";
import type * as ActionCreators from "./action-creators";
export declare namespace ActionShape {
    type StripCredentials<T extends CredentialedActionShape.Any> = Object.P.Omit<T, [
        "credentials"
    ]>;
    export type MakeMove = StripCredentials<CredentialedActionShape.MakeMove>;
    export type GameEvent = StripCredentials<CredentialedActionShape.GameEvent>;
    export type AutomaticGameEvent = StripCredentials<CredentialedActionShape.AutomaticGameEvent>;
    export type Sync = ReturnType<typeof ActionCreators.sync>;
    export type Update = ReturnType<typeof ActionCreators.update>;
    export type Patch = ReturnType<typeof ActionCreators.patch>;
    export type Reset = ReturnType<typeof ActionCreators.reset>;
    export type Undo = StripCredentials<CredentialedActionShape.Undo>;
    export type Redo = StripCredentials<CredentialedActionShape.Redo>;
    export type StripTransients = ReturnType<typeof ActionCreators.stripTransients>;
    export type Any = MakeMove | GameEvent | AutomaticGameEvent | Sync | Update | Patch | Reset | Undo | Redo | StripTransients;
    export {};
}
export declare namespace ActionPayload {
    type GetPayload<T extends ActionShape.Any> = Object.At<T, "payload">;
    export type MakeMove = GetPayload<ActionShape.MakeMove>;
    export type GameEvent = GetPayload<ActionShape.GameEvent>;
    export {};
}
export declare namespace CredentialedActionShape {
    type MakeMove = ReturnType<typeof ActionCreators.makeMove>;
    type GameEvent = ReturnType<typeof ActionCreators.gameEvent>;
    type AutomaticGameEvent = ReturnType<typeof ActionCreators.automaticGameEvent>;
    type Undo = ReturnType<typeof ActionCreators.undo>;
    type Redo = ReturnType<typeof ActionCreators.redo>;
    type Any = MakeMove | GameEvent | AutomaticGameEvent | Undo | Redo;
}
//# sourceMappingURL=types.d.ts.map