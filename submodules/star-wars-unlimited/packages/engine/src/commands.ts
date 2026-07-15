import type { SwuEffect } from "@tcg/star-wars-unlimited-types";
import { conditionMet, executeEffects } from "./effects.ts";
import { resolveAttack } from "./combat.ts";
import {
  effectiveKeywords,
  effectiveTraits,
  getDefinition,
  logMove,
  moveCardToZone,
  opponentOf,
} from "./state.ts";
import { resolveTarget } from "./targets.ts";
import type { CommandResult, MatchState, PlayerId, RuntimeEvent, SwuCommand } from "./types.ts";

function fail(state: MatchState, error: string): CommandResult {
  return { success: false, error, state };
}

function ok(state: MatchState): CommandResult {
  return { success: true, state };
}

function requireActive(state: MatchState, playerId: PlayerId): string | null {
  if (state.phase === "complete") return "Match is complete.";
  if (state.pendingChoices.length > 0) return "A pending choice must be resolved first.";
  if (state.activePlayer !== playerId) return "It is not that player's turn.";
  return null;
}

function advancePriority(state: MatchState): void {
  const next = opponentOf(state.activePlayer);
  state.activePlayer = state.players[next].passed ? state.activePlayer : next;
  if (state.players["player-one"].passed && state.players["player-two"].passed) {
    state.phase = "regroup";
    state.phaseHistory.unitsDefeatedByController["player-one"] = 0;
    state.phaseHistory.unitsDefeatedByController["player-two"] = 0;
    state.players["player-one"].passed = false;
    state.players["player-two"].passed = false;
  }
}

function keywordAmount(text: string | null | undefined, keyword: string): number {
  const match = text?.match(new RegExp(`\\b${keyword}\\s+(\\d+)`, "i"));
  return match ? Number.parseInt(match[1], 10) : 1;
}

export function executeTriggeredAbilities(
  state: MatchState,
  event: RuntimeEvent,
  playerId: PlayerId,
): void {
  for (const card of Object.values(state.cards)) {
    const isEventSource = card.instanceId === event.sourceId;
    const isDefeatedSource = card.instanceId === event.defeatedId;
    if (
      !isEventSource &&
      !isDefeatedSource &&
      card.zone !== "base" &&
      card.zone !== "leader" &&
      card.zone !== "groundArena" &&
      card.zone !== "spaceArena"
    ) {
      continue;
    }
    const definition = state.definitions[card.definitionId];
    if (!definition) continue;
    for (const ability of definition.abilities ?? []) {
      if (ability.trigger?.event === "attacked" && card.instanceId !== event.defenderId) {
        continue;
      }
      if (
        ability.kind === "keyword" ||
        ability.kind === "constant" ||
        ability.trigger?.event !== event.type ||
        !(ability.conditions ?? []).every((condition) =>
          conditionMet(condition, {
            state,
            playerId: card.controller,
            sourceId: card.instanceId,
            choices: {
              attacker: event.attackerId ?? "",
              defender: event.defenderId ?? "",
              defeated: event.defeatedId ?? "",
            },
          }),
        )
      )
        continue;
      const sourcePlayerId = card.controller;
      executeEffects(ability.effects ?? [], {
        state,
        playerId: sourcePlayerId,
        sourceId: card.instanceId,
        choices: {
          attacker: event.attackerId ?? "",
          defender: event.defenderId ?? "",
          defeated: event.defeatedId ?? "",
        },
      });
      logMove(state, {
        playerId: sourcePlayerId,
        type: "trigger.resolve",
        message: `${definition.title} resolves ${event.type}.`,
        public: true,
      });
    }
  }
  for (const delayed of state.delayedEffects) {
    if (!delayed.id.startsWith(`${event.type}-`)) continue;
    executeEffects(delayed.effects ?? [], {
      state,
      playerId,
      sourceId: event.sourceId ?? event.attackerId ?? "",
    });
  }
  state.delayedEffects = state.delayedEffects.filter(
    (delayed) => !delayed.id.startsWith(`${event.type}-`),
  );
}

