/**
 * projectSimulator: pure GameState (+ viewerSeat) -> NarutoProjection.
 *
 * Two output layers (design doc section 3):
 *  - Normalized contract shapes (SimulatorTable / SimulatorEntity[] /
 *    SimulatorInteraction[] / SimulatorEventLogEntry[] / SimulatorTargetingIntent[])
 *    for harness + shared-panel compatibility.
 *  - A naruto board view model (seat halves, chain, pending attack, pending
 *    choice, seam prompt, localized log lines, contextual action pills) that
 *    the DesktopBoard/MobileBoard trees render directly.
 */

import {
  cardOf,
  chainLinkOf,
  characterHealth,
  deciderOf,
  effectivePower,
  findCharacter,
  leaderUid,
  otherPlayer,
  PROVISIONAL_RULES,
} from "@tcg-engines/naruto-engine";
import type {
  AttackerKind,
  CardInstance,
  GameState,
  Phase,
  PlayerId,
  Step,
} from "@tcg-engines/naruto-engine";
import { intentToAction } from "./interactions.ts";
import type {
  SimulatorEntity,
  SimulatorEventLogEntry,
  SimulatorInteraction,
  SimulatorSeat,
  SimulatorTable,
  SimulatorTargetingIntent,
  SimulatorZone,
} from "@tcg/simulator-contract";

import { projectEntities } from "./entities.ts";
import {
  characterActions,
  handCardActions,
  leaderActions,
  legalAttackTargets,
  mulliganActions,
  supportSlotActions,
  tableActions,
  type ActionPill,
} from "./interactions.ts";
import { cardName, choicePromptText, isEffectLogKey, logEntryText, phaseLabel } from "./labels.ts";
import { projectZones } from "./zones.ts";
import { hiddenProjectionId } from "./visibility.ts";

// ---------------------------------------------------------------------------
// Board view model
// ---------------------------------------------------------------------------

export interface LeaderView {
  readonly uid: string;
  readonly cardId: string;
  readonly name: string;
  readonly life: number;
  readonly power: number;
  readonly rested: boolean;
}

export interface VisibleChakraView {
  readonly uid: string;
  readonly cardId: string;
  readonly faceUp: boolean;
  readonly visible: true;
}

export interface HiddenChakraView {
  readonly uid: string;
  readonly faceUp: boolean;
  readonly visible: false;
}

export type ChakraView = VisibleChakraView | HiddenChakraView;

export interface SummonView {
  readonly uid: string;
  readonly cardId: string;
  readonly rested: boolean;
}

export interface CharacterView {
  readonly uid: string;
  readonly cardId: string;
  readonly name: string;
  readonly slotIndex: number;
  readonly rested: boolean;
  readonly damage: number;
  readonly powerBonus: number;
  readonly damageBonus: number;
  readonly power: number;
  readonly health: number;
  readonly doubled: boolean;
  readonly immune: boolean;
  readonly chainLink: number | null;
}

export interface VisibleSupportView {
  readonly uid: string;
  readonly cardId: string;
  readonly slotIndex: number;
  readonly revealed: boolean;
  readonly visible: true;
  readonly name: string;
  readonly cost: number | null;
  readonly chainLink: number | null;
}

export interface HiddenSupportView {
  readonly uid: string;
  readonly slotIndex: number;
  readonly revealed: false;
  readonly visible: false;
  readonly cost: null;
  readonly chainLink: null;
}

export type SupportView = VisibleSupportView | HiddenSupportView;

export interface VisibleHandCardView {
  readonly uid: string;
  readonly cardId: string;
  readonly name: string;
  readonly visible: true;
  readonly isCharacter: boolean;
  readonly isSupport: boolean;
}

export interface HiddenHandCardView {
  readonly uid: string;
  readonly visible: false;
  readonly isCharacter: false;
  readonly isSupport: false;
}

export type HandCardView = VisibleHandCardView | HiddenHandCardView;

