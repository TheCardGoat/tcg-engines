import { useCallback, useState } from "react";
import { TOKEN_PRINTINGS } from "@tcg/gundam-token-data";
import type { Card } from "@tcg/gundam-types";

import { asMoveName, useBoardProjection, useGundamGame } from "../../game/index.ts";
import { ResolveBar } from "../ui/PendingEffects.tsx";
import { DeckLookResolver } from "../ui/DeckLookResolver.tsx";
import type {
  DeckLookConfirmResult,
  GameCardData,
  PendingEffect,
  PendingEffectKind,
} from "../ui/types.ts";
import { usePendingEffectSelection } from "../ui/pending-effect-selection-context.tsx";
import { asCardColor, findCardByInstanceId } from "./mappers.ts";
import { useSubmitError } from "./submit-error-context.tsx";

export function PendingEffectsContainer() {
  const view = useBoardProjection();
  const { adapter } = useGundamGame();
  const prompt = adapter.pendingChoice();
  const { report } = useSubmitError();
  const pendingEffectSelection = usePendingEffectSelection();
  const [deckLookOpen, setDeckLookOpen] = useState(false);

  const onAccept = useCallback(() => {
    if (!prompt) return;
    if (prompt.kind === "optional") {
      report(
        adapter.submit(asMoveName("resolveEffect"), {
          pendingEffectId: prompt.effectId,
          optionalAnswers: { [prompt.directiveIndex]: true },
        }),
      );
      return;
    }
    if (prompt.kind === "targetSelection") {
      if (!pendingEffectSelection.isComplete) return;
      report(
        adapter.submit(asMoveName("resolveEffect"), {
          pendingEffectId: prompt.effectId,
          targets: [...pendingEffectSelection.selectedTargetIds],
        }),
      );
      return;
    }
    if (prompt.kind === "ordering") {
      report(
        adapter.submit(asMoveName("resolveEffect"), {
          pendingEffectId: prompt.effectId,
        }),
      );
    }
  }, [prompt, adapter, report, pendingEffectSelection]);

  const onDeckLookConfirm = useCallback(
    (result: DeckLookConfirmResult) => {
      if (!prompt || prompt.kind !== "deckLook") return;
      report(
        adapter.submit(asMoveName("resolveEffect"), {
          pendingEffectId: prompt.effectId,
          deckLookAnswers: {
            [result.directiveIndex]: {
              ...(result.tutorCardId ? { tutorCardId: result.tutorCardId } : {}),
              toTop: result.toTop.map((card) => card.id).filter((id): id is string => !!id),
              toBottom: result.toBottom.map((card) => card.id).filter((id): id is string => !!id),
              toTrash: result.toTrash.map((card) => card.id).filter((id): id is string => !!id),
            },
          },
          ...(prompt.acceptOptionalDirectiveIndex !== undefined
            ? { optionalAnswers: { [prompt.acceptOptionalDirectiveIndex]: true } }
            : {}),
        }),
      );
      setDeckLookOpen(false);
    },
    [adapter, prompt, report],
  );

  const onDecline = useCallback(() => {
    if (!prompt) return;
    if (prompt.kind === "optional") {
      report(
        adapter.submit(asMoveName("resolveEffect"), {
          pendingEffectId: prompt.effectId,
          optionalAnswers: { [prompt.directiveIndex]: false },
        }),
      );
      return;
    }
    if (prompt.kind === "targetSelection" && prompt.minTargets === 0) {
      report(
        adapter.submit(asMoveName("resolveEffect"), {
          pendingEffectId: prompt.effectId,
          targets: [],
        }),
      );
    }
    if (prompt.kind === "deckLook" && prompt.acceptOptionalDirectiveIndex !== undefined) {
      report(
        adapter.submit(asMoveName("resolveEffect"), {
          pendingEffectId: prompt.effectId,
          optionalAnswers: { [prompt.acceptOptionalDirectiveIndex]: false },
        }),
      );
    }
  }, [prompt, adapter, report]);

  if (!prompt) return null;

  const sourceCard =
    "sourceCardId" in prompt ? findCardByInstanceId(view, prompt.sourceCardId) : null;
  const def = sourceCard?.definition as
    | { name?: string; cost?: number; color?: string }
    | null
    | undefined;

  const kind: PendingEffectKind =
    prompt.kind === "optional"
      ? "yes-no"
      : prompt.kind === "targetSelection"
        ? "select-any"
        : prompt.kind === "chooseOne"
          ? "choose-one"
          : prompt.kind === "deckLook"
            ? "deck-look"
            : "confirm";

  const chooseOptions =
    prompt.kind === "chooseOne"
      ? prompt.options.map((opt) => ({
          index: opt.index,
          label: opt.label || `Option ${opt.index + 1}`,
          previewCard: optionPreviewCard(opt.label),
          onClick: () => {
            report(
              adapter.submit(asMoveName("resolveEffect"), {
                // Thread `pendingEffectId` so the click resolves the
                // intended modal head even when the priority head shifts
                // mid-resolution (rule 10-1-6-5 ordering paths). Mirrors
                // the `ordering` branch above.
                pendingEffectId: prompt.effectId,
                chooseOneAnswers: { [prompt.directiveIndex]: opt.index },
              }),
            );
          },
        }))
      : undefined;

  const effect: PendingEffect = {
    id: prompt.effectId,
    source: {
      name: def?.name ?? "Unknown",
      cost: def?.cost,
      color: asCardColor(def?.color),
    },
    title: prompt.prompt,
    kind,
    acceptLabel: prompt.kind === "optional" ? "Resolve" : undefined,
    declineLabel:
      prompt.kind === "optional"
        ? "Skip"
        : prompt.kind === "deckLook" && prompt.acceptOptionalDirectiveIndex !== undefined
          ? "Skip"
          : prompt.kind === "targetSelection" && prompt.minTargets === 0
            ? "Skip effect"
            : undefined,
    confirmDisabled:
      prompt.kind === "targetSelection"
        ? !pendingEffectSelection.isComplete ||
          (prompt.minTargets === 0 && pendingEffectSelection.selectedTargetIds.length === 0)
        : false,
    ...(chooseOptions ? { chooseOptions } : {}),
    ...(prompt.kind === "deckLook"
      ? {
          deckLook: {
            directiveIndex: prompt.directiveIndex,
            returnMode: prompt.returnMode,
            remainingDestination: prompt.remainingDestination,
            tutorDestination: prompt.tutorDestination,
            legalTutorIds: prompt.legalTutorCardIds,
            acceptOptionalDirectiveIndex: prompt.acceptOptionalDirectiveIndex,
            revealed: prompt.revealedCardIds.flatMap((id): GameCardData[] => {
              const def = adapter.cardDefinitionOf(id);
              return def ? [{ ...cardDefinitionToPreview(def), id }] : [];
            }),
          },
        }
      : {}),
  };

  return (
    <>
      <ResolveBar
        effect={effect}
        onAccept={onAccept}
        onDecline={onDecline}
        onExpand={() => {
          /* full stack panel — Phase 5 */
        }}
        onResolveModal={() => {
          if (effect.kind === "deck-look") setDeckLookOpen(true);
        }}
      />
      {deckLookOpen && effect.kind === "deck-look" && (
        <DeckLookResolver
          key={effect.id}
          effect={effect}
          onConfirm={onDeckLookConfirm}
          onCancel={() => setDeckLookOpen(false)}
        />
      )}
    </>
  );
}

