import type { PlayerId } from "@tcg/cyberpunk-engine";
import type { SimulatorDomDriver, SimulatorDomElement } from "@tcg/simulator-testing";
import { cssString, expectDomAttribute, expectDomCount } from "@tcg/simulator-testing";

import type { EngineAction, EngineActionMatcher } from "../types/e2e";

export type CyberpunkSide = "player" | "opponent";

export const CYBERPUNK_P1 = "p1" as PlayerId;
export const CYBERPUNK_P2 = "p2" as PlayerId;

export type CyberpunkCardZone = "hand" | "field" | "legendArea" | "eddieArea" | "trash" | "deck";

export interface CyberpunkPomCard {
  readonly instanceId: string;
  readonly definitionId: string;
  readonly attachedToId: string | null;
  readonly faceDown: boolean;
  readonly playedThisTurn: boolean;
  readonly spent: boolean;
}

export interface CyberpunkAttackState {
  readonly attackerId: string;
  readonly defenderId: string | null;
  readonly rivalId: PlayerId;
  readonly kind: "fight" | "direct";
  readonly step: "offensive" | "defensive" | "fight" | "defeat" | "steal";
  readonly redirectedByBlocker?: boolean;
  readonly gigsToSteal?: number;
}

export interface CyberpunkPomGigDie {
  readonly id: string;
  readonly dieType: string;
  readonly faceValue: number;
}

export interface CyberpunkPomCardView {
  readonly instanceId: string;
  readonly definitionId: string;
  readonly power: number;
  readonly effectivePower: number;
  readonly attachedGearIds: readonly string[];
  readonly grantedRules: readonly string[];
}

export interface CyberpunkPomTriggerOption {
  readonly triggerId: string;
  readonly sourceCardId: string;
  readonly cardName: string;
  readonly optional: boolean;
}

export type CardReference = { readonly id: string } | { readonly definitionId: string };

function getDefinitionId(ref: CardReference): string {
  return "id" in ref ? ref.id : ref.definitionId;
}

const PLAYER_ID_BY_SIDE: Record<CyberpunkSide, PlayerId> = {
  player: CYBERPUNK_P1,
  opponent: CYBERPUNK_P2,
};

async function expectDomAttributePresent(
  element: SimulatorDomElement,
  name: string,
): Promise<void> {
  const actual = await element.getAttribute(name);
  if (actual === null || actual === "") {
    throw new Error(`Expected ${name} to be present, found ${actual === null ? "null" : '""'}.`);
  }
}

export interface CyberpunkHarnessClient {
  waitForReady(): Promise<void>;
  getHumanSide(): Promise<CyberpunkSide>;
  setHumanSide(side: CyberpunkSide): Promise<void>;
  getDispatchLog(): Promise<ReadonlyArray<{ action: EngineAction; result: unknown }>>;
  clearDispatchLog(): Promise<void>;
  evalEngine<T>(fn: (engine: CyberpunkEngineHandle) => T): Promise<T>;
  evalEngine<T, A>(fn: (engine: CyberpunkEngineHandle, arg: A) => T, arg: A): Promise<T>;
  dispatchEngine<T>(fn: (engine: CyberpunkEngineHandle) => T): Promise<T>;
  dispatchEngine<T, A>(fn: (engine: CyberpunkEngineHandle, arg: A) => T, arg: A): Promise<T>;
}

export class CyberpunkSimulatorPom {
  readonly dom: SimulatorDomDriver;
  readonly harness: CyberpunkHarnessClient;
  readonly playerBoard: CyberpunkBoardPom;
  readonly opponentBoard: CyberpunkBoardPom;

  constructor(dom: SimulatorDomDriver, harness: CyberpunkHarnessClient) {
    this.dom = dom;
    this.harness = harness;
    this.playerBoard = new CyberpunkBoardPom(dom, "player");
    this.opponentBoard = new CyberpunkBoardPom(dom, "opponent");
  }

  async waitForReady(): Promise<void> {
    await this.harness.waitForReady();
    await this.playerBoard.root().waitFor();
  }

  boardForPlayer(player: PlayerId): CyberpunkBoardPom {
    return this.sideForPlayer(player) === "player" ? this.playerBoard : this.opponentBoard;
  }

  getPhase(): Promise<string> {
    return this.harness.evalEngine((engine) => engine.getPhase());
  }

  getTurnNumber(): Promise<number> {
    return this.harness.evalEngine((engine) => engine.getTurnNumber());
  }

  getActivePlayerId(): Promise<PlayerId> {
    return this.harness.evalEngine((engine) => engine.getActivePlayerId());
  }

  isGameOver(): Promise<boolean> {
    return this.harness.evalEngine((engine) => engine.isGameOver());
  }

  getOpponentOf(player: PlayerId): Promise<PlayerId> {
    return this.harness.evalEngine((engine, p) => engine.getOpponentOf(p), player);
  }

  getCardsInZone(
    zone: CyberpunkCardZone,
    player: PlayerId,
  ): Promise<ReadonlyArray<CyberpunkPomCard>> {
    return this.harness.evalEngine(
      (engine, input) =>
        engine.getCardsInZone(input.zone, input.player).map((card) => ({
          instanceId: String(card.instanceId),
          definitionId: card.definitionId,
          attachedToId: typeof card.meta.attachedToId === "string" ? card.meta.attachedToId : null,
          faceDown: card.meta.faceDown,
          playedThisTurn: card.meta.playedThisTurn,
          spent: card.meta.spent,
        })),
      { zone, player },
    );
  }

  async getCardInZoneByDefinitionId(
    zone: CyberpunkCardZone,
    player: PlayerId,
    definitionId: string,
  ): Promise<CyberpunkPomCard> {
    const cards = await this.getCardsInZone(zone, player);
    const card = cards.find((candidate) => candidate.definitionId === definitionId);
    if (!card) {
      throw new Error(
        `No ${zone} card with definition ${definitionId} found for ${String(player)}.`,
      );
    }
    return card;
  }

  async getCardInZoneByInstanceId(
    zone: CyberpunkCardZone,
    player: PlayerId,
    instanceId: string,
  ): Promise<CyberpunkPomCard> {
    const cards = await this.getCardsInZone(zone, player);
    const card = cards.find((candidate) => candidate.instanceId === instanceId);
    if (!card) {
      throw new Error(`No ${zone} card ${instanceId} found for ${String(player)}.`);
    }
    return card;
  }