export interface SeatView {
  readonly player: PlayerId;
  readonly name: string;
  readonly isActive: boolean;
  readonly isDecider: boolean;
  readonly leader: LeaderView;
  readonly chakra: readonly ChakraView[];
  readonly characters: readonly (CharacterView | null)[];
  readonly supports: readonly (SupportView | null)[];
  readonly hand: readonly HandCardView[];
  readonly deckCount: number;
  readonly trashCount: number;
  readonly trashTop: CardInstance | null;
  readonly exCount: number;
  readonly summon: SummonView;
}

export interface ChainLinkView {
  readonly link: number;
  readonly uid: string;
  readonly cardId: string;
  readonly name: string;
  readonly player: PlayerId;
}

export interface AttackView {
  readonly attackerUid: string;
  readonly attackerKind: AttackerKind;
  readonly attackerName: string;
  readonly power: number;
  /** Damage the pending attack will deal under the current Preview profile. */
  readonly damage: number;
  readonly targetUid: string;
  readonly targetKind: "leader" | "character";
  /** Character-only forecast. Supports can still change this before resolution. */
  readonly willKo: boolean;
}

export interface ChoiceOptionView {
  readonly key: string;
  readonly cardId: string;
  readonly name: string;
  readonly owner: PlayerId;
  readonly zone: "character" | "leader" | "hand" | "deck" | "trash";
}

export interface ChoiceView {
  readonly player: PlayerId;
  readonly prompt: string;
  readonly cancellable: boolean;
  readonly source: string;
  /** Board-zone option uids (character/leader) - rendered as targetable rings. */
  readonly boardTargetUids: readonly string[];
  /** Non-board options (hand/deck/trash) - rendered in the ChoiceModal grid. */
  readonly modalOptions: readonly ChoiceOptionView[];
  readonly isModal: boolean;
}

export interface LogLine {
  readonly id: string;
  readonly turn: number;
  readonly actor: string;
  readonly text: string;
  readonly nested: boolean;
}

export interface PromptView {
  readonly text: string;
  readonly hint: string | null;
  readonly showPass: boolean;
  readonly showEndTurn: boolean;
}

export interface NarutoProjection {
  // normalized contract layer
  readonly table: SimulatorTable;
  readonly entities: readonly SimulatorEntity[];
  readonly interactions: readonly SimulatorInteraction[];
  readonly eventLog: readonly SimulatorEventLogEntry[];
  readonly targetingIntents: readonly SimulatorTargetingIntent[];
  // naruto board view model
  readonly viewer: PlayerId;
  readonly decider: PlayerId | null;
  readonly bottom: SeatView;
  readonly top: SeatView;
  readonly turn: number;
  readonly phase: Phase;
  readonly step: Step;
  readonly winner: PlayerId | null;
  readonly prompt: PromptView;
  readonly chain: readonly ChainLinkView[];
  readonly attack: AttackView | null;
  readonly choice: ChoiceView | null;
  readonly awaitingMulligan: PlayerId | null;
  readonly logLines: readonly LogLine[];
  /** Contextual action pills keyed by entity uid (hand cards, characters, supports, leaders). */
  readonly pills: Readonly<Record<string, readonly ActionPill[]>>;
  /** Seam-level pills for the viewer (pass counter / end turn). */
  readonly seamPills: readonly ActionPill[];
  readonly mulliganPills: readonly ActionPill[];
}

export type NarutoParticipantNames = Partial<Readonly<Record<PlayerId, string>>>;

// ---------------------------------------------------------------------------
// Seat projection
// ---------------------------------------------------------------------------

