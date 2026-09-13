import { useMemo } from "react";

import { asCardInstanceId, asMoveName, useInteractionView } from "../../game/index.ts";
import { useGundamInteractionDraft } from "../../game/interaction-draft.tsx";
import { cardActionIdsFromInteractionView } from "../containers/interaction.ts";
import type { CardAction } from "./CardInfoDialog.tsx";
import { CardInfoDialog } from "./CardInfoDialog.tsx";
import { useCardInspect } from "./card/card-inspect-context.tsx";

export function CardInspectDialog() {
  const ctx = useCardInspect();
  const interactionView = useInteractionView();
  const draft = useGundamInteractionDraft();

  const card = ctx?.inspected?.card ?? null;
  const cardId = card?.id ?? null;

  const { actions, dispatch } = useMemo(() => {
    if (!cardId) return { actions: [] as CardAction[], dispatch: () => {} };
    const branded = asCardInstanceId(cardId);

    if (draft.input?.kind === "entity-selection" && draft.candidateIds.has(branded)) {
      const act: CardAction = {
        id: "resolve-target",
        label: "Select as target",
        tone: "primary",
      };
      return {
        actions: [act],
        dispatch: (id: string) => {
          if (id === "resolve-target") draft.toggleEntity(draft.input!.id, cardId);
        },
      };
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
        const action = interactionView.actions.find((candidate) => candidate.id === move);
        const source = action?.inputs.find(
          (input) => input.kind === "entity-selection" && input.role === "source",
        );
        draft.begin(move, source ? { [source.id]: [cardId] } : undefined);
      },
    };
  }, [cardId, draft, interactionView]);

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