  async getCard(
    ref: CardReference,
    options?: { zone?: CyberpunkCardZone; player?: PlayerId },
  ): Promise<CyberpunkPomCard & { player: PlayerId; zone: CyberpunkCardZone }> {
    const definitionId = getDefinitionId(ref);
    const zones: CyberpunkCardZone[] = options?.zone
      ? [options.zone]
      : ["field", "hand", "legendArea", "trash", "deck", "eddieArea"];
    const players = options?.player ? [options.player] : [CYBERPUNK_P1, CYBERPUNK_P2];

    for (const player of players) {
      for (const zone of zones) {
        const cards = await this.getCardsInZone(zone, player);
        const card = cards.find((c) => c.definitionId === definitionId);
        if (card) {
          return { ...card, player, zone };
        }
      }
    }
    throw new Error(`No card with definition ${definitionId} found.`);
  }

  getAttackState(): Promise<CyberpunkAttackState | null> {
    return this.harness.evalEngine((engine) => engine.getAttackState());
  }

  getHandSize(player: PlayerId): Promise<number> {
    return this.harness.evalEngine((engine, p) => engine.getCardsInZone("hand", p).length, player);
  }

  getFieldSize(player: PlayerId): Promise<number> {
    return this.harness.evalEngine(
      (engine, p) =>
        engine.getCardsInZone("field", p).filter((card) => !card.meta.attachedToId).length,
      player,
    );
  }

  getFixerDiceCount(player: PlayerId): Promise<number> {
    return this.harness.evalEngine((engine, p) => engine.getFixerDice(p).length, player);
  }

  getGigCount(player: PlayerId): Promise<number> {
    return this.harness.evalEngine((engine, p) => engine.getGigCount(p), player);
  }

  getGigDice(player: PlayerId): Promise<ReadonlyArray<CyberpunkPomGigDie>> {
    return this.harness.evalEngine(
      (engine, p) =>
        engine.getGigDice(p).map((die) => ({
          id: String(die.id),
          dieType: String(die.dieType),
          faceValue: Number(die.faceValue),
        })),
      player,
    );
  }

  getFaceDownLegendsCount(player: PlayerId): Promise<number> {
    return this.harness.evalEngine((engine, p) => engine.getFaceDownLegends(p).length, player);
  }

  getEddies(player: PlayerId): Promise<number> {
    return this.harness.evalEngine((engine, p) => engine.getEddies(p), player);
  }

  getPendingChoiceType(player: PlayerId): Promise<string | null> {
    return this.harness.evalEngine((engine, p) => engine.getPrompt(p).choice?.type ?? null, player);
  }

  getPromptStatus(player: PlayerId): Promise<string> {
    return this.harness.evalEngine((engine, p) => engine.getPrompt(p).status, player);
  }

  getEligibleTargetIds(player: PlayerId): Promise<ReadonlyArray<string>> {
    return this.harness.evalEngine((engine, p) => {
      const eligibleIds = engine.getPrompt(p).choice?.payload.eligibleIds;
      return Array.isArray(eligibleIds) ? eligibleIds.map(String) : [];
    }, player);
  }

  getChoiceCardIds(player: PlayerId): Promise<ReadonlyArray<string>> {
    return this.harness.evalEngine((engine, p) => {
      const cardIds = engine.getPrompt(p).choice?.payload.cardIds;
      return Array.isArray(cardIds) ? cardIds.map(String) : [];
    }, player);
  }

  getSearchDeckRevealedCardIds(player: PlayerId): Promise<ReadonlyArray<string>> {
    return this.harness.evalEngine((engine, p) => {
      const revealedCardIds = engine.getPrompt(p).choice?.payload.revealedCardIds;
      return Array.isArray(revealedCardIds) ? revealedCardIds.map(String) : [];
    }, player);
  }

  getMoveCandidateIds(player: PlayerId, moveId: string): Promise<ReadonlyArray<string>> {
    return this.harness.evalEngine(
      (engine, input) => {
        const move = engine.getPrompt(input.player).availableMoves.find((candidate) => {
          return candidate.moveId === input.moveId;
        });
        if (!move) {
          return [];
        }

        const inputSpec = move.inputSpec;
        if (inputSpec.type === "selectCard") {
          return inputSpec.candidates.map(String);
        }
        if (inputSpec.type === "selectPair") {
          return inputSpec.fromCandidates.map(String);
        }
        if (inputSpec.type === "playCard") {
          return inputSpec.candidates.map((candidate) => String(candidate.cardId));
        }
        if (inputSpec.type === "selectAbility") {
          return inputSpec.candidates.map(
            (candidate) => `${String(candidate.cardId)}:${String(candidate.abilityIndex)}`,
          );
        }
        return [];
      },
      { player, moveId },
    );
  }

  getMoveTargetCandidateIds(player: PlayerId, moveId: string): Promise<ReadonlyArray<string>> {
    return this.harness.evalEngine(
      (engine, input) => {
        const move = engine.getPrompt(input.player).availableMoves.find((candidate) => {
          return candidate.moveId === input.moveId;
        });
        if (!move || move.inputSpec.type !== "selectPair") {
          return [];
        }
        return move.inputSpec.toCandidates.map(String);
      },
      { player, moveId },
    );
  }

  async getBoardMode(player: PlayerId): Promise<string> {
    const mode = await this.boardForPlayer(player).root().getAttribute("data-mode");
    if (!mode) {
      throw new Error(`Expected board mode for ${String(player)} to be present.`);
    }
    return mode;
  }

  getAllowedGigDice(player: PlayerId): Promise<ReadonlyArray<{ id: string; dieType: string }>> {
    return this.harness.evalEngine((engine, p) => {
      const choice = engine.getPrompt(p).choice;
      if (!choice || choice.type !== "gainGig") {
        return [];
      }
      const allowed = choice.payload.allowedDieIds as ReadonlyArray<string>;
      const dice = engine.getState().G.gigDice;
      return allowed.map((id) => ({ id, dieType: String(dice[id]!.dieType) }));
    }, player);
  }