function seatView(
  state: GameState,
  player: PlayerId,
  viewer: PlayerId,
  decider: PlayerId | null,
  participantNames: NarutoParticipantNames,
): SeatView {
  const seat = state.players[player];
  const leaderCard = cardOf({ uid: leaderUid(player), cardId: seat.leaderId });
  return {
    player,
    name: participantNames[player]?.trim() || seat.name,
    isActive: state.activePlayer === player,
    isDecider: decider === player,
    leader: {
      uid: leaderUid(player),
      cardId: seat.leaderId,
      name: leaderCard?.nameEn ?? seat.leaderId,
      life: seat.life,
      power: leaderCard?.power ?? 0,
      rested: seat.leaderRested,
    },
    chakra: seat.chakra.map((chakra, index) =>
      player === viewer
        ? { uid: chakra.uid, cardId: chakra.cardId, faceUp: chakra.faceUp, visible: true }
        : {
            uid: hiddenProjectionId(viewer, player, "chakra", index),
            faceUp: chakra.faceUp,
            visible: false,
          },
    ),
    characters: seat.characters.map((character, index) => {
      if (!character) return null;
      return {
        uid: character.uid,
        cardId: character.cardId,
        name: cardName(character.cardId),
        slotIndex: index,
        rested: character.rested,
        damage: character.damage,
        powerBonus: character.powerBonus,
        damageBonus: character.damageBonus,
        power: effectivePower(character, state.turn),
        health: characterHealth(character),
        doubled: character.powerDoubledUntilTurn >= state.turn,
        immune: character.supportImmuneUntilTurn >= state.turn,
        chainLink: chainLinkOf(state, character.uid),
      };
    }),
    supports: seat.supports.map((support, index) => {
      if (!support) return null;
      const revealed = support.revealed === true;
      const visible = revealed || player === viewer;
      if (!visible) {
        return {
          uid: hiddenProjectionId(viewer, player, "support", index),
          slotIndex: index,
          revealed: false,
          visible: false,
          cost: null,
          chainLink: null,
        } satisfies HiddenSupportView;
      }
      const card = cardOf(support);
      return {
        uid: support.uid,
        cardId: support.cardId,
        slotIndex: index,
        revealed,
        visible: true,
        name: card?.support?.name ?? cardName(support.cardId),
        cost: card?.support?.cost ?? null,
        chainLink: chainLinkOf(state, support.uid),
      } satisfies VisibleSupportView;
    }),
    hand: seat.hand.map((instance, index) => {
      const visible = player === viewer;
      if (!visible) {
        return {
          uid: hiddenProjectionId(viewer, player, "hand", index),
          visible: false,
          isCharacter: false,
          isSupport: false,
        } satisfies HiddenHandCardView;
      }
      const card = cardOf(instance);
      return {
        uid: instance.uid,
        cardId: instance.cardId,
        name: cardName(instance.cardId),
        visible: true,
        isCharacter: card?.cardType === "character" || card?.cardType === "ex_character",
        isSupport: card?.support != null,
      } satisfies VisibleHandCardView;
    }),
    deckCount: seat.deck.length,
    trashCount: seat.trash.length,
    trashTop: seat.trash[seat.trash.length - 1] ?? null,
    exCount: seat.exPile.length,
    summon: {
      uid: seat.summon.uid,
      cardId: seat.summon.cardId,
      rested: seat.summon.rested,
    },
  };
}

// ---------------------------------------------------------------------------
// Prompt text
// ---------------------------------------------------------------------------

function promptView(
  state: GameState,
  viewer: PlayerId,
  decider: PlayerId | null,
  participantNames: NarutoParticipantNames,
): PromptView {
  const playerName = (player: PlayerId) =>
    participantNames[player]?.trim() || state.players[player].name;
  const phase = phaseLabel(state.phase, state.step);
  if (state.winner) {
    const winnerName = playerName(state.winner);
    return { text: `${winnerName} wins`, hint: null, showPass: false, showEndTurn: false };
  }
  if (state.pendingChoice) {
    const who =
      state.pendingChoice.player === viewer ? "You" : playerName(state.pendingChoice.player);
    return {
      text: choicePromptText(state.pendingChoice.promptKey),
      hint: `${who} must choose${state.pendingChoice.cancellable ? " (or cancel)" : ""}.`,
      showPass: false,
      showEndTurn: false,
    };
  }
  if (state.awaitingMulligan) {
    const who = state.awaitingMulligan === viewer ? "You" : playerName(state.awaitingMulligan);
    return {
      text: "Opening hand",
      hint: `${who} may keep or redraw.`,
      showPass: false,
      showEndTurn: false,
    };
  }
  if (state.step === "counter") {
    const attack = state.pendingAttack;
    const attackerName = attack
      ? attack.attackerKind === "leader"
        ? playerName(attack.attacker) + "'s leader"
        : (findCharacter(state, attack.attackerUid)?.character.cardId ?? "")
      : "";
    const who =
      state.priority === viewer ? "You have" : `${playerName(state.priority ?? viewer)} has`;
    return {
      text: attack ? `Attack by ${cardName(attackerName)}` : "Counter step",
      hint: `${who} priority - chain a support or pass.`,
      showPass: state.priority === viewer,
      showEndTurn: false,
    };
  }
  const who =
    state.activePlayer === viewer ? "Your turn" : `${playerName(state.activePlayer)}'s turn`;
  return {
    text: `${who} - ${phase}`,
    hint: decider === viewer ? "Summon, set supports, attack, or end your turn." : null,
    showPass: false,
    showEndTurn: decider === viewer,
  };
}

