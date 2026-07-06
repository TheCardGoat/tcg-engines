import type { CyberpunkTestEngine, PlayerId } from "@tcg/cyberpunk-engine";
import type { SimulatorDomDriver, SimulatorDomElement } from "@tcg/simulator-testing";
import { cssString, expectDomAttribute, expectDomCount } from "@tcg/simulator-testing";

import type { EngineAction, EngineActionMatcher } from "../types/e2e";
import { InteractionPanelPom } from "./interaction-panel-pom";

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

const SIDE_BY_PLAYER_ID: Record<PlayerId, CyberpunkSide> = {
  [CYBERPUNK_P1]: "player",
  [CYBERPUNK_P2]: "opponent",
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
}

export interface CyberpunkEngineHarnessClient extends CyberpunkHarnessClient {
  evalEngine<T>(fn: (engine: CyberpunkTestEngine) => T): Promise<T>;
  evalEngine<T, A>(fn: (engine: CyberpunkTestEngine, arg: A) => T, arg: A): Promise<T>;
  dispatchEngine<T>(fn: (engine: CyberpunkTestEngine) => T): Promise<T>;
  dispatchEngine<T, A>(fn: (engine: CyberpunkTestEngine, arg: A) => T, arg: A): Promise<T>;
}

function hasEngineHarness(
  harness: CyberpunkHarnessClient,
): harness is CyberpunkEngineHarnessClient {
  return "evalEngine" in harness && "dispatchEngine" in harness;
}

function promptStatusFromBannerState(state: string | null): string {
  switch (state) {
    case "gain-gig":
    case "steal-gigs":
    case "optional-trigger":
    case "choose-trigger":
    case "select-target":
      return "choosing";
    case "waiting-mulligan":
      return "waiting";
    case "mulligan":
    case "select-action":
    case "minimized":
    case null:
      return "ready";
    default:
      return state;
  }
}

function attackPairAttackerId(pairId: string): string {
  return pairId.split("->", 1)[0] ?? pairId;
}

function attackPairDefenderId(pairId: string): string {
  const separatorIndex = pairId.indexOf("->");
  return separatorIndex === -1 ? pairId : pairId.slice(separatorIndex + 2);
}

export class CyberpunkSimulatorPom<
  Harness extends CyberpunkHarnessClient = CyberpunkHarnessClient,
