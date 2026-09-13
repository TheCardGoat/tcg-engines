import type { SimulatorCardAction, SimulatorEntity } from "@tcg/simulator-contract";
import { CardContextMenuController } from "@tcg/simulator-ui";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  useBoardProjection,
  useGundamGame,
  useInteractionView,
  useViewerId,
} from "../game/index.ts";
import { useGundamInteractionDraft } from "../game/interaction-draft.tsx";
import { useLayoutMode } from "../lib/use-layout-mode.ts";
import { projectInteractionCardActions } from "../../../../simulator/card-context/project-card-actions.ts";
import { useSimulatorSettings } from "../../../../simulator/settings/index.ts";
import { countActiveResources, resolveOpponentId, toGameCardData } from "./containers/mappers.ts";
import { useDualMode } from "./ui/dual-mode-context.tsx";
import { useCardInspect } from "./ui/card/card-inspect-context.tsx";
import { toSimulatorEntity } from "./ui/card/to-simulator-entity.ts";
import type { GameCardData } from "./ui/types.ts";
import {
  DIRECT_ATTACK_TARGET,
  GundamAttackInteractionContext,
  legalAttackTargetIds,
  splitAttackCardAction,
} from "./attack-interactions.ts";
import {
  projectAttackerDirectAttackPresentation,
  projectDirectAttackPresentation,
} from "./containers/direct-attack-presentation.ts";

interface GundamCardContextControllerProps {
  readonly children: ReactNode;
}

const ACTION_PRESENTATION: Record<
  string,
  {
    readonly label: string;
    readonly detail: string;
    readonly order: number;
    readonly shortcut: string;
  }
> = {
  deployUnit: {
    label: "Deploy Unit",
    detail: "Pay the Unit's cost and deploy it to a legal battlefield zone.",
    order: 10,
    shortcut: "1",
  },
  deployBase: {
    label: "Deploy Base",
    detail: "Pay the Base's cost and deploy it to your Base Section.",
    order: 20,
    shortcut: "2",
  },
  assignPilot: {
    label: "Pair Pilot",
    detail: "Pair this Pilot with one of your eligible Units.",
    order: 30,
    shortcut: "3",
  },
  playCommand: {
    label: "Play Command",
    detail: "Pay the Command's cost, choose its targets, and resolve its effect.",
    order: 40,
    shortcut: "4",
  },
  playCommandAsPilot: {
    label: "Play as Pilot",
    detail: "Use this Command's Pilot alternative and pair it with an eligible Unit.",
    order: 50,
    shortcut: "5",
  },
  enterBattle: {
    label: "Attack",
    detail: "Rest this Unit, choose a legal battle target, and enter battle.",
    order: 60,
    shortcut: "6",
  },
  activateAbility: {
    label: "Activate Effect",
    detail: "Pay this card's effect cost and complete any required choices.",
    order: 70,
    shortcut: "7",
  },
  declareBlock: {
    label: "Block",
    detail: "Rest this Blocker and change the attack target to it.",
    order: 80,
    shortcut: "8",
  },
  discardToHandLimit: {
    label: "Discard to Hand Limit",
    detail: "Choose cards to discard until your hand contains ten cards.",
    order: 90,
    shortcut: "9",
  },
};