// ---------------------------------------------------------------------------
// Pill map
// ---------------------------------------------------------------------------

function pillMap(state: GameState, viewer: PlayerId): Record<string, readonly ActionPill[]> {
  const map: Record<string, readonly ActionPill[]> = {};
  for (const instance of state.players[viewer].hand) {
    map[instance.uid] = handCardActions(state, viewer, instance.uid);
  }
  state.players[viewer].characters.forEach((character) => {
    if (character) map[character.uid] = characterActions(state, viewer, character.uid);
  });
  state.players[viewer].supports.forEach((support, slot) => {
    if (support) map[support.uid] = supportSlotActions(state, viewer, slot);
  });
  map[leaderUid(viewer)] = leaderActions(state, viewer);
  return map;
}

// ---------------------------------------------------------------------------
// Normalized interactions (harness/shared-panel compatibility)
// ---------------------------------------------------------------------------

function normalizedInteractions(state: GameState, viewer: PlayerId): SimulatorInteraction[] {
  const interactions: SimulatorInteraction[] = [];
  const push = (
    id: string,
    label: string,
    prompt: string,
    command: string,
    payload: unknown,
    input: SimulatorInteraction["input"],
    sourceEntityId?: string,
  ) => {
    interactions.push({
      id,
      label,
      prompt,
      sourceEntityId,
      input,
      movePreview: { engine: "naruto", command, payload: JSON.stringify(payload) },
    });
  };

  const actionInput: SimulatorInteraction["input"] = {
    kind: "action",
    candidateEntityIds: [],
    targetZoneIds: [],
    options: [],
  };

  for (const pill of tableActions(state, viewer)) {
    if (!pill.enabled) continue;
    push(
      pill.id,
      pill.label,
      pill.label,
      intentToAction(viewer, pill.intent).type,
      pill.intent,
      actionInput,
    );
  }
  for (const pill of mulliganActions(state, viewer)) {
    if (!pill.enabled) continue;
    push(pill.id, pill.label, "Keep or redraw your opening hand?", "MULLIGAN", pill.intent, {
      kind: "option",
      candidateEntityIds: [],
      targetZoneIds: [],
      options: [
        { id: "keep", label: "Keep hand" },
        { id: "redraw", label: "Redraw" },
      ],
    });
  }

  const pills = pillMap(state, viewer);
  for (const [uid, entityPills] of Object.entries(pills)) {
    for (const pill of entityPills) {
      if (!pill.enabled) continue;
      if (pill.intent.kind === "declare-attack") {
        const targets = legalAttackTargets(
          state,
          viewer,
          pill.intent.attackerUid,
          pill.intent.attackerKind,
        );
        push(
          `attack:${uid}`,
          "Attack",
          "Choose an attack target",
          "DECLARE_ATTACK",
          pill.intent,
          {
            kind: "single-target",
            min: 1,
            max: 1,
            candidateEntityIds: targets.map((t) => t.uid),
            targetZoneIds: [],
            options: [],
          },
          uid,
        );
      } else {
        push(
          `${pill.id}:${uid}`,
          pill.label,
          pill.label,
          intentToAction(viewer, pill.intent).type,
          pill.intent,
          actionInput,
          uid,
        );
      }
    }
  }

  if (state.pendingChoice && state.pendingChoice.player === viewer) {
    const choice = state.pendingChoice;
    const boardOptions = choice.options.filter(
      (o) => o.zone === "character" || o.zone === "leader",
    );
    const modalOptions = choice.options.filter(
      (o) => o.zone !== "character" && o.zone !== "leader",
    );
    if (boardOptions.length > 0) {
      push(
        "resolve-choice",
        choicePromptText(choice.promptKey),
        choicePromptText(choice.promptKey),
        "RESOLVE_CHOICE",
        { key: "<selection>" },
        {
          kind: "single-target",
          min: 1,
          max: 1,
          candidateEntityIds: boardOptions.map((o) => o.key),
          targetZoneIds: [],
          options: [],
        },
      );
    } else {
      push(
        "resolve-choice",
        choicePromptText(choice.promptKey),
        choicePromptText(choice.promptKey),
        "RESOLVE_CHOICE",
        { key: "<selection>" },
        {
          kind: "option",
          min: 1,
          max: 1,
          candidateEntityIds: [],
          targetZoneIds: [],
          options: [
            ...modalOptions.map((o) => ({ id: o.key, label: cardName(o.cardId) })),
            ...(choice.cancellable ? [{ id: "__cancel__", label: "Cancel" }] : []),
          ],
        },
      );
    }
  }
  return interactions;
}

