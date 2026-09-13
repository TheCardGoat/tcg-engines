import type { FabMatchState } from "../../state.ts";

export type FabEndTurnResult =
  | { readonly accepted: true; readonly state: FabMatchState }
  | {
      readonly accepted: false;
      readonly state: FabMatchState;
      readonly error: string;
      readonly errorCode: string;
    };
