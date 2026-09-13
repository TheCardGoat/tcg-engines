export type SimulatorAnimationDiagnostic =
  | {
      readonly type: "stale-update";
      readonly receivedVersion: number;
      readonly authoritativeVersion: number;
    }
  | { readonly type: "missing-node"; readonly transitionId: string; readonly ref: string }
  | { readonly type: "watchdog"; readonly transitionId: string }
  | { readonly type: "cancelled"; readonly transitionId: string; readonly reason: string };

export type SimulatorAnimationDiagnosticListener = (
  diagnostic: SimulatorAnimationDiagnostic,
) => void;
