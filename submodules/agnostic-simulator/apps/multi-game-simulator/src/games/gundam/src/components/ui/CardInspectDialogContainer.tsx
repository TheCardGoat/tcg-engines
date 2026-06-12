import { useMemo } from "react";

import {
  asCardInstanceId,
  asMoveName,
  protocolTargetSelection,
  useInteractionView,
  usePending,
} from "../../game/index.ts";
import { cardActionIdsFromInteractionView } from "../containers/interaction.ts";
import type { CardAction } from "./CardInfoDialog.tsx";
import { CardInfoDialog } from "./CardInfoDialog.tsx";
import { useCardInspect } from "./card/card-inspect-context.tsx";
import { usePendingEffectSelection } from "./pending-effect-selection-context.tsx";

export function CardInspectDialog() {
  const ctx = useCardInspect();
  const interactionView = useInteractionView();
  const targetSelection = protocolTargetSelection(interactionView);
  const pending = usePending();
  const pendingEffectSelection = usePendingEffectSelection();

  const card = ctx?.inspected?.card ?? null;
  const cardId = card?.id ?? null;

  const { actions, dispatch } = useMemo(() => {
    if (!cardId) return { actions: [] as CardAction[], dispatch: () => {} };
    const branded = asCardInstanceId(cardId);

    if (targetSelection?.targetIds.includes(branded)) {
      const act: CardAction = {
        id: "resolve-target",
        label: "Select as target",
        tone: "primary",
      };
      return {
        actions: [act],
        dispatch: (id: string) => {
          if (id === "resolve-target") pendingEffectSelection.selectTarget(cardId);
        },
      };
    }

    if (pending.state.status === "collecting") {
      const step = pending.state.steps[0];
      if (step?.kind === "selectTarget" && step.candidateIds.includes(branded)) {
        const act: CardAction = {
          id: "provide-target",
          label: "Select as target",
          tone: "primary",
          hint: humanizeMoveName(pending.state.move),
        };
        return {
          actions: [act],
          dispatch: (id: string) => {
            if (id !== "provide-target") return;
            if (pending.state.status !== "collecting") return;
            const currentStep = pending.state.steps[0];
            if (currentStep?.kind !== "selectTarget") return;
            pending.provideTarget(currentStep, cardId);
          },
        };
      }
    }

    const candidates = cardActionIdsFromInteractionView(cardId, interactionView);
    const list: CardAction[] = candidates.map((move) => ({
      id: String(move),
      label: humanizeMoveName(move),
      tone: move === asMoveName("enterBattle") ? "danger" : "default",
    }));

    return {
      actions: list,
      dispatch: (id: string) => {
        const move = candidates.find((candidate) => String(candidate) === id);
        if (!move) return;
        pending.startForCard(move, cardId);
      },
    };
  }, [cardId, interactionView, pending, targetSelection, pendingEffectSelection]);

  return (
    <CardInfoDialog
      card={card}
      anchor={ctx?.inspected?.anchor ?? null}
      actions={actions}
      onActionClick={(id) => {
        dispatch(id);
        ctx?.closeInspect();
      }}
      onClose={() => ctx?.closeInspect()}
    />
  );
}

function humanizeMoveName(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}