export function GundamCardContextController({ children }: GundamCardContextControllerProps) {
  const view = useBoardProjection();
  const interactionView = useInteractionView();
  const draft = useGundamInteractionDraft();
  const viewerId = String(useViewerId());
  const dual = useDualMode();
  const inspect = useCardInspect();
  const layoutMode = useLayoutMode();
  const { settings, setCardInteractionMode } = useSimulatorSettings();
  const [unitTargetingAttackerId, setUnitTargetingAttackerId] = useState<string | null>(null);
  const { adapter } = useGundamGame();
  const opponentId = resolveOpponentId(view, viewerId);
  const directPresentation = useMemo(
    () => (opponentId ? projectDirectAttackPresentation(view, String(opponentId)) : null),
    [opponentId, view],
  );

  const cardDataById = useMemo(() => {
    const cards = new Map<string, GameCardData>();
    for (const zone of Object.values(view.zones.zones)) {
      for (const card of zone.cards) {
        cards.set(card.instanceId, toGameCardData(view, card));
      }
    }
    return cards;
  }, [view]);

  const entities = useMemo(() => {
    const projected: SimulatorEntity[] = [];
    for (const zone of Object.values(view.zones.zones)) {
      zone.cards.forEach((card, index) => {
        const cardData = cardDataById.get(card.instanceId);
        if (!cardData) return;
        projected.push(
          toSimulatorEntity(cardData, {
            ownerId: card.controllerId,
            zoneId: card.zoneId,
            entityIdSuffix: index,
          }),
        );
      });
    }
    return projected;
  }, [cardDataById, view.zones.zones]);

  const actionsForEntity = useCallback(
    (entityId: string): readonly SimulatorCardAction[] => {
      const entity = entities.find((candidate) => candidate.id === entityId);
      const card = cardDataById.get(entityId);
      if (!entity || !card || entity.face === "hidden" || entity.ownerId !== viewerId) return [];

      const protocolActions = expandActivateEffectActions(
        projectInteractionCardActions(interactionView, entityId, {
          presentationFor(action) {
            const presentation = presentationFor(action.id);
            return {
              ...presentation,
              activation: action.id === "enterBattle" ? "begin-selection" : undefined,
            };
          },
          fallbackDisabledReason: "This action is unavailable in the current Gundam game state.",
        }),
        interactionView,
      );
      const structural = structuralActions(card);
      if (protocolActions.some((action) => action.commandRef === "discardToHandLimit")) {
        structural.push("discardToHandLimit");
      }

      const normalized: SimulatorCardAction[] = [];
      for (const command of structural) {
        const projected = protocolActions.filter(
          (candidate) => String(candidate.commandRef).split(":")[0] === command,
        );
        if (projected.length > 0) {
          normalized.push(...projected);
          continue;
        }
        const presentation = presentationFor(command);
        normalized.push({
          id: `${command}:${entityId}`,
          sourceEntityId: entityId,
          ...presentation,
          activation: "begin-selection",
          commandRef: command,
          availability: {
            kind: "disabled",
            reason: disabledReason(command, card, view, viewerId),
            reasonCode: `gundam.${command}.unavailable`,
          },
        });
      }
      const targetIds = legalAttackTargetIds(adapter, interactionView, entityId);
      const attackerKeywords = [
        ...(card.keywords?.map(({ keyword }) => keyword) ?? []),
        ...(card.grantedKeywords ?? []),
      ];
      const attackerDirectPresentation = directPresentation
        ? projectAttackerDirectAttackPresentation(directPresentation, attackerKeywords)
        : null;
      return normalized.flatMap((action) =>
        splitAttackCardAction(action, targetIds, attackerDirectPresentation),
      );
    },
    [adapter, cardDataById, directPresentation, entities, interactionView, view, viewerId],
  );

  const autoActivationActionsForEntity = useCallback(
    (entityId: string): readonly SimulatorCardAction[] => {
      const card = cardDataById.get(entityId);
      return card ? automaticActionsForCard(card, actionsForEntity(entityId)) : [];
    },
    [actionsForEntity, cardDataById],
  );

  const executeAction = useCallback(
    (action: SimulatorCardAction) => {
      if (action.availability.kind !== "enabled" || !action.commandRef) return;
      const [moveName, mode] = action.commandRef.split(":");
      const protocolAction = interactionView.actions.find((candidate) => candidate.id === moveName);
      const sourceInput = protocolAction?.inputs.find(
        (input) => input.kind === "entity-selection" && input.role === "source",
      );
      const sourceValues = sourceInput ? { [sourceInput.id]: [action.sourceEntityId] } : {};
      if (moveName === "enterBattle" && mode === "player") {
        setUnitTargetingAttackerId(null);
        draft.begin(moveName, { ...sourceValues, target: [DIRECT_ATTACK_TARGET] });
        return;
      }
      if (moveName === "enterBattle" && mode === "unit") {
        setUnitTargetingAttackerId(action.sourceEntityId);
        draft.begin(moveName, sourceValues);
        return;
      }
      if (moveName === "activateAbility" && mode !== undefined) {
        draft.begin(moveName, { ...sourceValues, effectIndex: [mode] });
        return;
      }
      draft.begin(moveName, sourceValues);
    },
    [draft, interactionView.actions],
  );

  useEffect(() => {
    if (unitTargetingAttackerId === null) return;
    const stillSelectingUnit =
      draft.active &&
      draft.actionId === "enterBattle" &&
      draft.input?.kind === "entity-selection" &&
      draft.input.id === "target";
    if (!stillSelectingUnit) setUnitTargetingAttackerId(null);
  }, [draft.actionId, draft.active, draft.input, unitTargetingAttackerId]);

  const promptActive =
    interactionView.status === "choosing" ||
    draft.active ||
    dual.pending !== null ||
    draft.actionId === "resolveEffect";

  const attackInteraction = useMemo(
    () => ({
      unitTargetingAttackerId,
      cancelUnitTargeting: () => {
        setUnitTargetingAttackerId(null);
        draft.cancel();
      },
    }),
    [draft, unitTargetingAttackerId],
  );

  return (
    <GundamAttackInteractionContext.Provider value={attackInteraction}>
      <CardContextMenuController
        entities={entities}
        actionsForEntity={actionsForEntity}
        autoActivationActionsForEntity={autoActivationActionsForEntity}
        mode={settings.cardInteractionMode}
        stateVersion={view.stateID}
        promptActive={promptActive}
        // Block Step / Action Step responses are usually a single legal
        // action on the card — one click/tap should activate it. Hand cards
        // stay menu-first because deployment spends resources and moves the
        // card permanently. Multi-choice cards still open the menu.
        autoActivateSingleEnabledAction
        onModeChange={setCardInteractionMode}
        onAction={executeAction}
        onPreviewEnd={() => inspect?.setHover(null)}
        layoutOverride={layoutMode === "mobile" ? "mobile" : "desktop"}
        visualIdentity={{
          anchorAboveOnMobile: true,
          actionsFirstOnMobile: true,
          dismissPreviewOnOpen: true,
          className: "gd-dark-surface gd-card-context",
        }}
      >
        {children}
      </CardContextMenuController>
    </GundamAttackInteractionContext.Provider>
  );
}