// ---------------------------------------------------------------------------
// Log projection
// ---------------------------------------------------------------------------

function logLines(state: GameState, participantNames: NarutoParticipantNames): LogLine[] {
  const names = {
    p1: participantNames.p1?.trim() || state.players.p1.name,
    p2: participantNames.p2?.trim() || state.players.p2.name,
  };
  const playerAliases = {
    p1: names.p1,
    p2: names.p2,
    [state.players.p1.name]: names.p1,
    [state.players.p2.name]: names.p2,
  };
  return state.log.map((entry, index) => ({
    id: `${index}-${entry.key}`,
    turn: entry.turn,
    actor: entry.actor,
    text: logEntryText(entry, names, playerAliases),
    nested: isEffectLogKey(entry.key),
  }));
}

function eventLog(lines: readonly LogLine[], state: GameState): SimulatorEventLogEntry[] {
  return lines.map((line) => ({
    id: line.id,
    turn: line.turn,
    phase: phaseLabel(state.phase, state.step),
    seatId: line.actor === "system" ? undefined : line.actor,
    timestamp: "",
    message: line.text,
    tags: line.actor === "system" ? ["system"] : line.nested ? ["ability"] : ["move"],
  }));
}

// ---------------------------------------------------------------------------
// Main projection
// ---------------------------------------------------------------------------