export function applyCommand(state: MatchState, command: SwuCommand): CommandResult {
  switch (command.type) {
    case "activateAbility": {
      const activeError = requireActive(state, command.playerId);
      if (activeError) return fail(state, activeError);
      const card = state.cards[command.sourceId];
      if (!card || card.controller !== command.playerId)
        return fail(state, "Ability source is not controlled by player.");
      const definition = getDefinition(state, command.sourceId);
      const ability = (definition.abilities ?? [])[command.abilityIndex];
      if (!ability) return fail(state, "Ability does not exist.");
      if (ability.kind === "keyword" || ability.kind === "constant")
        return fail(state, "Ability is not activatable.");
      const resolutionContext = {
        state,
        playerId: command.playerId,
        sourceId: command.sourceId,
      };
      if (
        (ability.conditions ?? []).every((condition) => conditionMet(condition, resolutionContext))
      ) {
        executeEffects(ability.effects ?? [], resolutionContext);
      }
      if (
        definition.cardType === "leader" &&
        (card.zone === "groundArena" || card.zone === "spaceArena")
      ) {
        executeTriggeredAbilities(
          state,
          { type: "deployed", sourceId: command.sourceId },
          command.playerId,
        );
      }
      logMove(state, {
        playerId: command.playerId,
        type: "move.activateAbility",
        message: `${definition.title} resolves an ability.`,
        public: true,
      });
      advancePriority(state);
      return ok(state);
    }
    case "attack": {
      const activeError = requireActive(state, command.playerId);
      if (activeError) return fail(state, activeError);
      const attackResult = resolveAttack(
        state,
        command.playerId,
        command.attackerId,
        command.defenderId,
        {
          onTrigger: (event, playerId) => executeTriggeredAbilities(state, event, playerId),
        },
      );
      if (!attackResult.success) return fail(state, attackResult.error ?? "Attack is not legal.");
      advancePriority(state);
      return ok(state);
    }
    case "concede":
      state.phase = "complete";
      logMove(state, {
        playerId: command.playerId,
        type: "move.concede",
        message: "Player conceded.",
        public: true,
      });
      return ok(state);
    case "mulligan":
      logMove(state, {
        playerId: command.playerId,
        type: "move.mulligan",
        message: "Player took a mulligan.",
        public: true,
      });
      return ok(state);
    case "pass": {
      const activeError = requireActive(state, command.playerId);
      if (activeError) return fail(state, activeError);
      state.players[command.playerId].passed = true;
      logMove(state, {
        playerId: command.playerId,
        type: "move.pass",
        message: "Player passed.",
        public: true,
      });
      advancePriority(state);
      return ok(state);
    }
    case "playCard": {
      const activeError = requireActive(state, command.playerId);
      if (activeError) return fail(state, activeError);
      const card = state.cards[command.cardId];
      if (!card || card.controller !== command.playerId)
        return fail(state, "Card is not controlled by player.");
      const definition = getDefinition(state, command.cardId);
      const isSmugglePlay = card.zone === "resource" && card.keywords.includes("smuggle");
      const pilotTarget = command.targetId ? state.cards[command.targetId] : undefined;
      const isPilotingPlay =
        card.zone === "hand" && card.keywords.includes("piloting") && !!pilotTarget;
      const attachAbility = (definition.abilities ?? []).find(
        (ability) => ability.kind === "constant" && /^Attach to /i.test(ability.text),
      );
      const isUpgradeAttach =
        card.zone === "hand" && definition.cardType === "upgrade" && !!pilotTarget;
      if (card.zone !== "hand" && !isSmugglePlay)
        return fail(state, "Card is not playable from its current zone.");
      if (isPilotingPlay) {
        if (
          pilotTarget.controller !== command.playerId ||
          (pilotTarget.zone !== "groundArena" && pilotTarget.zone !== "spaceArena") ||
          !effectiveTraits(state, pilotTarget).some((trait) => trait.toLowerCase() === "vehicle")
        ) {
          return fail(state, "Pilot target must be a friendly Vehicle unit.");
        }
      }
      if (isUpgradeAttach) {
        const targetDefinition = getDefinition(state, pilotTarget.instanceId);
        const defaultLegalAttach =
          pilotTarget.controller === command.playerId &&
          (pilotTarget.zone === "groundArena" || pilotTarget.zone === "spaceArena") &&
          (targetDefinition.cardType === "unit" || targetDefinition.cardType === "token");
        const restrictedLegalAttach = attachAbility?.target
          ? resolveTarget(attachAbility.target, {
              state,
              playerId: command.playerId,
              sourceId: command.cardId,
            }).some((target) => target.instanceId === pilotTarget.instanceId)
          : defaultLegalAttach;
        if (!restrictedLegalAttach) {
          return fail(state, "Upgrade target is not legal.");
        }
      }
      const playZone =
        definition.cardType === "event"
          ? "discard"
          : isPilotingPlay || isUpgradeAttach
            ? pilotTarget.zone
            : definition.arena === "space"
              ? "spaceArena"
              : "groundArena";
      const smuggleReplacement = isSmugglePlay
        ? Object.values(state.cards).find(
            (candidate) => candidate.owner === command.playerId && candidate.zone === "deck",
          )
        : undefined;
      moveCardToZone(state, command.cardId, playZone);
      card.playedThisPhase = true;
      if (isPilotingPlay) {
        pilotTarget.upgrades.push(command.cardId);
        logMove(state, {
          playerId: command.playerId,
          type: "framework.piloting.attach",
          message: `${definition.title} was attached as a Pilot.`,
          public: true,
        });
      }
      if (isUpgradeAttach) {
        pilotTarget.upgrades.push(command.cardId);
        logMove(state, {
          playerId: command.playerId,
          type: "framework.upgrade.attach",
          message: `${definition.title} was attached as an upgrade.`,
          public: true,
        });
      }
      if (isSmugglePlay && smuggleReplacement) {
        moveCardToZone(state, smuggleReplacement.instanceId, "resource");
        smuggleReplacement.exhausted = true;
        logMove(state, {
          playerId: command.playerId,
          type: "framework.smuggle.replace",
          message: "Smuggle replaced the resource with the top card of the deck.",
          public: true,
        });
      }
      const cardKeywords = effectiveKeywords(state, card);
      if (cardKeywords.includes("shielded")) {
        card.shield += 1;
      }
      executeTriggeredAbilities(
        state,
        { type: "played", sourceId: command.cardId },
        command.playerId,
      );
      if (
        cardKeywords.includes("exploit") &&
        Object.values(state.cards).some((candidate) => {
          const candidateDefinition = state.definitions[candidate.definitionId];
          return (
            candidate.instanceId !== command.cardId &&
            candidate.controller === command.playerId &&
            (candidate.zone === "groundArena" || candidate.zone === "spaceArena") &&
            candidateDefinition?.cardType === "unit"
          );
        })
      ) {
        const exploitAmount = keywordAmount(definition.text, "exploit");
        const exploitDefeat: SwuEffect = {
          type: "defeat",
          target: {
            type: "card",
            controller: "friendly",
            zones: ["groundArena", "spaceArena"],
            cardTypes: ["unit"],
            excludeSelf: true,
            limit: exploitAmount,
          },
        };
        state.pendingChoices.push({
          id: `choice-${state.nextChoiceNumber++}`,
          playerId: command.playerId,
          sourceId: command.cardId,
          prompt: "Resolve Exploit?",
          options: [
            { id: "yes", label: `Exploit ${exploitAmount}`, effects: [exploitDefeat] },
            { id: "no", label: "Decline", effects: [] },
          ],
        });
      }
      if (
        cardKeywords.includes("ambush") &&
        (playZone === "groundArena" || playZone === "spaceArena") &&
        Object.values(state.cards).some((candidate) => {
          const candidateDefinition = state.definitions[candidate.definitionId];
          return (
            candidate.controller !== command.playerId &&
            candidate.zone === playZone &&
            candidateDefinition?.cardType === "unit"
          );
        })
      ) {
        const ambushAttack: SwuEffect = {
          type: "attack",
          attacker: { type: "self" },
          defender: {
            type: "card",
            controller: "opponent",
            zones: [playZone],
            cardTypes: ["unit"],
            limit: 1,
          },
        };
        state.pendingChoices.push({
          id: `choice-${state.nextChoiceNumber++}`,
          playerId: command.playerId,
          sourceId: command.cardId,
          prompt: "Resolve Ambush?",
          options: [
            { id: "yes", label: "Ambush", effects: [ambushAttack] },
            { id: "no", label: "Decline", effects: [] },
          ],
        });
      }
      if (
        cardKeywords.includes("support") &&
        Object.values(state.cards).some((candidate) => {
          const candidateDefinition = state.definitions[candidate.definitionId];
          return (
            candidate.instanceId !== command.cardId &&
            candidate.controller === command.playerId &&
            !candidate.exhausted &&
            (candidate.zone === "groundArena" || candidate.zone === "spaceArena") &&
            candidateDefinition?.cardType === "unit"
          );
        })
      ) {
        const supportAttack: SwuEffect = {
          type: "attack",
          attacker: {
            type: "card",
            controller: "friendly",
            zones: ["groundArena", "spaceArena"],
            cardTypes: ["unit"],
            exhausted: false,
            excludeSelf: true,
            limit: 1,
          },
          defender: { type: "base", controller: "opponent" },
        };
        state.pendingChoices.push({
          id: `choice-${state.nextChoiceNumber++}`,
          playerId: command.playerId,
          sourceId: command.cardId,
          prompt: "Resolve Support?",
          options: [
            { id: "yes", label: "Support", effects: [supportAttack] },
            { id: "no", label: "Decline", effects: [] },
          ],
        });
      }
      logMove(state, {
        playerId: command.playerId,
        type: "move.playCard",
        message: `${definition.title} was played.`,
        public: true,
      });
      advancePriority(state);
      return ok(state);
    }
    case "resolveChoice": {
      const choice = state.pendingChoices.find((candidate) => candidate.id === command.choiceId);
      if (!choice || choice.playerId !== command.playerId)
        return fail(state, "Choice is not available.");
      const option = choice.options.find((candidate) => candidate.id === command.optionId);
      if (!option) return fail(state, "Choice option is not available.");
      state.pendingChoices = state.pendingChoices.filter(
        (candidate) => candidate.id !== command.choiceId,
      );
      executeEffects(option.effects ?? [], {
        state,
        playerId: command.playerId,
        sourceId: choice.sourceId,
      });
      logMove(state, {
        playerId: command.playerId,
        type: "move.resolveChoice",
        message: option.label,
        public: true,
      });
      return ok(state);
    }
  }
}