export function automaticActionsForCard(
  card: GameCardData,
  actions: readonly SimulatorCardAction[],
): readonly SimulatorCardAction[] {
  if (card.zoneId?.split(":", 1)[0] === "hand") return [];
  return actions.filter((action) => String(action.commandRef).split(":", 1)[0] !== "enterBattle");
}

function expandActivateEffectActions(
  actions: readonly SimulatorCardAction[],
  interactionView: ReturnType<typeof useInteractionView>,
): SimulatorCardAction[] {
  const actionView = interactionView.actions.find((action) => action.id === "activateAbility");
  const effectInput = actionView?.inputs.find(
    (input) => input.kind === "option-selection" && input.id === "effectIndex",
  );
  if (effectInput?.kind !== "option-selection" || effectInput.options.length === 0) {
    return [...actions];
  }

  return actions.flatMap((action) => {
    if (action.commandRef !== "activateAbility") return [action];
    return effectInput.options.map((option, index) => {
      const effectText =
        typeof option.text.params?.label === "string"
          ? option.text.params.label
          : `Effect ${index + 1}`;
      const presentation = effectActionPresentation(effectText, effectInput.options.length, index);
      return {
        ...action,
        id: `${action.id}:${option.id}`,
        label: presentation.label,
        detail: presentation.detail,
        order: action.order + index / 100,
        commandRef: `${action.commandRef}:${option.id}`,
      };
    });
  });
}