const TOKEN_PRINTINGS_BY_NAME = new Map(
  Object.values(TOKEN_PRINTINGS)
    .filter((card): card is NonNullable<typeof card> => card != null)
    .map((card) => [card.name.toLowerCase(), card]),
);

function optionPreviewCard(label: string): GameCardData | undefined {
  const token = TOKEN_PRINTINGS_BY_NAME.get(label.toLowerCase());
  return token ? cardDefinitionToPreview(token) : undefined;
}

function cardDefinitionToPreview(def: Card): GameCardData {
  const isUnit = def.type === "unit";
  const isBase = def.type === "base";
  return {
    name: def.name,
    subtitle: subtitleForPreview(def),
    color: asCardColor(def.color),
    cost: def.cost,
    level: def.level,
    cardType: def.type,
    ap: isUnit ? def.ap : null,
    hp: isUnit || isBase ? def.hp : null,
    baseAp: isUnit ? def.ap : null,
    baseHp: isUnit || isBase ? def.hp : null,
    effect: def.effect,
    keywords: def.keywordEffects,
    traits: def.traits,
    set: setOf(def),
    cardNumber: def.cardNumber,
    rarity: def.rarity,
    highlight: true,
  };
}

function setOf(def: Card): string | undefined {
  const prefix = def.cardNumber.split("-")[0];
  return prefix ? prefix.toLowerCase() : undefined;
}

function subtitleForPreview(def: Card): string {
  const traits = def.traits.slice(0, 2).join(" · ");
  const type = def.type.toUpperCase();
  return traits ? `${type} · ${traits}` : type;
}