  async getGigDie(dieId: string): Promise<CyberpunkPomGigDie> {
    const die = await this.harness.evalEngine((engine, id) => {
      const found = Object.values(engine.getState().G.gigDice).find((candidate) => {
        return String(candidate.id) === id;
      });
      return found
        ? {
            id: String(found.id),
            dieType: String(found.dieType),
            faceValue: Number(found.faceValue),
          }
        : null;
    }, dieId);
    if (!die) {
      throw new Error(`No gig die ${dieId} found.`);
    }
    return die;
  }

  getStreetCred(player: PlayerId): Promise<number> {
    return this.harness.evalEngine((engine, p) => engine.getStreetCred(p), player);
  }

  getDeckSize(player: PlayerId): Promise<number> {
    return this.harness.evalEngine((engine, p) => engine.getCardsInZone("deck", p).length, player);
  }

  getCardInstanceExists(instanceId: string): Promise<boolean> {
    return this.harness.evalEngine(
      (engine, id) => Object.prototype.hasOwnProperty.call(engine.getState().G.cardIndex, id),
      instanceId,
    );
  }

  async getCardDefinitionId(cardId: string): Promise<string> {
    const definitionId = await this.harness.evalEngine((engine, id) => {
      const card = engine.getState().G.cardIndex[id];
      return typeof card === "object" &&
        card !== null &&
        "definitionId" in card &&
        typeof card.definitionId === "string"
        ? card.definitionId
        : null;
    }, cardId);

    if (!definitionId) {
      throw new Error(`No card definition found for ${cardId}.`);
    }
    return definitionId;
  }

  async getCardView(cardId: string, viewer: PlayerId): Promise<CyberpunkPomCardView>;
  async getCardView(card: CardReference, viewer?: PlayerId): Promise<CyberpunkPomCardView>;
  async getCardView(
    cardOrId: string | CardReference,
    viewer?: PlayerId,
  ): Promise<CyberpunkPomCardView> {
    let cardId: string;
    if (typeof cardOrId === "object") {
      const found = await this.getCard(cardOrId);
      cardId = found.instanceId;
      viewer ??= found.player;
    } else {
      cardId = cardOrId;
      viewer ??= CYBERPUNK_P1;
    }

    const resolvedViewer = viewer;
    const card = await this.harness.evalEngine(
      (engine, input) => {
        const view = engine.getFilteredView(input.viewer);
        for (const player of Object.values(view.players)) {
          for (const zone of Object.values(player.zones)) {
            if (!Array.isArray(zone)) {
              continue;
            }
            const cardView = zone.find((candidate) => candidate.instanceId === input.cardId);
            if (cardView) {
              return {
                instanceId: cardView.instanceId,
                definitionId: cardView.definitionId,
                power: cardView.power,
                effectivePower: cardView.effectivePower,
                attachedGearIds: cardView.attachedGearIds.slice(),
                grantedRules: cardView.grantedRules.slice(),
              };
            }
          }
        }
        return null;
      },
      { cardId, viewer: resolvedViewer },
    );

    if (!card) {
      throw new Error(`No filtered card view for card ${cardId}.`);
    }

    return card;
  }

  getPendingTriggerOptions(player: PlayerId): Promise<ReadonlyArray<CyberpunkPomTriggerOption>> {
    return this.harness.evalEngine((engine, p) => {
      const choice = engine.getPrompt(p).choice;
      if (!choice || choice.type !== "chooseTrigger") {
        return [];
      }

      const options = choice.payload.options ?? [];
      return options.map((option) => ({
        triggerId: option.triggerId,
        sourceCardId: option.sourceCardId,
        cardName: option.cardName,
        optional: option.optional,
      }));
    }, player);
  }

  async pickFirstAllowedDie(player: PlayerId): Promise<string> {
    const allowed = await this.getAllowedGigDice(player);
    const first = allowed[0];
    if (!first) {
      throw new Error(`No gainGig pending choice for ${String(player)}.`);
    }
    return first.id;
  }

  async takeControl(player: PlayerId): Promise<void> {
    const targetSide = this.sideForPlayer(player);
    if ((await this.harness.getHumanSide()) === targetSide) {
      return;
    }
    await this.harness.setHumanSide(targetSide);
    await this.boardForPlayer(player).root().waitFor();
  }

  async mulligan(as: PlayerId): Promise<void> {
    await this.clickPromptVerb(as, "mulligan");
  }

  async keepHand(as: PlayerId): Promise<void> {
    await this.clickPromptVerb(as, "keepHand");
  }

  async passPhase(as: PlayerId): Promise<void> {
    await this.harness.dispatchEngine((engine, player) => engine.passPhase({ as: player }), as);
  }

  async sellCard(cardId: string, as: PlayerId): Promise<void> {
    await this.harness.dispatchEngine(
      (engine, payload) => engine.sellCard(payload.cardId, { as: payload.as }),
      { cardId, as },
    );
  }

  async attackUnit(attackerId: string, defenderId: string, as: PlayerId): Promise<void>;
  async attackUnit(attacker: CardReference, defender: CardReference, as?: PlayerId): Promise<void>;
  async attackUnit(
    attackerOrId: string | CardReference,
    defenderOrId: string | CardReference,
    as?: PlayerId,
  ): Promise<void> {
    let attackerId: string;
    let defenderId: string;
    if (typeof attackerOrId === "object") {
      const attacker = await this.getCard(attackerOrId, { zone: "field" });
      attackerId = attacker.instanceId;
      as ??= attacker.player;
    } else {
      attackerId = attackerOrId;
    }
    if (typeof defenderOrId === "object") {
      const defender = await this.getCard(defenderOrId, { zone: "field" });
      defenderId = defender.instanceId;
    } else {
      defenderId = defenderOrId;
    }
    await this.harness.dispatchEngine(
      (engine, payload) =>
        engine.attackUnit(payload.attackerId, payload.defenderId, { as: payload.as }),
      { attackerId, defenderId, as: as! },
    );
  }