export function effectActionPresentation(
  effectText: string,
  optionCount: number,
  index: number,
): { readonly label: string; readonly detail: string } {
  const keyword = optionCount === 1 ? effectText.match(/^<([^<>]+)>$/)?.[1]?.trim() : undefined;
  if (keyword) {
    const supportAmount = keyword.match(/^Support (\d+)$/u)?.[1];
    if (supportAmount) {
      return {
        label: `Use Support ${supportAmount}`,
        detail: `Rest this Unit to give another friendly Unit +${supportAmount} AP this turn.`,
      };
    }
    return { label: `Use ${keyword}`, detail: keyword };
  }
  const temporaryStat =
    optionCount === 1
      ? effectText.match(/This Unit gets (AP|HP)\+(\d+) during this turn\.$/u)
      : undefined;
  if (temporaryStat) {
    const [, stat, amount] = temporaryStat;
    return {
      label: `Gain +${amount} ${stat}`,
      detail: `This Unit gets +${amount} ${stat} this turn.`,
    };
  }
  return {
    label: optionCount === 1 ? "Activate Effect" : `Activate Effect ${index + 1}`,
    detail: effectText,
  };
}

export function structuralActions(card: GameCardData): string[] {
  const zone = card.zoneId?.split(":", 1)[0];
  const keywords = new Set(
    card.keywords?.map((keyword) => keyword.keyword.toLocaleLowerCase()) ?? [],
  );
  if (zone === "hand") {
    if (card.cardType === "unit") return ["deployUnit"];
    if (card.cardType === "base") return ["deployBase"];
    if (card.cardType === "pilot") return ["assignPilot"];
    if (card.cardType === "command") {
      const pilotAlternative =
        card.effect?.toLocaleLowerCase().includes("pilot") ||
        card.keywords?.some((keyword) => keyword.keyword.toLocaleLowerCase() === "pilot");
      return pilotAlternative ? ["playCommand", "playCommandAsPilot"] : ["playCommand"];
    }
    return [];
  }
  if (zone === "battleArea" && card.cardType === "unit") {
    return [
      "enterBattle",
      ...(card.hasActivatedAbility ? ["activateAbility"] : []),
      ...(keywords.has("blocker") ? ["declareBlock"] : []),
    ];
  }
  if (zone === "baseSection" || zone === "pairedPilot") {
    return card.hasActivatedAbility ? ["activateAbility"] : [];
  }
  return [];
}

function presentationFor(command: string) {
  return (
    ACTION_PRESENTATION[command] ?? {
      label: command.replace(/([a-z0-9])([A-Z])/g, "$1 $2"),
      detail: "Complete this card action using the current game state.",
      order: 100,
      shortcut: "",
    }
  );
}

function disabledReason(
  command: string,
  card: GameCardData,
  view: ReturnType<typeof useBoardProjection>,
  viewerId: string,
): string {
  if (String(view.status.activePlayer) !== viewerId) {
    return "The other player currently has priority.";
  }
  if (command === "declareBlock") {
    if (card.cantBlock) return "An active effect prevents this Unit from blocking.";
    if (card.exerted) return "A rested Unit cannot block.";
    return "You can only block during the attack's Block Step.";
  }
  if (view.status.phase !== "main-phase") {
    return "This action can only be taken during your Main Phase.";
  }
  if (command === "enterBattle") {
    if (card.exerted) return "A rested Unit cannot attack.";
    if (card.deployedThisTurn && !card.isLinkUnit) {
      return "This Unit was deployed this turn and cannot attack unless it has Link.";
    }
    if (card.cantAttack) return "An active effect prevents this Unit from attacking.";
    return "There is no legal battle target for this Unit right now.";
  }
  if (
    (command === "deployUnit" ||
      command === "deployBase" ||
      command === "playCommand" ||
      command === "playCommandAsPilot") &&
    card.cost !== undefined &&
    countActiveResources(view, viewerId) < card.cost
  ) {
    return `This costs ${card.cost}, but only ${countActiveResources(view, viewerId)} Resources are active.`;
  }
  if (command === "assignPilot" || command === "playCommandAsPilot") {
    return "There is no eligible Unit to pair with this Pilot.";
  }
  if (command === "activateAbility") {
    return "This effect's timing, cost, or target requirements are not currently met.";
  }
  if (command === "playCommand") {
    return commandTimingDisabledReason(card.effect);
  }
  return "This card does not currently meet the action's deployment requirements.";
}

export function commandTimingDisabledReason(effectText: string | undefined): string {
  if (effectText?.includes("【Action】") && !effectText.includes("【Main】")) {
    return "This Command can only be played during a battle's Action Step.";
  }
  return "This Command cannot be played in the current timing window.";
}
