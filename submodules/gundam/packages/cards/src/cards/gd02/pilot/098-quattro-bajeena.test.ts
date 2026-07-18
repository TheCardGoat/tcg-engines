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
import { gd02QuattroBajeena098 } from "./098-quattro-bajeena.ts";

describe("Quattro Bajeena (GD02-098)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02QuattroBajeena098] },
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
      throw new Error("Expected Quattro Bajeena's visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02QuattroBajeena098)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("draws on an AEUG Link Unit and asks which visible hand card to discard", () => {
    const host = createMockUnit({ traits: ["aeug"], linkCondition: "[Quattro Bajeena]" });
    const discardOption = createMockUnit({ name: "Discard Option" });
    const engine = GundamTestEngine.create({
      hand: [gd02QuattroBajeena098, discardOption],
      play: [host],
      resourceArea: activeResources(4),
      deck: 2,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const discardOptionId = p1.getHand()[1]!;

    expectSuccess(p1.assignPilot(gd02QuattroBajeena098, hostId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Quattro to ask which hand card to discard");
    }
    expect(choice.legalTargetIds).toContain(discardOptionId);
    expectSuccess(p1.resolveEffect({ targets: [discardOptionId] }));

    expect(p1.getCardZone(discardOptionId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
    expect(p1.getPilotId(hostId)).toBeDefined();
  });

  it("does not draw or discard when the linked Unit is not AEUG", () => {
    const host = createMockUnit({ traits: ["titans"], linkCondition: "[Quattro Bajeena]" });
    const keptCard = createMockUnit({ name: "Kept Card" });
    const engine = GundamTestEngine.create({
      hand: [gd02QuattroBajeena098, keptCard],
      play: [host],
      resourceArea: activeResources(4),
      deck: 2,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const keptId = p1.getHand()[1]!;

    expectSuccess(p1.assignPilot(gd02QuattroBajeena098, hostId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardZone(keptId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
  });

  it("creates a Link Unit whose printed condition names Char Aznable", () => {
    const host = createMockUnit({
      name: "Char's Host",
      traits: ["titans"],
      linkCondition: "[Char Aznable]",
      level: 1,
      cost: 1,
    });
    const engine = GundamTestEngine.create({
      hand: [host, gd02QuattroBajeena098],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(host));
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(gd02QuattroBajeena098, hostId));
    expectSuccess(p1.enterBattle(hostId, "direct"));

    expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: hostId });
  });

  it("requires both its printed Lv.4 and one active Resource to be paired", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02QuattroBajeena098],
      play: [createMockUnit({ name: "Low-Level Host" })],
      resourceArea: activeResources(3),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    const lowHostId = lowP1.getCardsInZone("battleArea")[0]!;

    expectFailure(
      lowP1.assignPilot(gd02QuattroBajeena098, lowHostId),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowP1.getCardZone(gd02QuattroBajeena098)).toBe(`hand:${PLAYER_ONE}`);
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
      hand: [setup, gd02QuattroBajeena098],
      play: [createMockUnit({ name: "Cost-Gate Host" })],
      resourceArea: activeResources(4),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.assignPilot(gd02QuattroBajeena098, hostId), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02QuattroBajeena098)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getPilotId(hostId)).toBeUndefined();
  });
});