  async attackRival(attackerId: string, as: PlayerId): Promise<void>;
  async attackRival(attacker: CardReference, as?: PlayerId): Promise<void>;
  async attackRival(attackerOrId: string | CardReference, as?: PlayerId): Promise<void> {
    let attackerId: string;
    if (typeof attackerOrId === "object") {
      const attacker = await this.getCard(attackerOrId, { zone: "field" });
      attackerId = attacker.instanceId;
      as ??= attacker.player;
    } else {
      attackerId = attackerOrId;
    }
    await this.harness.dispatchEngine(
      (engine, payload) => engine.attackRival(payload.attackerId, { as: payload.as }),
      { attackerId, as: as! },
    );
  }

  async useBlocker(blockerId: string, as: PlayerId): Promise<void>;
  async useBlocker(blocker: CardReference, as?: PlayerId): Promise<void>;
  async useBlocker(blockerOrId: string | CardReference, as?: PlayerId): Promise<void> {
    let blockerId: string;
    if (typeof blockerOrId === "object") {
      const blocker = await this.getCard(blockerOrId, { zone: "field" });
      blockerId = blocker.instanceId;
      as ??= blocker.player;
    } else {
      blockerId = blockerOrId;
    }
    await this.harness.dispatchEngine(
      (engine, payload) => engine.useBlocker(payload.blockerId, { as: payload.as }),
      { blockerId, as: as! },
    );
  }

  async resolveAttack(
    as: PlayerId,
    options: { pass?: boolean; gigIdsToSteal?: ReadonlyArray<string> } = {},
  ): Promise<void> {
    await this.harness.dispatchEngine(
      (engine, payload) =>
        engine.resolveAttack({
          as: payload.as,
          pass: payload.pass,
          gigIdsToSteal: payload.gigIdsToSteal,
        }),
      { as, pass: options.pass, gigIdsToSteal: options.gigIdsToSteal },
    );
  }

  async gainGig(dieId: string, as: PlayerId): Promise<void> {
    await this.takeControl(as);
    await this.boardForPlayer(as).fixerDie(dieId).click();
  }

  async playCardFromHand(cardId: string, as: PlayerId): Promise<void>;
  async playCardFromHand(card: CardReference, as?: PlayerId): Promise<void>;
  async playCardFromHand(cardOrId: string | CardReference, as?: PlayerId): Promise<void> {
    let cardId: string;
    if (typeof cardOrId === "object") {
      const card = await this.getCard(cardOrId, { zone: "hand" });
      cardId = card.instanceId;
      as ??= card.player;
    } else {
      cardId = cardOrId;
    }
    await this.harness.dispatchEngine(
      (engine, payload) => engine.playCard(payload.cardId, { as: payload.as }),
      { cardId, as: as! },
    );
  }

  async attachGearFromHand(gearId: string, attachToId: string, as: PlayerId): Promise<void> {
    await this.harness.dispatchEngine(
      (engine, payload) =>
        engine.attachGear(payload.gearId, payload.attachToId, { as: payload.as }),
      { gearId, attachToId, as },
    );
  }

  async goSolo(cardId: string, as: PlayerId): Promise<void>;
  async goSolo(card: CardReference, as?: PlayerId): Promise<void>;
  async goSolo(cardOrId: string | CardReference, as?: PlayerId): Promise<void> {
    let cardId: string;
    if (typeof cardOrId === "object") {
      const card = await this.getCard(cardOrId, { zone: "legendArea" });
      cardId = card.instanceId;
      as ??= card.player;
    } else {
      cardId = cardOrId;
    }
    await this.harness.dispatchEngine(
      (engine, payload) =>
        engine.executeMove("goSolo", { args: { cardId: payload.cardId } }, payload.as),
      { cardId, as: as! },
    );
  }

  async callLegend(legendId: string, as: PlayerId): Promise<void>;
  async callLegend(legend: CardReference, as?: PlayerId): Promise<void>;
  async callLegend(legendOrId: string | CardReference, as?: PlayerId): Promise<void> {
    let legendId: string;
    if (typeof legendOrId === "object") {
      const legend = await this.getCard(legendOrId, { zone: "legendArea" });
      legendId = legend.instanceId;
      as ??= legend.player;
    } else {
      legendId = legendOrId;
    }
    await this.harness.dispatchEngine(
      (engine, payload) =>
        engine.executeMove("callLegend", { args: { legendId: payload.legendId } }, payload.as),
      { legendId, as: as! },
    );
  }

  async activateAbility(cardId: string, abilityIndex: number, as: PlayerId): Promise<void>;
  async activateAbility(card: CardReference, abilityIndex: number, as?: PlayerId): Promise<void>;
  async activateAbility(
    cardOrId: string | CardReference,
    abilityIndex: number,
    as?: PlayerId,
  ): Promise<void> {
    let cardId: string;
    if (typeof cardOrId === "object") {
      const card = await this.getCard(cardOrId, { zone: "field" });
      cardId = card.instanceId;
      as ??= card.player;
    } else {
      cardId = cardOrId;
    }
    await this.harness.dispatchEngine(
      (engine, payload) =>
        engine.activateAbility(payload.cardId, payload.abilityIndex, { as: payload.as }),
      { cardId, abilityIndex, as: as! },
    );
  }

  async resolveCardToPlay(cardId: string, as: PlayerId): Promise<void> {
    await this.harness.dispatchEngine(
      (engine, payload) => engine.resolveCardToPlay(payload.cardId, { as: payload.as }),
      { cardId, as },
    );
  }

  async resolveCardToMove(cardId: string, as: PlayerId): Promise<void> {
    await this.harness.dispatchEngine(
      (engine, payload) => engine.resolveCardToMove(payload.cardId, { as: payload.as }),
      { cardId, as },
    );
  }

  async resolveCardToMovePass(as: PlayerId): Promise<void> {
    await this.harness.dispatchEngine(
      (engine, player) => engine.resolveCardToMove(undefined, { as: player, pass: true }),
      as,
    );
  }

  async resolveSearchDeck(selectedCardIds: ReadonlyArray<string>, as: PlayerId): Promise<void> {
    await this.harness.dispatchEngine(
      (engine, payload) =>
        engine.resolveSearchDeck(payload.selectedCardIds.slice(), {
          as: payload.as,
        }),
      { selectedCardIds, as },
    );
  }

