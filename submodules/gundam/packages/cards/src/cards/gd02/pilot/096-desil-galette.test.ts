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
import { gd02DesilGalette096 } from "./096-desil-galette.ts";

describe("Desil Galette (GD02-096)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02DesilGalette096] },
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
      throw new Error("Expected Desil Galette's visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02DesilGalette096)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("lets the player choose, pay for, and deploy an eligible Vagan Unit from trash", () => {
    const host = createMockUnit({ linkCondition: "[Desil Galette]" });
    const eligible = createMockUnit({
      name: "Eligible Vagan",
      traits: ["vagan"],
      level: 2,
      cost: 2,
    });
    const tooHigh = createMockUnit({ name: "High Vagan", traits: ["vagan"], level: 3, cost: 2 });
    const wrongTrait = createMockUnit({ name: "Wrong Trait", traits: ["aeug"], level: 2, cost: 2 });
    const engine = GundamTestEngine.create({
      hand: [gd02DesilGalette096],
      play: [host],
      trash: [eligible, tooHigh, wrongTrait],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId, tooHighId, wrongTraitId] = p1.getCardsInZone("trash");

    expectSuccess(p1.assignPilot(gd02DesilGalette096, hostId));
    const deployChoice = p1.getBoardView().pendingChoice;
    if (deployChoice?.kind !== "optional") {
      throw new Error("Expected a visible choice to deploy the eligible Vagan Unit");
    }
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [deployChoice.directiveIndex]: true } }));
    const targetChoice = p1.getBoardView().pendingChoice;
    if (targetChoice?.kind !== "targetSelection") {
      throw new Error("Expected a visible eligible trash Unit choice");
    }
    expect(targetChoice.legalTargetIds).toEqual([eligibleId]);
    expect(targetChoice.legalTargetIds).not.toEqual(
      expect.arrayContaining([tooHighId, wrongTraitId]),
    );
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p1.getCardZone(eligibleId!)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
  });

  it("allows the player to decline and leaves the eligible Unit in trash", () => {
    const host = createMockUnit({ linkCondition: "[Desil Galette]" });
    const eligible = createMockUnit({ traits: ["vagan"], level: 2, cost: 2 });
    const engine = GundamTestEngine.create({
      hand: [gd02DesilGalette096],
      play: [host],
      trash: [eligible],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const eligibleId = p1.getCardsInZone("trash")[0]!;

    expectSuccess(p1.assignPilot(gd02DesilGalette096, hostId));
    const deployChoice = p1.getBoardView().pendingChoice;
    if (deployChoice?.kind !== "optional") {
      throw new Error("Expected a visible choice to deploy the eligible Vagan Unit");
    }
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [deployChoice.directiveIndex]: false } }));

    expect(p1.getCardZone(eligibleId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("does not offer the optional deployment without a payable eligible Unit", () => {
    const host = createMockUnit({ linkCondition: "[Desil Galette]" });
    const wrongTrait = createMockUnit({ traits: ["aeug"], level: 2, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [gd02DesilGalette096],
      play: [host],
      trash: [wrongTrait],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd02DesilGalette096, hostId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardZone(wrongTrait)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getPilotId(hostId)).toBeDefined();
  });

  it("requires both its printed Lv.4 and one active Resource to be paired", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02DesilGalette096],
      play: [createMockUnit({ name: "Low-Level Host" })],
      resourceArea: activeResources(3),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    const lowHostId = lowP1.getCardsInZone("battleArea")[0]!;

    expectFailure(lowP1.assignPilot(gd02DesilGalette096, lowHostId), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02DesilGalette096)).toBe(`hand:${PLAYER_ONE}`);
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
      hand: [setup, gd02DesilGalette096],
      play: [createMockUnit({ name: "Cost-Gate Host" })],
      resourceArea: activeResources(4),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.assignPilot(gd02DesilGalette096, hostId), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02DesilGalette096)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getPilotId(hostId)).toBeUndefined();
  });
});
