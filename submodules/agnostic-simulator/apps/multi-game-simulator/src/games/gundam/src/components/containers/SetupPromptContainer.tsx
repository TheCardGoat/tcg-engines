import { useCallback } from "react";

import { m } from "../../lib/i18n/messages.ts";
import { asMoveName, useBoardProjection, useGundamGame, useViewerId } from "../../game/index.ts";
import { ChooseFirstPlayerPrompt } from "../ui/ChooseFirstPlayerPrompt.tsx";
import { MulliganPrompt } from "../ui/MulliganPrompt.tsx";
import { WaitingForOpponentPrompt } from "../ui/WaitingForOpponentPrompt.tsx";
import { resolveOpponentId } from "./mappers.ts";
import { useSubmitError } from "./submit-error-context.tsx";

/**
 * Surfaces phase-driven setup prompts — the moves the engine is waiting on
 * during the setup segment that the UI must collect from the viewer:
 *
 *   - `choose-first-player` → who takes Turn 1 (rules 6-2-1-4)
 *   - `mulligan`            → keep or redraw the initial hand (6-2-1-6)
 *
 * Local-pending prompts for main-phase moves keep living in
 * {@link PromptContainer}; this container is deliberately dedicated to setup
 * so its branches don't tangle with the existing mid-game logic.
 */
export function SetupPromptContainer() {
  const view = useBoardProjection();
  const viewerId = useViewerId();
  const { adapter } = useGundamGame();
  const { report } = useSubmitError();

  const phase = view.status.phase;
  const viewerIdStr = String(viewerId);

  // --- choose-first-player ----------------------------------------------------

  const submitChoose = useCallback(
    (playerId: string) => {
      report(adapter.submit(asMoveName("chooseFirstPlayer"), { playerId }));
    },
    [adapter, report],
  );

  const onChooseSelf = useCallback(() => {
    submitChoose(viewerIdStr);
  }, [submitChoose, viewerIdStr]);

  const onChooseOpponent = useCallback(() => {
    const opponent = resolveOpponentId(view, viewerIdStr);
    if (!opponent) return;
    submitChoose(opponent);
  }, [submitChoose, view, viewerIdStr]);

  // --- mulligan ---------------------------------------------------------------

  const submitAlterHand = useCallback(
    (wantsRedraw: boolean) => {
      report(adapter.submit(asMoveName("alterHand"), { wantsRedraw }));
    },
    [adapter, report],
  );

  const onKeepHand = useCallback(() => submitAlterHand(false), [submitAlterHand]);
  const onRedrawHand = useCallback(() => submitAlterHand(true), [submitAlterHand]);

  // --- dispatch ---------------------------------------------------------------

  if (phase === "choose-first-player") {
    return (
      <ChooseFirstPlayerPrompt onChooseSelf={onChooseSelf} onChooseOpponent={onChooseOpponent} />
    );
  }

  if (phase === "mulligan") {
    // The engine's `pendingDecision` list carries the ids of players who
    // still owe a mulligan answer, AND it rotates `activePlayer` through
    // that list one at a time. Only the player who currently holds
    // priority can successfully submit `alterHand` — everybody else gets
    // NOT_ACTIVE_PLAYER back from the engine.
    //
    // Three UI states for the viewer:
    //
    //   - not in pendingDecision    → already mulliganed. Render nothing;
    //                                 engine will advance once opponent
    //                                 also decides.
    //   - pending but not active    → opponent holds priority. Render a
    //                                 waiting status so the viewer knows
    //                                 we're not stuck and it's not their
    //                                 move.
    //   - pending and active        → render the interactive prompt.
    const pending = view.status.pendingDecision ?? [];
    const viewerMustDecide = pending.some((id) => String(id) === viewerIdStr);
    if (!viewerMustDecide) return null;

    const viewerIsActive = String(view.status.activePlayer) === viewerIdStr;
    if (!viewerIsActive) {
      return <WaitingForOpponentPrompt message={m["sim.setup.waiting.mulligan"]()} />;
    }

    return <MulliganPrompt onKeep={onKeepHand} onRedraw={onRedrawHand} />;
  }

  return null;
}