  async resolveDiscardFromHand(cardIds: ReadonlyArray<string>, as: PlayerId): Promise<void> {
    await this.harness.dispatchEngine(
      (engine, payload) =>
        engine.resolveDiscardFromHand(payload.cardIds.slice(), {
          as: payload.as,
        }),
      { cardIds, as },
    );
  }

  async resolveEffectTarget(targetIds: ReadonlyArray<string>, as: PlayerId): Promise<void> {
    await this.harness.dispatchEngine(
      (engine, payload) =>
        engine.executeMove(
          "resolveEffectTarget",
          { args: { targetIds: payload.targetIds.slice() } },
          payload.as,
        ),
      { targetIds, as },
    );
  }

  async resolveEffectTargetPass(as: PlayerId): Promise<void> {
    await this.harness.dispatchEngine(
      (engine, player) =>
        engine.executeMove("resolveEffectTarget", { args: { pass: true } }, player),
      as,
    );
  }

  async resolveAdjustGig(value: number, as: PlayerId): Promise<void> {
    await this.harness.dispatchEngine(
      (engine, payload) =>
        engine.executeMove("resolveAdjustGig", { args: { value: payload.value } }, payload.as),
      { value, as },
    );
  }

  async resolveTrigger(triggerId: string, as: PlayerId): Promise<void> {
    await this.harness.dispatchEngine(
      (engine, payload) =>
        engine.executeMove(
          "resolveTrigger",
          { args: { triggerId: payload.triggerId } },
          payload.as,
        ),
      { triggerId, as },
    );
  }

  async resolveTriggerPass(as: PlayerId): Promise<void> {
    await this.harness.dispatchEngine(
      (engine, player) => engine.executeMove("resolveTrigger", { args: { pass: true } }, player),
      as,
    );
  }

  getDispatchLog(): Promise<ReadonlyArray<{ action: EngineAction; result: unknown }>> {
    return this.harness.getDispatchLog();
  }

  clearDispatchLog(): Promise<void> {
    return this.harness.clearDispatchLog();
  }

  async expectStructuralState(): Promise<void> {
    const phase = await this.getPhase();
    const activeSide = this.sideForPlayer(await this.getActivePlayerId());
    const gameStatus = (await this.isGameOver()) ? "ended" : "active";

    await this.expectBoardStructuralState(this.playerBoard, {
      phase,
      activeSide,
      gameStatus,
    });
    await this.expectBoardStructuralState(this.opponentBoard, {
      phase,
      activeSide,
      gameStatus,
    });
  }

  async expectLastDispatch(expected: EngineActionMatcher): Promise<void> {
    const log = await this.getDispatchLog();
    const last = log.at(-1)?.action as Record<string, unknown> | undefined;
    if (!last) {
      throw new Error("Dispatch log is empty.");
    }

    for (const [key, value] of Object.entries(expected)) {
      if (last[key] !== value) {
        throw new Error(
          `Expected dispatch action.${key} to be ${JSON.stringify(value)}, got ${JSON.stringify(
            last[key],
          )}. Full action: ${JSON.stringify(last)}.`,
        );
      }
    }
  }

  async expectHandSize(player: PlayerId, expected: number): Promise<void> {
    const engineCount = await this.getHandSize(player);
    if (engineCount !== expected) {
      throw new Error(`Expected engine hand size ${expected}, got ${engineCount}.`);
    }

    const board = this.boardForPlayer(player);
    await expectDomAttribute(board.handZone(), "data-count", String(expected));
    await expectDomCount(board.handCards(), expected);
  }

  async expectFieldSize(player: PlayerId, expected: number): Promise<void> {
    const engineCount = await this.getFieldSize(player);
    if (engineCount !== expected) {
      throw new Error(`Expected engine field size ${expected}, got ${engineCount}.`);
    }

    const board = this.boardForPlayer(player);
    await expectDomAttribute(board.fieldZone(), "data-count", String(expected));
    await expectDomCount(board.fieldUnits(), expected);
  }

  async expectFixerDiceCount(player: PlayerId, expected: number): Promise<void> {
    const engineCount = await this.getFixerDiceCount(player);
    if (engineCount !== expected) {
      throw new Error(`Expected engine fixer dice count ${expected}, got ${engineCount}.`);
    }

    const board = this.boardForPlayer(player);
    await expectDomAttribute(board.fixerZone(), "data-count", String(expected));

    const fixerCollapsed = (await board.fixerZone().getAttribute("data-collapsed")) === "true";
    if (!fixerCollapsed) {
      await expectDomCount(board.fixerDice(), expected);
    }
  }

  async expectGigCount(player: PlayerId, expected: number): Promise<void> {
    const engineCount = await this.getGigCount(player);
    if (engineCount !== expected) {
      throw new Error(`Expected engine gig count ${expected}, got ${engineCount}.`);
    }

    const board = this.boardForPlayer(player);
    await expectDomAttribute(board.gigRow(), "data-count", String(expected));
    await expectDomCount(board.gigDice(), expected);
  }

  async expectTrashSize(player: PlayerId, expected: number): Promise<void> {
    const engineCount = (await this.getCardsInZone("trash", player)).length;
    if (engineCount !== expected) {
      throw new Error(`Expected engine trash size ${expected}, got ${engineCount}.`);
    }

    await expectDomAttribute(
      this.boardForPlayer(player).trashZone(),
      "data-count",
      String(expected),
    );
  }

  async expectGigValue(dieId: string, expected: number): Promise<void> {
    const die = await this.getGigDie(dieId);
    if (die.faceValue !== expected) {
      throw new Error(`Expected gig ${dieId} face value ${expected}, got ${die.faceValue}.`);
    }

    await expectDomAttribute(
      this.dom.locator(`[data-testid="gig-die"][data-die-id=${cssString(dieId)}]`),
      "data-face",
      String(expected),
    );
  }

  async expectFaceDownLegendsCount(player: PlayerId, expected: number): Promise<void> {
    const engineCount = await this.getFaceDownLegendsCount(player);
    if (engineCount !== expected) {
      throw new Error(`Expected engine face-down legends count ${expected}, got ${engineCount}.`);
    }

    const board = this.boardForPlayer(player);
    await expectDomAttribute(board.legendsZone(), "data-face-down-count", String(expected));
    await expectDomCount(board.faceDownLegendSlots(), expected);
  }