export function projectSimulator(
  state: GameState,
  viewerSeat: PlayerId = "p1",
  participantNames: NarutoParticipantNames = {},
): NarutoProjection {
  const viewer = viewerSeat;
  const opponent = otherPlayer(viewer);
  const decider = deciderOf(state);
  const entities = projectEntities(state, viewer);
  const zones: SimulatorZone[] = projectZones(state, viewer);
  const lines = logLines(state, participantNames);

  const seats: SimulatorSeat[] = ([viewer, opponent] as const).map((player, index) => {
    const seat = state.players[player];
    return {
      id: player,
      label: participantNames[player]?.trim() || seat.name,
      role: player === viewer ? "human" : "agent",
      perspective: index === 0 ? "bottom" : "top",
      counters: [
        { label: "Life", value: String(seat.life) },
        { label: "Chakra", value: String(seat.chakra.filter((c) => c.faceUp).length) },
        { label: "Hand", value: String(seat.hand.length) },
      ],
    };
  });

  const table: SimulatorTable = {
    status: {
      activeSeatId: state.activePlayer,
      phase: phaseLabel(state.phase, state.step),
      turn: state.turn,
      stateVersion: state.log.length,
    },
    seats,
    zones,
  };

  const attack: AttackView | null = state.pendingAttack
    ? (() => {
        const pending = state.pendingAttack;
        if (!pending) return null;
        let power = 0;
        let printedDamage = 0;
        let attackerName = "";
        if (pending.attackerKind === "leader") {
          const card = cardOf({
            uid: pending.attackerUid,
            cardId: state.players[pending.attacker].leaderId,
          });
          power = card?.power ?? 0;
          printedDamage = card?.damage ?? 0;
          attackerName = card?.nameEn ?? "Leader";
        } else {
          const location = findCharacter(state, pending.attackerUid);
          if (location) {
            power = effectivePower(location.character, state.turn);
            printedDamage =
              (cardOf(location.character)?.damage ?? 0) + location.character.damageBonus;
            attackerName = cardName(location.character.cardId);
          }
        }
        const damage =
          pending.targetKind === "leader"
            ? PROVISIONAL_RULES.damageToLeaderUses === "damage"
              ? printedDamage
              : power
            : PROVISIONAL_RULES.damageToCharacterUses === "damage"
              ? printedDamage
              : power;
        const target =
          pending.targetKind === "character" && pending.targetUid
            ? findCharacter(state, pending.targetUid)
            : null;
        return {
          attackerUid: pending.attackerUid,
          attackerKind: pending.attackerKind,
          attackerName,
          power,
          damage,
          targetUid: pending.targetUid ?? leaderUid(otherPlayer(pending.attacker)),
          targetKind: pending.targetKind,
          willKo: target
            ? target.character.damage + damage >= characterHealth(target.character)
            : false,
        };
      })()
    : null;

  // Choice options can contain private hand/deck identities. Only the player
  // who must answer receives them; other viewers get the generic prompt via
  // `promptView` without an interaction-bearing choice payload.
  const choice: ChoiceView | null =
    state.pendingChoice && state.pendingChoice.player === viewer
      ? (() => {
          const pending = state.pendingChoice;
          if (!pending) return null;
          const boardTargetUids = pending.options
            .filter((o) => o.zone === "character" || o.zone === "leader")
            .map((o) => o.key);
          const modalOptions: ChoiceOptionView[] = pending.options
            .filter((o) => o.zone !== "character" && o.zone !== "leader")
            .map((o) => ({
              key: o.key,
              cardId: o.cardId,
              name: cardName(o.cardId),
              owner: o.owner,
              zone: o.zone,
            }));
          return {
            player: pending.player,
            prompt: choicePromptText(pending.promptKey),
            cancellable: pending.cancellable,
            source: pending.source,
            boardTargetUids,
            modalOptions,
            isModal: boardTargetUids.length === 0,
          };
        })()
      : null;

  const targetingIntents: SimulatorTargetingIntent[] = attack
    ? [
        {
          id: "pending-attack",
          sourceEntityId: attack.attackerUid,
          targetEntityIds: [attack.targetUid],
          targetZoneIds: [],
          preview: { damage: attack.damage },
        },
      ]
    : [];

  return {
    table,
    entities,
    interactions: normalizedInteractions(state, viewer),
    eventLog: eventLog(lines, state),
    targetingIntents,
    viewer,
    decider,
    bottom: seatView(state, viewer, viewer, decider, participantNames),
    top: seatView(state, opponent, viewer, decider, participantNames),
    turn: state.turn,
    phase: state.phase,
    step: state.step,
    winner: state.winner,
    prompt: promptView(state, viewer, decider, participantNames),
    chain: state.chain.map((link, index) => ({
      link: index + 1,
      uid: link.uid,
      cardId: link.cardId,
      name: cardOf({ uid: link.uid, cardId: link.cardId })?.support?.name ?? cardName(link.cardId),
      player: link.player,
    })),
    attack,
    choice,
    awaitingMulligan: state.awaitingMulligan,
    logLines: lines,
    pills: pillMap(state, viewer),
    seamPills: tableActions(state, viewer),
    mulliganPills: mulliganActions(state, viewer),
  };
}
