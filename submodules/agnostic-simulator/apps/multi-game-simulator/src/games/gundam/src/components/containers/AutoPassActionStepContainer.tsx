import { useEffect, useRef } from "react";
import type { EngineInteractionView, InteractionAction } from "@tcg/protocol";

import { useGundamGame } from "../../game/index.ts";
import { useAutoPassWhenNoValidAction } from "../../lib/auto-pass-settings.tsx";

type AutomaticPriorityPassMove = "passBlock" | "passBattleAction" | "passActionStep";

interface AutomaticPassDecision {
  readonly move: AutomaticPriorityPassMove;
  readonly requestId: string;
}

function enabledAction(
  actions: readonly InteractionAction[],
  actionId: string,
): InteractionAction | undefined {
  return actions.find((action) => action.id === actionId && action.enabled);
}

export function automaticPassDecision(
  view: Pick<EngineInteractionView, "status" | "actions">,
): AutomaticPassDecision | null {
  if (view.status !== "ready") return null;
  const enabled = view.actions.filter((action) => action.enabled);
  const passBlock = enabledAction(enabled, "passBlock");
  if (passBlock && !enabledAction(enabled, "declareBlock")) {
    return { move: "passBlock", requestId: passBlock.requestId };
  }

  for (const move of ["passBattleAction", "passActionStep"] as const) {
    const pass = enabledAction(enabled, move);
    if (
      pass &&
      !enabledAction(enabled, "playCommand") &&
      !enabledAction(enabled, "activateAbility")
    ) {
      return { move, requestId: pass.requestId };
    }
  }
  return null;
}

/**
 * Auto-passes the viewer's Block or Action response only when the interaction
 * view exposes no legal Gundam alternative to passing.
 *
 * Safety rails:
 *  - `status === "ready"` excludes pending choices and waiting viewers.
 *  - Exact move ids prevent concede, admin moves, and `passTurn` from being
 *    treated as safe automation.
 *  - The deferred callback revalidates the same request immediately before
 *    submitting and records one attempt per request id.
 */
export function AutoPassActionStepContainer() {
  const { adapter, store } = useGundamGame();
  const setting = useAutoPassWhenNoValidAction();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSubmittedRequestRef = useRef<string | null>(null);

  useEffect(() => {
    const maybeAutoPass = () => {
      if (
        !setting.ready ||
        !setting.enabled ||
        adapter.commandGate.isBlocked() ||
        timeoutRef.current !== null
      ) {
        return;
      }
      const decision = automaticPassDecision(store.getSnapshot().interactionView);
      if (!decision || lastSubmittedRequestRef.current === decision.requestId) return;

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        if (adapter.commandGate.isBlocked()) return;
        const currentDecision = automaticPassDecision(store.getSnapshot().interactionView);
        if (!currentDecision || currentDecision.requestId !== decision.requestId) {
          maybeAutoPass();
          return;
        }
        const outcome = adapter.submit(currentDecision.move, { automatic: true });
        if (outcome.ok) {
          lastSubmittedRequestRef.current = currentDecision.requestId;
        }
      }, 0);
    };

    maybeAutoPass();
    const unsubscribeStore = store.subscribe(maybeAutoPass);
    const unsubscribeCommandGate = adapter.commandGate.subscribe(maybeAutoPass);
    return () => {
      unsubscribeStore();
      unsubscribeCommandGate();
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };
  }, [adapter, setting.enabled, setting.ready, store]);

  return null;
}
