import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { asMoveName, usePending, type MoveName } from "../../game/index.ts";

/**
 * Dual-Mode Card Decision Context (rule 3-4-6-2).
 *
 * Some Command cards have a 【Pilot】 keyword, meaning the same card
 * can be played EITHER for its command effect OR paired with a Unit as
 * a Pilot. When both are legal at click-time, the canonical
 * `pickMoveForCard` priority would silently auto-pick one; we don't
 * want that — the player needs to choose.
 *
 * This context holds a tiny piece of UI state ("the card the user
 * tapped is currently lifted, awaiting a half-pick") that lives
 * outside the engine's pending-state machinery. Once the user taps a
 * specific half (command or pilot), we commit to the chosen move via
 * the normal `pending.start()` flow — at which point this context
 * resets to idle and the engine takes over.
 *
 * Auto-routing: when only ONE mode is legal, the dispatcher skips this
 * context entirely and starts the move directly. So this state is only
 * ever populated when the player has a real, two-way choice to make.
 */
export type DualMode = "cmd" | "pilot";

export interface DualModePending {
  readonly cardId: string;
  readonly cmdMove: MoveName;
  readonly pilotMove: MoveName;
}

export interface DualModeContextValue {
  readonly pending: DualModePending | null;
  readonly begin: (p: DualModePending) => void;
  readonly cancel: () => void;
  /**
   * Commit a half-pick. Resolves the chosen move and starts it via the
   * usual pending-move pipeline (so the engine takes over and inline
   * targeting picks up the next step). No-op when nothing is pending.
   */
  readonly commit: (mode: DualMode) => void;
}

const DEFAULT: DualModeContextValue = {
  pending: null,
  begin: () => {},
  cancel: () => {},
  commit: () => {},
};

export const DualModeContext = createContext<DualModeContextValue>(DEFAULT);

export function DualModeProvider({ children }: { readonly children: ReactNode }) {
  const [pending, setPending] = useState<DualModePending | null>(null);
  const pendingMove = usePending();
  const begin = useCallback((p: DualModePending) => setPending(p), []);
  const cancel = useCallback(() => setPending(null), []);
  // Commit a half-pick: start the chosen move via the normal pending
  // pipeline so the engine takes over and the existing inline-targeting
  // flow handles the next step.
  const commit = useCallback(
    (mode: DualMode) => {
      if (!pending) return;
      const move = mode === "cmd" ? pending.cmdMove : pending.pilotMove;
      const cardId = pending.cardId;
      setPending(null);
      pendingMove.startForCard(move, cardId);
    },
    [pending, pendingMove],
  );

  // Esc cancels the lift — matches the inline-targeting affordance
  // ("[ Esc · cancel ]" on the target prompt). Only active while a
  // dual-mode pick is pending so we don't fight other Escape consumers.
  useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPending(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending]);

  const value = useMemo<DualModeContextValue>(
    () => ({ pending, begin, cancel, commit }),
    [pending, begin, cancel, commit],
  );

  return <DualModeContext.Provider value={value}>{children}</DualModeContext.Provider>;
}

export function useDualMode(): DualModeContextValue {
  return useContext(DualModeContext);
}

/**
 * Move name constants — kept colocated with the context so consumers
 * don't sprinkle `asMoveName(...)` calls across the codebase, and
 * adding new dual-mode pairings (e.g. future Unit-with-Pilot cards)
 * means changing one file.
 */
export const PLAY_COMMAND_MOVE = asMoveName("playCommand");
export const PLAY_COMMAND_AS_PILOT_MOVE = asMoveName("playCommandAsPilot");
