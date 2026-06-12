import type { Side } from "../../engine";

export type { Side };
export type Phase = "SETUP" | "START" | "MAIN" | "END";

// Phases the player actually passes through during a turn. SETUP is the
// pregame mulligan state; END is set only when the match is over.
export const TURN_PHASES: Phase[] = ["START", "MAIN"];