  async expectEddies(player: PlayerId, expected: number): Promise<void> {
    const engineCount = await this.getEddies(player);
    if (engineCount !== expected) {
      throw new Error(`Expected engine eddies ${expected}, got ${engineCount}.`);
    }

    await expectDomAttribute(
      this.boardForPlayer(player).eddiesZone(),
      "data-count",
      String(expected),
    );
  }

  async expectBoardMode(
    player: PlayerId,
    expected: "view" | "select-action" | "select-target",
  ): Promise<void> {
    await expectDomAttribute(this.boardForPlayer(player).root(), "data-mode", expected);
  }

  async expectFieldCardSpent(player: PlayerId, cardId: string, expected: boolean): Promise<void>;
  async expectFieldCardSpent(card: CardReference, expected: boolean): Promise<void>;
  async expectFieldCardSpent(
    playerOrCard: PlayerId | CardReference,
    cardIdOrExpected: string | boolean,
    expected?: boolean,
  ): Promise<void> {
    let player: PlayerId;
    let cardId: string;
    if (typeof playerOrCard === "object") {
      const card = await this.getCard(playerOrCard, { zone: "field" });
      player = card.player;
      cardId = card.instanceId;
      expected = cardIdOrExpected as boolean;
    } else {
      player = playerOrCard;
      cardId = cardIdOrExpected as string;
    }
    const card = await this.getCardInZoneByInstanceId("field", player, cardId);
    if (card.spent !== expected) {
      throw new Error(
        `Expected field card ${cardId} spent=${String(expected)}, got ${String(card.spent)}.`,
      );
    }

    await expectDomAttribute(
      this.boardForPlayer(player).fieldUnit(cardId),
      "data-spent",
      expected ? "true" : "false",
    );
  }

  async expectRenderedFieldCardPower(
    player: PlayerId,
    cardId: string,
    expected: number,
  ): Promise<void> {
    await expectDomAttribute(
      this.boardForPlayer(player).fieldUnit(cardId),
      "data-power",
      String(expected),
    );
  }

  async expectFieldCardEffectivePower(
    player: PlayerId,
    cardId: string,
    expected: number,
  ): Promise<void>;
  async expectFieldCardEffectivePower(card: CardReference, expected: number): Promise<void>;
  async expectFieldCardEffectivePower(
    playerOrCard: PlayerId | CardReference,
    cardIdOrExpected: string | number,
    expected?: number,
  ): Promise<void> {
    let player: PlayerId;
    let cardId: string;
    if (typeof playerOrCard === "object") {
      const card = await this.getCard(playerOrCard, { zone: "field" });
      player = card.player;
      cardId = card.instanceId;
      expected = cardIdOrExpected as number;
    } else {
      player = playerOrCard;
      cardId = cardIdOrExpected as string;
    }
    const card = await this.getCardView(cardId, player);
    if (card.effectivePower !== expected) {
      throw new Error(
        `Expected field card ${cardId} effective power ${expected}, got ${card.effectivePower}.`,
      );
    }

    await expectDomAttribute(
      this.boardForPlayer(player).fieldUnit(cardId),
      "data-power",
      String(expected),
    );
  }

  async expectFieldCardAttachedGearCount(
    player: PlayerId,
    cardId: string,
    expected: number,
  ): Promise<void>;
  async expectFieldCardAttachedGearCount(card: CardReference, expected: number): Promise<void>;
  async expectFieldCardAttachedGearCount(
    playerOrCard: PlayerId | CardReference,
    cardIdOrExpected: string | number,
    expected?: number,
  ): Promise<void> {
    let player: PlayerId;
    let cardId: string;
    if (typeof playerOrCard === "object") {
      const card = await this.getCard(playerOrCard, { zone: "field" });
      player = card.player;
      cardId = card.instanceId;
      expected = cardIdOrExpected as number;
    } else {
      player = playerOrCard;
      cardId = cardIdOrExpected as string;
    }
    const card = await this.getCardView(cardId, player);
    if (card.attachedGearIds.length !== expected) {
      throw new Error(
        `Expected field card ${cardId} attached gear count ${expected}, got ${card.attachedGearIds.length}.`,
      );
    }

    await expectDomAttribute(
      this.boardForPlayer(player).fieldUnit(cardId),
      "data-gear-count",
      String(expected),
    );
  }

  async expectFieldCardGrantedRule(
    player: PlayerId,
    cardId: string,
    rule: string,
    expected: boolean,
  ): Promise<void>;
  async expectFieldCardGrantedRule(
    card: CardReference,
    rule: string,
    expected: boolean,
  ): Promise<void>;
  async expectFieldCardGrantedRule(
    playerOrCard: PlayerId | CardReference,
    cardIdOrRule: string,
    ruleOrExpected: string | boolean,
    expected?: boolean,
  ): Promise<void> {
    let player: PlayerId;
    let cardId: string;
    let rule: string;
    if (typeof playerOrCard === "object") {
      const card = await this.getCard(playerOrCard, { zone: "field" });
      player = card.player;
      cardId = card.instanceId;
      rule = cardIdOrRule;
      expected = ruleOrExpected as boolean;
    } else {
      player = playerOrCard;
      cardId = cardIdOrRule;
      rule = ruleOrExpected as string;
    }
    const card = await this.getCardView(cardId, player);
    const hasRule = card.grantedRules.includes(rule);
    if (hasRule !== expected) {
      throw new Error(
        `Expected field card ${cardId} granted rule ${rule}=${String(expected)}, got ${String(
          hasRule,
        )}.`,
      );
    }

    if (rule === "blocker" || rule === "cantAttack" || rule === "goSolo") {
      await expectDomCount(
        this.boardForPlayer(player).fieldCardRuleBadges(cardId, rule),
        expected ? 1 : 0,
      );
    }
  }

  async expectLegendCardSpent(player: PlayerId, cardId: string, expected: boolean): Promise<void> {
    const card = await this.getCardInZoneByInstanceId("legendArea", player, cardId);
    if (card.spent !== expected) {
      throw new Error(
        `Expected legend card ${cardId} spent=${String(expected)}, got ${String(card.spent)}.`,
      );
    }

    await expectDomAttribute(
      this.boardForPlayer(player).legendSlot(cardId),
      "data-spent",
      expected ? "true" : "false",
    );
  }

