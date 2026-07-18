import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02GarrodRanTiffaAdill094 } from "./094-garrod-ran-tiffa-adill.ts";

describe("Garrod Ran & Tiffa Adill (GD02-094)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02GarrodRanTiffaAdill094] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstChoice = p2.getBoardView().pendingChoice;
    if (burstChoice?.kind !== "optional") {
      throw new Error("Expected Garrod Ran & Tiffa Adill's visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02GarrodRanTiffaAdill094)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("stages discard acceptance, hand choice, and Deck reveal in printed order", () => {
    const host = createMockUnit({ name: "Garrod Host" });
    const firstDiscardOption = createMockUnit({ name: "First Discard Option" });
    const keptDiscardOption = createMockUnit({ name: "Kept Discard Option" });
    const eligible = createMockUnit({ name: "Vulture Unit", traits: ["vulture"] });
    const firstOther = createMockUnit({ name: "First Other" });
    const secondOther = createMockUnit({ name: "Second Other" });
    const engine = GundamTestEngine.create({
      hand: [gd02GarrodRanTiffaAdill094, firstDiscardOption, keptDiscardOption],
      play: [host],
      resourceArea: activeResources(4),
      deck: [eligible, firstOther, secondOther],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const firstDiscardId = p1.getHand()[1]!;
    const keptDiscardId = p1.getHand()[2]!;

    expectSuccess(p1.assignPilot(gd02GarrodRanTiffaAdill094, hostId));
    const discardChoice = p1.getBoardView().pendingChoice;
    if (discardChoice?.kind !== "optional") {
      throw new Error("Expected a visible choice to discard for the Deck look");
    }
    expect(discardChoice.controllerId).toBe(PLAYER_ONE);
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [discardChoice.directiveIndex]: true } }));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([firstDiscardId, keptDiscardId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [firstDiscardId] }));

    expect(p1.getCardZone(firstDiscardId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(keptDiscardId)).toBe(`hand:${PLAYER_ONE}`);
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") {
      throw new Error("Expected the top three to become visible only after discarding");
    }
    expect(choice.revealedCardIds).toHaveLength(3);
    expect(choice.legalTutorCardIds).toHaveLength(1);
    expect(choice.randomizeRemainingToBottom).toBe(true);
    const eligibleId = choice.legalTutorCardIds[0]!;
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: {
          [choice.directiveIndex]: { tutorCardId: eligibleId },
        },
      }),
    );

    expect(p1.getCardZone(eligibleId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
  });

  it("lets the player decline without discarding or revealing deck identities", () => {
    const host = createMockUnit({ name: "Garrod Host" });
    const keptCard = createMockUnit({ name: "Kept Card" });
    const engine = GundamTestEngine.create({
      hand: [gd02GarrodRanTiffaAdill094, keptCard],
      play: [host],
      resourceArea: activeResources(4),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const keptId = p1.getHand()[1]!;

    expectSuccess(p1.assignPilot(gd02GarrodRanTiffaAdill094, hostId));
    const discardChoice = p1.getBoardView().pendingChoice;
    if (discardChoice?.kind !== "optional") {
      throw new Error("Expected a visible choice to discard for the Deck look");
    }
    expect(discardChoice.controllerId).toBe(PLAYER_ONE);
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [discardChoice.directiveIndex]: false } }));

    expect(p1.getCardZone(keptId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("does not offer a discard when its controller's Deck is empty", () => {
    const host = createMockUnit({ name: "Garrod Host" });
    const keptCard = createMockUnit({ name: "Card Kept in Hand" });
    const engine = GundamTestEngine.create({
      hand: [gd02GarrodRanTiffaAdill094, keptCard],
      play: [host],
      resourceArea: activeResources(4),
      deck: [],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const keptId = p1.getHand()[1]!;

    expectSuccess(p1.assignPilot(gd02GarrodRanTiffaAdill094, hostId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardZone(keptId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getPilotId(hostId)).toBeDefined();
  });

  it("does not reveal the Deck when pairing leaves no card to discard", () => {
    const host = createMockUnit({ name: "Garrod Host" });
    const engine = GundamTestEngine.create({
      hand: [gd02GarrodRanTiffaAdill094],
      play: [host],
      resourceArea: activeResources(4),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd02GarrodRanTiffaAdill094, hostId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
    expect(p1.getPilotId(hostId)).toBeDefined();
  });

  it("requires both its printed Lv.4 and one active Resource to be paired", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02GarrodRanTiffaAdill094],
      play: [createMockUnit({ name: "Low-Level Host" })],
      resourceArea: activeResources(3),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    const lowHostId = lowP1.getCardsInZone("battleArea")[0]!;

    expectFailure(
      lowP1.assignPilot(gd02GarrodRanTiffaAdill094, lowHostId),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowP1.getCardZone(gd02GarrodRanTiffaAdill094)).toBe(`hand:${PLAYER_ONE}`);
    expect(lowP1.getPilotId(lowHostId)).toBeUndefined();

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 4,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02GarrodRanTiffaAdill094],
      play: [createMockUnit({ name: "Cost-Gate Host" })],
      resourceArea: activeResources(4),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.assignPilot(gd02GarrodRanTiffaAdill094, hostId), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02GarrodRanTiffaAdill094)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getPilotId(hostId)).toBeUndefined();
  });
});