> {
  readonly dom: SimulatorDomDriver;
  readonly harness: Harness;
  readonly playerBoard: CyberpunkBoardPom;
  readonly opponentBoard: CyberpunkBoardPom;
  readonly interactionPanel: InteractionPanelPom;

  constructor(dom: SimulatorDomDriver, harness: Harness) {
    this.dom = dom;
    this.harness = harness;
    this.playerBoard = new CyberpunkBoardPom(dom, "player");
    this.opponentBoard = new CyberpunkBoardPom(dom, "opponent");
    this.interactionPanel = new InteractionPanelPom(dom);
  }

  async waitForReady(): Promise<void> {
    await this.harness.waitForReady();
    await this.playerBoard.root().waitFor();
  }

  boardForPlayer(player: PlayerId): CyberpunkBoardPom {
    return this.sideForPlayer(player) === "player" ? this.playerBoard : this.opponentBoard;
  }

  async getPhase(): Promise<string> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine((engine) => engine.getPhase());
    }
    const phase = await this.playerBoard.root().getAttribute("data-phase");
    if (!phase) {
      throw new Error("Expected rendered phase to be present.");
    }
    return phase.toLowerCase();
  }

  async getTurnNumber(): Promise<number> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine((engine) => engine.getTurnNumber());
    }
    const turnText = await this.dom.locator('[aria-label^="Turn "]').first().textContent();
    const match = /\bT(\d+)\b/.exec(turnText);
    if (!match) {
      throw new Error(`Expected rendered turn number in ${JSON.stringify(turnText)}.`);
    }
    return Number(match[1]);
  }

  async getActivePlayerId(): Promise<PlayerId> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine((engine) => engine.getActivePlayerId());
    }
    const activeSide = await this.playerBoard.root().getAttribute("data-active-side");
    if (activeSide === "player") return CYBERPUNK_P1;
    if (activeSide === "opponent") return CYBERPUNK_P2;
    throw new Error(`Expected rendered active side, got ${String(activeSide)}.`);
  }

  async isGameOver(): Promise<boolean> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine((engine) => engine.isGameOver());
    }
    return (await this.playerBoard.root().getAttribute("data-game-status")) === "ended";
  }

  async getOpponentOf(player: PlayerId): Promise<PlayerId> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine((engine, p) => engine.getOpponentOf(p), player);
    }
    return player === CYBERPUNK_P1 ? CYBERPUNK_P2 : CYBERPUNK_P1;
  }

  async getCardsInZone(
    zone: CyberpunkCardZone,
    player: PlayerId,
  ): Promise<ReadonlyArray<CyberpunkPomCard>> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine(
        (engine, input) =>
          engine.getCardsInZone(input.zone, input.player).map((card) => ({
            instanceId: String(card.instanceId),
            definitionId: card.definitionId,
            attachedToId:
              typeof card.meta.attachedToId === "string" ? card.meta.attachedToId : null,
            faceDown: card.meta.faceDown,
            playedThisTurn: card.meta.playedThisTurn,
            spent: card.meta.spent,
          })),
        { zone, player },
      );
    }
    const elements = this.zoneCardElements(zone, player);
    const [instanceIds, definitionIds, attachedToIds, faceDowns, playedThisTurns, spents] =
      await Promise.all([
        elements.getAttributeAll("data-instance-id"),
        elements.getAttributeAll("data-definition-id"),
        elements.getAttributeAll("data-attached-to-id"),
        elements.getAttributeAll("data-face-down"),
        elements.getAttributeAll("data-played-this-turn"),
        elements.getAttributeAll("data-spent"),
      ]);

    return instanceIds.flatMap((instanceId, index) => {
      if (!instanceId) return [];
      return [
        {
          instanceId,
          definitionId: definitionIds[index] ?? "",
          attachedToId: attachedToIds[index] || null,
          faceDown: faceDowns[index] === "true",
          playedThisTurn: playedThisTurns[index] === "true",
          spent: spents[index] === "true",
        },
      ];
    });
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

  async getCardInZoneByIndex(
    zone: CyberpunkCardZone,
    player: PlayerId,
    index: number,
  ): Promise<CyberpunkPomCard> {
    const cards = await this.getCardsInZone(zone, player);
    const card = cards[index];
    if (!card) {
      throw new Error(`No ${zone} card at index ${index} found for ${String(player)}.`);
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

  async getAttackState(): Promise<CyberpunkAttackState | null> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine((engine) => engine.getAttackState());
    }
    const root = this.dom
      .locator('[data-testid="combat-arrow-overlay"][data-active="true"]')
      .first();
    if ((await root.count()) === 0) {
      return null;
    }
    return {
      attackerId: (await root.getAttribute("data-attacker-id")) ?? "",
      defenderId: (await root.getAttribute("data-defender-id")) || null,
      rivalId:
        ((await root.getAttribute("data-rival-id")) as PlayerId | null) ??
        (await this.getOpponentOf(await this.getActivePlayerId())),
      kind:
        ((await root.getAttribute("data-kind")) as CyberpunkAttackState["kind"] | null) ?? "direct",
      step:
        ((await root.getAttribute("data-step")) as CyberpunkAttackState["step"] | null) ??
        "offensive",
      redirectedByBlocker: (await root.getAttribute("data-redirected-by-blocker")) === "true",
    };
  }

  async getHandSize(player: PlayerId): Promise<number> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine(
        (engine, p) => engine.getCardsInZone("hand", p).length,
        player,
      );
    }
    return this.readNumberAttribute(this.boardForPlayer(player).handZone(), "data-count");
  }

  async getFieldSize(player: PlayerId): Promise<number> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine(
        (engine, p) =>
          engine.getCardsInZone("field", p).filter((card) => !card.meta.attachedToId).length,
        player,
      );
    }
    return this.readNumberAttribute(this.boardForPlayer(player).fieldZone(), "data-count");
  }

  async getFixerDiceCount(player: PlayerId): Promise<number> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine((engine, p) => engine.getFixerDice(p).length, player);
    }
    return this.readNumberAttribute(this.boardForPlayer(player).fixerZone(), "data-count");
  }

  async getGigCount(player: PlayerId): Promise<number> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine((engine, p) => engine.getGigCount(p), player);
    }
    return this.readNumberAttribute(this.boardForPlayer(player).gigRow(), "data-count");
  }

  async getGigDice(player: PlayerId): Promise<ReadonlyArray<CyberpunkPomGigDie>> {
    if (hasEngineHarness(this.harness)) {
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
    const dice = this.boardForPlayer(player).gigDice();
    const [ids, dieTypes, faces] = await Promise.all([
      dice.getAttributeAll("data-die-id"),
      dice.getAttributeAll("data-die-type"),
      dice.getAttributeAll("data-face"),
    ]);
    return ids.flatMap((id, index) => {
      if (!id) return [];
      return [{ id, dieType: dieTypes[index] ?? "", faceValue: Number(faces[index] ?? 0) }];
    });
  }

  async getFaceDownLegendsCount(player: PlayerId): Promise<number> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine((engine, p) => engine.getFaceDownLegends(p).length, player);
    }
    return this.readNumberAttribute(
      this.boardForPlayer(player).legendsZone(),
      "data-face-down-count",
    );
  }

  async getEddies(player: PlayerId): Promise<number> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine((engine, p) => engine.getEddies(p), player);
    }
    return this.readNumberAttribute(this.boardForPlayer(player).eddiesZone(), "data-count");
  }

  async getPendingChoiceType(player: PlayerId): Promise<string | null> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine(
        (engine, p) => engine.getPrompt(p).choice?.type ?? null,
        player,
      );
    }
    await this.takeControl(player);
    const command = await this.firstChoiceInteractionMoveCommand();
    if (command) {
      return this.legacyChoiceTypeForMoveCommand(command);
    }
    const prompt = this.promptForPlayer(player).root();
    if ((await prompt.count()) === 0) {
      return null;
    }
    return prompt.getAttribute("data-choice-type");
  }

  async getPromptStatus(player: PlayerId): Promise<string> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine((engine, p) => engine.getPrompt(p).status, player);
    }
    const prompt = this.promptForPlayer(player).root();
    if ((await prompt.count()) === 0) {
      return "waiting";
    }
    const state = await prompt.getAttribute("data-state");
    return promptStatusFromBannerState(state);
  }

  async getEligibleTargetIds(player: PlayerId): Promise<ReadonlyArray<string>> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine((engine, p) => {
        const payload = engine.getPrompt(p).choice?.payload;
        const eligibleIds = payload && "eligibleIds" in payload ? payload.eligibleIds : undefined;
        return Array.isArray(eligibleIds) ? eligibleIds.map(String) : [];
      }, player);
    }
    await this.takeControl(player);
    const interactionId = await this.firstChoiceInteractionId();
    if (!interactionId) {
      return [];
    }
    const interactionCandidates = await this.readInteractionEntityIds(
      `[data-testid=${cssString(`interaction-card:${interactionId}`)}] [data-testid^="interaction-candidate:"]`,
    );
    if (interactionCandidates.length > 0) {
      return interactionCandidates;
    }
    return this.readInteractionEntityIds('[data-selection-candidate="true"]');
  }

  async getChoiceCardIds(player: PlayerId): Promise<ReadonlyArray<string>> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine((engine, p) => {
        const payload = engine.getPrompt(p).choice?.payload;
        const cardIds = payload && "cardIds" in payload ? payload.cardIds : undefined;
        return Array.isArray(cardIds) ? cardIds.map(String) : [];
      }, player);
    }
    await this.takeControl(player);
    return this.getEligibleTargetIds(player);
  }

  async getSearchDeckRevealedCardIds(player: PlayerId): Promise<ReadonlyArray<string>> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine((engine, p) => {
        const payload = engine.getPrompt(p).choice?.payload;
        const revealedCardIds =
          payload && "revealedCardIds" in payload ? payload.revealedCardIds : undefined;
        return Array.isArray(revealedCardIds) ? revealedCardIds.map(String) : [];
      }, player);
    }
    await this.takeControl(player);
    return (
      await this.dom
        .locator('[data-testid="search-deck-card"][data-card-id]')
        .getAttributeAll("data-card-id")
    ).flatMap((id) => (id ? [id] : []));
  }

  async getMoveCandidateIds(player: PlayerId, moveId: string): Promise<ReadonlyArray<string>> {
    if (hasEngineHarness(this.harness)) {
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
    await this.takeControl(player);
    if (moveId === "activateAbility") {
      const ids = await this.dom
        .locator('[data-testid="card"][data-instance-id]')
        .getAttributeAll("data-instance-id");
      const candidates: string[] = [];
      const seen = new Set<string>();
      for (const id of ids) {
        if (!id || seen.has(id)) continue;
        seen.add(id);
        await this.dom
          .locator(`[data-testid="card"][data-instance-id=${cssString(id)}]`)
          .first()
          .click({ force: true });
        const action = this.dom.getByTestId("card-action-activateAbility");
        if ((await action.count()) === 0) {
          continue;
        }
        const abilityIndex = (await action.getAttribute("data-ability-index")) ?? "0";
        candidates.push(`${id}:${abilityIndex}`);
      }
      return candidates;
    }
    const card = this.interactionPanel.interactionCardByMoveCommand(this.moveCommand(moveId));
    if ((await card.count()) === 0) {
      return [];
    }
    const interactionId = await this.interactionPanel.interactionIdForMoveCommand(
      this.moveCommand(moveId),
    );
    const candidates = this.interactionPanel
      .interactionCard(interactionId)
      .locator(`[data-testid^="interaction-candidate:${interactionId}:"]`);
    return (await candidates.getAttributeAll("data-entity-id")).flatMap((id) => {
      if (!id) return [];
      return moveId === "attackUnit" ? [attackPairAttackerId(id)] : [id];
    });
  }

  async getMoveTargetCandidateIds(
    player: PlayerId,
    moveId: string,
  ): Promise<ReadonlyArray<string>> {
    if (hasEngineHarness(this.harness)) {
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
    await this.takeControl(player);
    const interactionId = await this.interactionPanel.interactionIdForMoveCommand(
      this.moveCommand(moveId),
    );
    const candidates = this.interactionPanel
      .interactionCard(interactionId)
      .locator(
        `[data-testid^="interaction-candidate:${interactionId}:"], [data-testid^="interaction-target:${interactionId}:"]`,
      );
    if (moveId === "attackUnit") {
      return (await candidates.getAttributeAll("data-entity-id")).flatMap((id) =>
        id ? [attackPairDefenderId(id)] : [],
      );
    }
    return (await candidates.getAttributeAll("data-target-id")).flatMap((id) => (id ? [id] : []));
  }

  async getBoardMode(player: PlayerId): Promise<string> {
    const mode = await this.boardForPlayer(player).root().getAttribute("data-mode");
    if (!mode) {
      throw new Error(`Expected board mode for ${String(player)} to be present.`);
    }
    return mode;
  }

  async getAllowedGigDice(
    player: PlayerId,
  ): Promise<ReadonlyArray<{ id: string; dieType: string }>> {
    if (hasEngineHarness(this.harness)) {
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
    await this.takeControl(player);
    let dice = this.dom.locator('[data-testid="fixer-die"][data-candidate="true"]');
    if ((await dice.count()) === 0) {
      dice = this.dom.locator('[data-testid="fixer-die"]:not([disabled])');
    }
    const [ids, dieTypes] = await Promise.all([
      dice.getAttributeAll("data-die-id"),
      dice.getAttributeAll("data-die-type"),
    ]);
    return ids.flatMap((id, index) => (id ? [{ id, dieType: dieTypes[index] ?? "" }] : []));
  }

  async getGigDie(dieId: string): Promise<CyberpunkPomGigDie> {
    if (hasEngineHarness(this.harness)) {
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
    const die = this.dom.locator(`[data-testid="gig-die"][data-die-id=${cssString(dieId)}]`);
    if ((await die.count()) === 0) {
      throw new Error(`No gig die ${dieId} found.`);
    }
    return {
      id: dieId,
      dieType: (await die.getAttribute("data-die-type")) ?? "",
      faceValue: Number((await die.getAttribute("data-face")) ?? 0),
    };
  }

  async getStreetCred(player: PlayerId): Promise<number> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine((engine, p) => engine.getStreetCred(p), player);
    }
    return this.readNumberAttribute(this.boardForPlayer(player).gigRow(), "data-street-cred");
  }

  async getDeckSize(player: PlayerId): Promise<number> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine(
        (engine, p) => engine.getCardsInZone("deck", p).length,
        player,
      );
    }
    return this.readNumberAttribute(this.boardForPlayer(player).deckZone(), "data-count");
  }

  async getCardInstanceExists(instanceId: string): Promise<boolean> {
    if (hasEngineHarness(this.harness)) {
      return this.harness.evalEngine(
        (engine, id) => Object.prototype.hasOwnProperty.call(engine.getState().G.cardIndex, id),
        instanceId,
      );
    }
    return (await this.dom.locator(`[data-instance-id=${cssString(instanceId)}]`).count()) > 0;
  }

  async getCardDefinitionId(cardId: string): Promise<string> {
    if (hasEngineHarness(this.harness)) {
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
    const definitionId = await this.dom
      .locator(`[data-instance-id=${cssString(cardId)}], [data-card-id=${cssString(cardId)}]`)
      .first()
      .getAttribute("data-definition-id");

    if (!definitionId) {
      throw new Error(`No card definition found for ${cardId}.`);
    }
    return definitionId;
  }

  async getCardView(cardId: string, viewer: PlayerId): Promise<CyberpunkPomCardView>;
  async getCardView(card: CardReference, viewer?: PlayerId): Promise<CyberpunkPomCardView>;
  async getCardView(
    cardOrId: string | CardReference,
    _viewer?: PlayerId,
  ): Promise<CyberpunkPomCardView> {
    let cardId: string;
    let viewer = _viewer;
    if (typeof cardOrId === "object") {
      const found = await this.getCard(cardOrId);
      cardId = found.instanceId;
      viewer ??= found.player;
    } else {
      cardId = cardOrId;
      viewer ??= CYBERPUNK_P1;
    }

    if (hasEngineHarness(this.harness)) {
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

    const elementWithStats = this.dom
      .locator(
        `[data-instance-id=${cssString(cardId)}][data-power], [data-card-id=${cssString(
          cardId,
        )}][data-power]`,
      )
      .first();
    const element =
      (await elementWithStats.count()) > 0
        ? elementWithStats
        : this.dom.locator(`[data-instance-id=${cssString(cardId)}]`).first();
    if ((await element.count()) === 0) {
      throw new Error(`No filtered card view for card ${cardId}.`);
    }
    const definitionId = await element.getAttribute("data-definition-id");
    const attachedGearIds = await element
      .locator('[data-testid="attached-gear"]')
      .getAttributeAll("data-instance-id");
    return {
      instanceId: cardId,
      definitionId: definitionId ?? "",
      power: Number((await element.getAttribute("data-power")) ?? 0),
      effectivePower: Number((await element.getAttribute("data-power")) ?? 0),
      attachedGearIds: attachedGearIds.flatMap((id) => (id ? [id] : [])),
      grantedRules: (await element.locator("[data-rule]").getAttributeAll("data-rule")).flatMap(
        (rule) => (rule ? [rule] : []),
      ),
    };
  }

  async getPendingTriggerOptions(
    player: PlayerId,
  ): Promise<ReadonlyArray<CyberpunkPomTriggerOption>> {
    if (hasEngineHarness(this.harness)) {
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
          optional: option.optional === true,
        }));
      }, player);
    }
    await this.takeControl(player);
    const chips = this.dom.locator('[data-testid^="choice-chip:"]');
    const [ids, sourceIds, names, optionalValues] = await Promise.all([
      chips.getAttributeAll("data-option-id"),
      chips.getAttributeAll("data-source-card-id"),
      chips.getAttributeAll("data-card-name"),
      chips.getAttributeAll("data-optional"),
    ]);
    return ids.flatMap((triggerId, index) =>
      triggerId
        ? [
            {
              triggerId,
              sourceCardId: sourceIds[index] ?? "",
              cardName: names[index] ?? "",
              optional: optionalValues[index] === "true",
            },
          ]
        : [],
    );
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
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine((engine, player) => engine.passPhase({ as: player }), as);
      return;
    }
    await this.takeControl(as);
    const button = this.dom.locator('[data-testid="phase-advance"]:not([disabled])').first();
    await button.waitFor();
    await button.click({ force: true });
    const confirm = this.dom.getByTestId("pass-confirm-submit");
    if ((await confirm.count()) > 0) {
      await confirm.click({ force: true });
    }
    await this.dom.waitFor(async () => (await this.getActivePlayerId()) !== as, {
      message: `Active player did not advance after ${String(as)} passed phase.`,
    });
  }

  async sellCard(cardId: string, as: PlayerId): Promise<void> {
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, payload) => engine.sellCard(payload.cardId, { as: payload.as }),
        { cardId, as },
      );
      return;
    }
    await this.runSingleCandidateMove(as, "sellCard", cardId);
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
    await this.takeControl(as!);
    const interactionId =
      await this.interactionPanel.interactionIdForMoveCommand("cyberpunk.attackUnit");
    await this.interactionPanel.selectCandidate(interactionId, `${attackerId}->${defenderId}`);
    await this.interactionPanel.submitInteraction(interactionId);
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
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, payload) => engine.attackRival(payload.attackerId, { as: payload.as }),
        { attackerId, as: as! },
      );
      return;
    }
    await this.runSingleCandidateMove(as!, "attackRival", attackerId);
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
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, payload) => engine.useBlocker(payload.blockerId, { as: payload.as }),
        { blockerId, as: as! },
      );
      return;
    }
    await this.runSingleCandidateMove(as!, "useBlocker", blockerId);
  }

  async resolveAttack(
    as: PlayerId,
    options: { pass?: boolean; gigIdsToSteal?: ReadonlyArray<string> } = {},
  ): Promise<void> {
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, payload) =>
          engine.resolveAttack({
            as: payload.as,
            pass: payload.pass,
            gigIdsToSteal: payload.gigIdsToSteal?.slice(),
          }),
        { as, pass: options.pass, gigIdsToSteal: options.gigIdsToSteal },
      );
      return;
    }
    await this.takeControl(as);
    if (!options.gigIdsToSteal?.length) {
      await this.clickPromptVerb(as, "resolveAttack");
      return;
    }
    const prompt = this.dom.locator(
      `[data-testid="prompt-banner"][data-state="steal-gigs"][data-side=${cssString(
        SIDE_BY_PLAYER_ID[as],
      )}]`,
    );
    const stealCard = this.interactionPanel.interactionCardByMoveCommand(
      this.moveCommand("resolveStealGigs"),
    );
    if ((await prompt.count()) === 0 && (await stealCard.count()) === 0) {
      await this.clickPromptVerb(as, "resolveAttack");
    }
    const firstGigId = options.gigIdsToSteal[0]!;
    await this.dom.waitFor(
      async () =>
        (await prompt.locator(`button[data-die-id=${cssString(firstGigId)}]`).count()) > 0 ||
        (await stealCard.count()) > 0,
      { message: "Steal-gig choice did not render." },
    );
    if ((await prompt.count()) > 0) {
      for (const gigId of options.gigIdsToSteal) {
        await prompt
          .locator(`button[data-die-id=${cssString(gigId)}]`)
          .first()
          .click({ force: true });
      }
      return;
    }
    const clickedVisibleGigs: string[] = [];
    for (const gigId of options.gigIdsToSteal) {
      const target = this.choiceTarget(gigId);
      if ((await target.count()) === 0) break;
      await target.click({ force: true });
      clickedVisibleGigs.push(gigId);
    }
    if (clickedVisibleGigs.length === options.gigIdsToSteal.length) {
      return;
    }
    if ((await stealCard.count()) > 0) {
      const interactionId = await this.interactionPanel.interactionIdForMoveCommand(
        this.moveCommand("resolveStealGigs"),
      );
      for (const gigId of options.gigIdsToSteal) {
        await this.interactionPanel.selectCandidate(interactionId, gigId);
      }
      await this.interactionPanel.submitInteraction(interactionId);
      return;
    }
    for (const gigId of options.gigIdsToSteal) {
      await this.choiceTarget(gigId).click({ force: true });
    }
    await this.clickPromptVerb(as, "resolveAttack");
  }

  async gainGig(dieId: string, as: PlayerId): Promise<void> {
    await this.takeControl(as);
    await this.dom
      .locator(`[data-testid="fixer-die"][data-die-id=${cssString(dieId)}]`)
      .first()
      .click();
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
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, payload) => engine.playCard(payload.cardId, { as: payload.as }),
        { cardId, as: as! },
      );
      return;
    }
    await this.runSingleCandidateMove(as!, "playCard", cardId);
  }

  async attachGearFromHand(gearId: string, attachToId: string, as: PlayerId): Promise<void> {
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, payload) =>
          engine.attachGear(payload.gearId, payload.attachToId, { as: payload.as }),
        { gearId, attachToId, as },
      );
      return;
    }
    await this.takeControl(as);
    await this.boardForPlayer(as).handCard(gearId).click({ force: true });
    await this.dom.getByTestId("card-action-playCard").click({ force: true });
    await this.choiceTarget(attachToId).clickJs();
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
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, payload) =>
          engine.executeMove("goSolo", { args: { cardId: payload.cardId } }, payload.as),
        { cardId, as: as! },
      );
      return;
    }
    await this.runSingleCandidateMove(as!, "goSolo", cardId);
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
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, payload) =>
          engine.executeMove("callLegend", { args: { legendId: payload.legendId } }, payload.as),
        { legendId, as: as! },
      );
      return;
    }
    await this.runSingleCandidateMove(as!, "callLegend", legendId);
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
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, payload) =>
          engine.activateAbility(payload.cardId, payload.abilityIndex, { as: payload.as }),
        { cardId, abilityIndex, as: as! },
      );
      return;
    }
    await this.takeControl(as!);
    await this.dom
      .locator(`[data-instance-id=${cssString(cardId)}]`)
      .first()
      .click({
        force: true,
      });
    const action = this.dom.getByTestId("card-action-activateAbility");
    const renderedAbilityIndex = await action.getAttribute("data-ability-index");
    if (renderedAbilityIndex !== null && Number(renderedAbilityIndex) !== abilityIndex) {
      throw new Error(
        `Expected activateAbility index ${abilityIndex}, got ${renderedAbilityIndex}.`,
      );
    }
    await action.click({ force: true });
  }

  async resolveCardToPlay(cardId: string, as: PlayerId): Promise<void> {
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, payload) => engine.resolveCardToPlay(payload.cardId, { as: payload.as }),
        { cardId, as },
      );
      return;
    }
    await this.runSingleCandidateMove(as, "resolveCardToPlay", cardId);
  }

  async resolveCardToMove(cardId: string, as: PlayerId): Promise<void> {
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, payload) => engine.resolveCardToMove(payload.cardId, { as: payload.as }),
        { cardId, as },
      );
      return;
    }
    await this.runSingleCandidateMove(as, "resolveCardToMove", cardId);
  }

  async resolveCardToMovePass(as: PlayerId): Promise<void> {
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, player) => engine.resolveCardToMove(undefined, { as: player, pass: true }),
        as,
      );
      return;
    }
    await this.clickPromptPass(as);
  }

  async resolveSearchDeck(selectedCardIds: ReadonlyArray<string>, as: PlayerId): Promise<void> {
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, payload) =>
          engine.resolveSearchDeck(payload.selectedCardIds.slice(), {
            as: payload.as,
          }),
        { selectedCardIds, as },
      );
      return;
    }
    await this.runMultiCandidateMove(as, "resolveSearchDeck", selectedCardIds);
  }

  async resolveDiscardFromHand(cardIds: ReadonlyArray<string>, as: PlayerId): Promise<void> {
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, payload) =>
          engine.resolveDiscardFromHand(payload.cardIds.slice(), {
            as: payload.as,
          }),
        { cardIds, as },
      );
      return;
    }
    await this.runMultiCandidateMove(as, "resolveDiscardFromHand", cardIds);
  }

  async resolveEffectTarget(targetIds: ReadonlyArray<string>, as: PlayerId): Promise<void> {
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, payload) =>
          engine.executeMove(
            "resolveEffectTarget",
            { args: { targetIds: payload.targetIds.slice() } },
            payload.as,
          ),
        { targetIds, as },
      );
      return;
    }
    if (targetIds.length === 1) {
      await this.takeControl(as);
      const target = this.choiceTarget(targetIds[0]!);
      if ((await target.count()) > 0) {
        await target.click({ force: true });
        return;
      }
      await this.runMultiCandidateMove(as, "resolveEffectTarget", targetIds);
      return;
    }
    await this.runMultiCandidateMove(as, "resolveEffectTarget", targetIds);
  }

  async resolveEffectTargetPass(as: PlayerId): Promise<void> {
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, player) =>
          engine.executeMove("resolveEffectTarget", { args: { pass: true } }, player),
        as,
      );
      return;
    }
    await this.clickPromptVerb(as, "pass");
  }

  async resolveAdjustGig(value: number, as: PlayerId): Promise<void> {
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, payload) =>
          engine.executeMove("resolveAdjustGig", { args: { value: payload.value } }, payload.as),
        { value, as },
      );
      return;
    }
    await this.runSingleOptionMove(as, "resolveAdjustGig", String(value));
  }

  async resolveTrigger(triggerId: string, as: PlayerId): Promise<void> {
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, payload) =>
          engine.executeMove(
            "resolveTrigger",
            { args: { triggerId: payload.triggerId } },
            payload.as,
          ),
        { triggerId, as },
      );
      return;
    }
    await this.runSingleOptionMove(as, "resolveTrigger", triggerId);
  }

  async resolveTriggerPass(as: PlayerId): Promise<void> {
    if (hasEngineHarness(this.harness)) {
      await this.harness.dispatchEngine(
        (engine, player) => engine.executeMove("resolveTrigger", { args: { pass: true } }, player),
        as,
      );
      return;
    }
    await this.clickPromptVerb(as, "pass");
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
    const board = this.boardForPlayer(player);
    await expectDomAttribute(board.handZone(), "data-count", String(expected));
    await expectDomCount(board.handCards(), expected);
  }

  async expectFieldSize(player: PlayerId, expected: number): Promise<void> {
    const board = this.boardForPlayer(player);
    await expectDomAttribute(board.fieldZone(), "data-count", String(expected));
    await expectDomCount(board.fieldUnits(), expected);
  }

  async expectFixerDiceCount(player: PlayerId, expected: number): Promise<void> {
    const board = this.boardForPlayer(player);
    await expectDomAttribute(board.fixerZone(), "data-count", String(expected));

    const fixerCollapsed = (await board.fixerZone().getAttribute("data-collapsed")) === "true";
    if (!fixerCollapsed) {
      await expectDomCount(board.fixerDice(), expected);
    }
  }

  async expectGigCount(player: PlayerId, expected: number): Promise<void> {
    const board = this.boardForPlayer(player);
    await expectDomAttribute(board.gigRow(), "data-count", String(expected));
    await expectDomCount(board.gigDice(), expected);
  }

  async expectTrashSize(player: PlayerId, expected: number): Promise<void> {
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
    const board = this.boardForPlayer(player);
    await expectDomAttribute(board.legendsZone(), "data-face-down-count", String(expected));
    await expectDomCount(board.faceDownLegendSlots(), expected);
  }

  async expectEddies(player: PlayerId, expected: number): Promise<void> {
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
    const actual = await this.readNumberAttribute(
      this.boardForPlayer(player).fieldUnit(cardId),
      "data-gear-count",
    );
    if (actual !== expected) {
      throw new Error(
        `Expected field card ${cardId} attached gear count ${expected}, got ${actual}.`,
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
    if (rule === "canAttackOnPlayedTurnAgainstUnits") {
      await expectDomCount(
        this.boardForPlayer(player).fieldCardRuleBadges(cardId, "playedThisTurnCantAttack"),
        expected ? 0 : 1,
      );
      return;
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

    if (
      rule === "blocker" ||
      rule === "cantAttack" ||
      rule === "cantBeBlocked" ||
      rule === "goSolo"
    ) {
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

  private async clickPromptVerb(as: PlayerId, verb: string): Promise<void> {
    await this.takeControl(as);
    const scopedButton = this.promptForPlayer(as).verbButton(verb);
    const button =
      (await scopedButton.count()) > 0
        ? scopedButton
        : verb === "resolveAttack"
          ? this.dom.getByRole("button", { name: /resolve attack/i }).first()
          : verb === "passPhase"
            ? this.dom.getByRole("button", { name: /pass turn/i }).first()
            : this.dom.locator(`[data-testid=${cssString(`prompt-verb-${verb}`)}]`).first();
    await button.waitFor();
    await button.clickJs();
  }

  private async clickPromptPass(as: PlayerId): Promise<void> {
    await this.takeControl(as);
    const prompt = this.promptForPlayer(as).root();
    const targetPass = prompt.locator('[data-testid="prompt-target-pass"]').first();
    if ((await targetPass.count()) > 0) {
      await targetPass.clickJs();
      return;
    }
    const triggerPass = prompt.locator('[data-testid="prompt-trigger-pass"]').first();
    if ((await triggerPass.count()) > 0) {
      await triggerPass.clickJs();
      return;
    }
    await this.clickPromptVerb(as, "pass");
  }

  private promptForPlayer(player: PlayerId): CyberpunkPromptPom {
    return new CyberpunkPromptPom(this.dom, this.sideForPlayer(player));
  }

  private sideForPlayer(player: PlayerId): CyberpunkSide {
    return String(player) === "p1" ? "player" : "opponent";
  }

  private zoneCardElements(zone: CyberpunkCardZone, player: PlayerId): SimulatorDomElement {
    const board = this.boardForPlayer(player);
    switch (zone) {
      case "hand":
        return board.handCards();
      case "field":
        return board.fieldCards();
      case "legendArea":
        return board.legendCards();
      case "trash":
        return board.trashCards();
      case "deck":
        return board.deckCards();
      case "eddieArea":
        return board.eddieCards();
    }
  }

  private async readNumberAttribute(element: SimulatorDomElement, name: string): Promise<number> {
    const value = await element.getAttribute(name);
    if (value === null) {
      throw new Error(`Expected ${name} to be present.`);
    }
    return Number(value);
  }

  private moveCommand(moveId: string): string {
    return `cyberpunk.${moveId}`;
  }

  private async firstChoiceInteractionMoveCommand(): Promise<string | null> {
    const commands = await this.interactionPanel
      .root()
      .locator("[data-move-command]")
      .getAttributeAll("data-move-command");
    return (
      commands.find((command) =>
        command ? this.legacyChoiceTypeForMoveCommand(command) !== null : false,
      ) ?? null
    );
  }

  private async firstChoiceInteractionId(): Promise<string | null> {
    const cards = this.interactionPanel.root().locator("[data-move-command]");
    const [commands, ids] = await Promise.all([
      cards.getAttributeAll("data-move-command"),
      cards.getAttributeAll("data-interaction-id"),
    ]);
    const index = commands.findIndex((command) =>
      command ? this.legacyChoiceTypeForMoveCommand(command) !== null : false,
    );
    return index >= 0 ? (ids[index] ?? null) : null;
  }

  private legacyChoiceTypeForMoveCommand(command: string): string | null {
    switch (command) {
      case "cyberpunk.resolveEffectTarget":
      case "cyberpunk.resolveDiscardFromHand":
        return "chooseTarget";
      case "cyberpunk.resolveSearchDeck":
        return "searchDeck";
      case "cyberpunk.resolveCardToPlay":
        return "chooseCardToPlay";
      case "cyberpunk.resolveCardToMove":
        return "chooseCardToMove";
      case "cyberpunk.resolveAdjustGig":
        return "chooseTarget";
      case "cyberpunk.resolveTrigger":
        return "chooseTrigger";
      case "cyberpunk.gainGig":
        return "gainGig";
      default:
        return null;
    }
  }

  private async runSingleCandidateMove(
    as: PlayerId,
    moveId: string,
    entityId: string,
  ): Promise<void> {
    await this.runMultiCandidateMove(as, moveId, [entityId]);
  }

  private async runMultiCandidateMove(
    as: PlayerId,
    moveId: string,
    entityIds: ReadonlyArray<string>,
  ): Promise<void> {
    await this.takeControl(as);
    const interactionId = await this.interactionPanel.interactionIdForMoveCommand(
      this.moveCommand(moveId),
    );
    for (const entityId of entityIds) {
      await this.interactionPanel.selectCandidate(interactionId, entityId);
    }
    await this.interactionPanel.submitInteraction(interactionId);
  }

  private async runSingleOptionMove(as: PlayerId, moveId: string, optionId: string): Promise<void> {
    await this.takeControl(as);
    const interactionId = await this.interactionPanel.interactionIdForMoveCommand(
      this.moveCommand(moveId),
    );
    await this.interactionPanel.selectOption(interactionId, optionId);
    await this.interactionPanel.submitInteraction(interactionId);
  }

  private async readInteractionEntityIds(selector: string): Promise<ReadonlyArray<string>> {
    const elements = this.dom.locator(selector);
    const [entityIds, instanceIds, cardIds, dieIds] = await Promise.all([
      elements.getAttributeAll("data-entity-id"),
      elements.getAttributeAll("data-instance-id"),
      elements.getAttributeAll("data-card-id"),
      elements.getAttributeAll("data-die-id"),
    ]);
    return entityIds.flatMap((id, index) => {
      const resolved = id ?? instanceIds[index] ?? cardIds[index] ?? dieIds[index];
      return resolved ? [resolved] : [];
    });
  }

  private choiceTarget(entityId: string): SimulatorDomElement {
    const value = cssString(entityId);
    return this.dom
      .locator(
        [
          `[data-choice-eligible="true"][data-entity-id=${value}]`,
          `[data-choice-eligible="true"][data-instance-id=${value}]`,
          `[data-choice-eligible="true"][data-card-id=${value}]`,
          `[data-choice-eligible="true"][data-die-id=${value}]`,
          `[data-selection-candidate="true"][data-entity-id=${value}]`,
          `[data-selection-candidate="true"][data-instance-id=${value}]`,
          `[data-selection-candidate="true"][data-card-id=${value}]`,
          `[data-selection-candidate="true"][data-die-id=${value}]`,
          `[data-selectable="true"][data-entity-id=${value}]`,
          `[data-selectable="true"][data-instance-id=${value}]`,
          `[data-selectable="true"][data-card-id=${value}]`,
          `[data-selectable="true"][data-die-id=${value}]`,
          `[data-interactive="true"][data-entity-id=${value}]`,
          `[data-interactive="true"][data-die-id=${value}]`,
          `[data-testid="gig-die"][data-die-id=${value}]`,
        ].join(", "),
      )
      .first();
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

  fieldCards(): SimulatorDomElement {
    return this.fieldZone().locator(
      '[data-testid="field-unit"], [data-testid="attached-gear"][data-instance-id]',
    );
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

  legendCards(): SimulatorDomElement {
    return this.legendsZone().locator(
      '[data-testid="legend-slot"][data-occupied="true"], [data-testid="attached-gear"][data-instance-id]',
    );
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

  eddieCards(): SimulatorDomElement {
    return this.eddiesZone().locator('[data-testid="card"][data-instance-id]');
  }

  deckZone(): SimulatorDomElement {
    return this.dom.locator(`[data-testid="deck-zone"][data-side=${cssString(this.side)}]`);
  }

  deckCards(): SimulatorDomElement {
    return this.deckZone().locator('[data-testid="card"][data-instance-id]');
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

  trashCards(): SimulatorDomElement {
    return this.trashZone().locator('[data-testid="trash-zone-card"]');
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