  async expectLegendCardAttachedGearCount(
    player: PlayerId,
    cardId: string,
    expected: number,
  ): Promise<void> {
    const card = await this.getCardView(cardId, player);
    if (card.attachedGearIds.length !== expected) {
      throw new Error(
        `Expected legend card ${cardId} attached gear count ${expected}, got ${card.attachedGearIds.length}.`,
      );
    }

    await expectDomCount(this.boardForPlayer(player).legendAttachedGear(cardId), expected);
  }

  async expectHandChoiceEligibleCount(player: PlayerId, expected: number): Promise<void> {
    await expectDomCount(this.boardForPlayer(player).choiceEligibleHandCards(), expected);
  }

  async expectHandCardChoiceEligible(
    player: PlayerId,
    cardId: string,
    expected: boolean,
  ): Promise<void> {
    await expectDomAttribute(
      this.boardForPlayer(player).handCardChoiceSurface(cardId),
      "data-choice-eligible",
      expected ? "true" : "false",
    );
  }

  async expectPendingChoiceType(player: PlayerId, expected: string | null): Promise<void> {
    const actual = await this.getPendingChoiceType(player);
    if (actual !== expected) {
      throw new Error(
        `Expected pending choice for ${String(player)} to be ${String(expected)}, got ${String(
          actual,
        )}.`,
      );
    }
  }

  private async expectBoardStructuralState(
    board: CyberpunkBoardPom,
    expected: { phase: string; activeSide: CyberpunkSide; gameStatus: "active" | "ended" },
  ): Promise<void> {
    const player = PLAYER_ID_BY_SIDE[board.side];
    const [handSize, fieldSize, fixerDiceCount, eddies] = await Promise.all([
      this.getHandSize(player),
      this.getFieldSize(player),
      this.getFixerDiceCount(player),
      this.getEddies(player),
    ]);

    await board.root().waitFor();
    await expectDomAttributePresent(board.root(), "data-mode");
    await expectDomAttribute(board.root(), "data-phase", expected.phase.toUpperCase());
    await expectDomAttribute(board.root(), "data-active-side", expected.activeSide);
    await expectDomAttribute(board.root(), "data-game-status", expected.gameStatus);
    await expectDomAttribute(board.handZone(), "data-count", String(handSize));
    await expectDomAttribute(board.fieldZone(), "data-count", String(fieldSize));
    await expectDomAttribute(board.fixerZone(), "data-count", String(fixerDiceCount));
    await expectDomAttribute(board.eddiesZone(), "data-count", String(eddies));
    await expectDomCount(board.handCards(), handSize);
    await expectDomCount(board.fieldUnits(), fieldSize);

    const fixerCollapsed = (await board.fixerZone().getAttribute("data-collapsed")) === "true";
    if (!fixerCollapsed) {
      await expectDomCount(board.fixerDice(), fixerDiceCount);
    }
  }

  private async clickPromptVerb(
    as: PlayerId,
    verb: "mulligan" | "keepHand" | "passPhase",
  ): Promise<void> {
    await this.takeControl(as);
    const button = this.promptForPlayer(as).verbButton(verb);
    await button.waitFor();
    await button.click();
  }

  private promptForPlayer(player: PlayerId): CyberpunkPromptPom {
    return new CyberpunkPromptPom(this.dom, this.sideForPlayer(player));
  }

  private sideForPlayer(player: PlayerId): CyberpunkSide {
    return String(player) === "p1" ? "player" : "opponent";
  }
}

export class CyberpunkBoardPom {
  private readonly dom: SimulatorDomDriver;
  readonly side: CyberpunkSide;

  constructor(dom: SimulatorDomDriver, side: CyberpunkSide) {
    this.dom = dom;
    this.side = side;
  }

  root(): SimulatorDomElement {
    return this.dom.locator(`[data-testid="game-board"][data-side=${cssString(this.side)}]`);
  }

  handZone(): SimulatorDomElement {
    return this.dom.locator(`[data-testid="hand-zone"][data-side=${cssString(this.side)}]`);
  }

  handCards(): SimulatorDomElement {
    return this.handZone().locator('[data-testid="hand-card"]');
  }

  handCard(cardId: string): SimulatorDomElement {
    return this.handZone().locator(`[data-testid="hand-card"][data-card-id=${cssString(cardId)}]`);
  }

  handCardChoiceSurface(cardId: string): SimulatorDomElement {
    return this.handCard(cardId).locator('[data-testid="card"]');
  }

  choiceEligibleHandCards(): SimulatorDomElement {
    return this.handZone().locator('[data-testid="card"][data-choice-eligible="true"]');
  }

  fieldZone(): SimulatorDomElement {
    return this.dom.locator(`[data-testid="field-zone"][data-side=${cssString(this.side)}]`);
  }

  fieldUnits(): SimulatorDomElement {
    return this.fieldZone().locator('[data-testid="field-unit"]');
  }

  fieldUnit(cardId: string): SimulatorDomElement {
    return this.fieldZone().locator(
      `[data-testid="field-unit"][data-card-id=${cssString(cardId)}]`,
    );
  }

  fieldCardRuleBadges(cardId: string, rule: string): SimulatorDomElement {
    return this.fieldUnit(cardId).locator(`[data-rule=${cssString(rule)}]`);
  }

  legendsZone(): SimulatorDomElement {
    return this.dom.locator(`[data-testid="legends-zone"][data-side=${cssString(this.side)}]`);
  }

  legendSlots(): SimulatorDomElement {
    return this.legendsZone().locator('[data-testid="legend-slot"]');
  }

  faceDownLegendSlots(): SimulatorDomElement {
    return this.legendSlots().locator('[data-face-down="true"]');
  }

  legendSlot(cardId: string): SimulatorDomElement {
    return this.legendsZone().locator(
      `[data-testid="legend-slot"][data-card-id=${cssString(cardId)}]`,
    );
  }

  legendAttachedGear(cardId: string): SimulatorDomElement {
    return this.legendSlot(cardId).locator('[data-testid="attached-gear"]');
  }

  fixerZone(): SimulatorDomElement {
    return this.dom.locator(`[data-testid="fixer-zone"][data-side=${cssString(this.side)}]`);
  }

  fixerDice(): SimulatorDomElement {
    return this.fixerZone().locator('[data-testid="fixer-die"]');
  }

  fixerDie(dieId: string): SimulatorDomElement {
    return this.fixerZone().locator(`[data-testid="fixer-die"][data-die-id=${cssString(dieId)}]`);
  }

  eddiesZone(): SimulatorDomElement {
    return this.dom.locator(`[data-testid="eddies-zone"][data-side=${cssString(this.side)}]`);
  }

  gigRow(): SimulatorDomElement {
    return this.dom.locator(`[data-testid="gig-row"][data-side=${cssString(this.side)}]`);
  }

  gigDice(): SimulatorDomElement {
    return this.gigRow().locator('[data-testid="gig-die"]');
  }

  trashZone(): SimulatorDomElement {
    return this.dom.locator(`[data-testid="trash-zone"][data-side=${cssString(this.side)}]`);
  }
}

export class CyberpunkPromptPom {
  private readonly dom: SimulatorDomDriver;
  readonly side: CyberpunkSide;

  constructor(dom: SimulatorDomDriver, side: CyberpunkSide) {
    this.dom = dom;
    this.side = side;
  }

  root(): SimulatorDomElement {
    return this.dom.locator(`[data-testid="prompt-banner"][data-side=${cssString(this.side)}]`);
  }

  verbButton(moveId: string): SimulatorDomElement {
    return this.root().locator(`[data-testid="prompt-verb-${moveId}"]`);
  }
}

export interface CyberpunkEngineHandle {
  getPhase(): string;
  getTurnNumber(): number;
  getActivePlayerId(): PlayerId;
  isGameOver(): boolean;
  getOpponentOf(player: PlayerId): PlayerId;
  getCardsInZone(zone: CyberpunkCardZone, player: PlayerId): ReadonlyArray<CyberpunkZoneCard>;
  getAttackState(): CyberpunkAttackState | null;
  getFixerDice(player: PlayerId): ReadonlyArray<unknown>;
  getGigCount(player: PlayerId): number;
  getGigDice(player: PlayerId): ReadonlyArray<CyberpunkEngineGigDie>;
  getStreetCred(player: PlayerId): number;
  getFaceDownLegends(player: PlayerId): ReadonlyArray<unknown>;
  getEddies(player: PlayerId): number;
  getPrompt(player: PlayerId): {
    status: string;
    availableMoves: ReadonlyArray<{
      moveId: string;
      inputSpec:
        | { type: "none" }
        | { type: "selectCard"; candidates: ReadonlyArray<string> }
        | {
            type: "selectPair";
            fromCandidates: ReadonlyArray<string>;
            toCandidates: ReadonlyArray<string>;
          }
        | { type: "playCard"; candidates: ReadonlyArray<{ cardId: string }> }
        | {
            type: "selectAbility";
            candidates: ReadonlyArray<{ cardId: string; abilityIndex: number }>;
          };
    }>;
    choice: null | {
      type: string;
      payload: {
        allowedDieIds?: ReadonlyArray<string>;
        options?: ReadonlyArray<CyberpunkEngineTriggerOption>;
        eligibleIds?: ReadonlyArray<string>;
        cardIds?: ReadonlyArray<string>;
        revealedCardIds?: ReadonlyArray<string>;
      } & Record<string, unknown>;
    };
  };
  getFilteredView(player: PlayerId): CyberpunkEngineFilteredMatchView;
  getState(): {
    G: {
      cardIndex: Record<string, { meta: { spent?: boolean } }>;
      gamePhase: string;
      gigDice: Record<string, CyberpunkEngineGigDie>;
      turnMetadata: {
        activePlayerId: PlayerId;
        pendingChoice?: unknown;
      };
    };
  };
  playCard(cardId: string, options: { as: PlayerId }): unknown;
  sellCard(cardId: string, options: { as: PlayerId }): unknown;
  attachGear(gearId: string, attachToId: string, options: { as: PlayerId }): unknown;
  activateAbility(cardId: string, abilityIndex: number, options: { as: PlayerId }): unknown;
  passPhase(options: { as: PlayerId }): unknown;
  attackUnit(attackerId: string, defenderId: string, options: { as: PlayerId }): unknown;
  attackRival(attackerId: string, options: { as: PlayerId }): unknown;
  useBlocker(blockerId: string, options: { as: PlayerId }): unknown;
  resolveAttack(options: {
    as: PlayerId;
    pass?: boolean;
    gigIdsToSteal?: ReadonlyArray<string>;
  }): unknown;
  resolveCardToPlay(cardId: string, options: { as: PlayerId }): unknown;
  resolveCardToMove(cardId: string | undefined, options: { as: PlayerId; pass?: boolean }): unknown;
  resolveSearchDeck(cardIds: ReadonlyArray<string>, options: { as: PlayerId }): unknown;
  resolveDiscardFromHand(cardIds: ReadonlyArray<string>, options: { as: PlayerId }): unknown;
  executeMove(move: string, input: { args: Record<string, unknown> }, playerId: PlayerId): unknown;
}

interface CyberpunkZoneCard {
  instanceId: unknown;
  definitionId: string;
  meta: {
    attachedToId: unknown;
    faceDown: boolean;
    playedThisTurn: boolean;
    spent: boolean;
  };
}

interface CyberpunkEngineGigDie {
  id: unknown;
  dieType: unknown;
  faceValue: unknown;
}

interface CyberpunkEngineTriggerOption {
  triggerId: string;
  sourceCardId: string;
  cardName: string;
  optional: boolean;
}

interface CyberpunkEngineFilteredMatchView {
  players: Record<string, CyberpunkEngineFilteredPlayerView>;
}

interface CyberpunkEngineFilteredPlayerView {
  zones: Record<string, ReadonlyArray<CyberpunkEngineFilteredCardView> | number>;
}

interface CyberpunkEngineFilteredCardView {
  instanceId: string;
  definitionId: string;
  power: number;
  effectivePower: number;
  attachedGearIds: readonly string[];
  grantedRules: readonly string[];
}
