import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02KamilleBidan097 } from "./097-kamille-bidan.ts";

describe("Kamille Bidan (GD02-097)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02KamilleBidan097] },
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
      throw new Error("Expected Kamille Bidan's visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02KamilleBidan097)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("adds AP+2 while a friendly white Base is in play", () => {
    const host = createMockUnit({ ap: 2, hp: 4 });
    const whiteBase = createMockBase({ color: "white" });
    const engine = GundamTestEngine.create({
      hand: [gd02KamilleBidan097],
      play: [host],
      baseSection: [whiteBase],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd02KamilleBidan097, hostId));

    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 5, effectiveHp: 6 });
  });

  it("does not add the conditional AP with a non-white Base", () => {
    const host = createMockUnit({ ap: 2, hp: 4 });
    const blueBase = createMockBase({ color: "blue" });
    const engine = GundamTestEngine.create({
      hand: [gd02KamilleBidan097],
      play: [host],
      baseSection: [blueBase],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd02KamilleBidan097, hostId));

    expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(3);
  });

  it("requires both its printed Lv.5 and one active Resource to be paired", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02KamilleBidan097],
      play: [createMockUnit({ name: "Low-Level Host" })],
      resourceArea: activeResources(4),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    const lowHostId = lowP1.getCardsInZone("battleArea")[0]!;

    expectFailure(lowP1.assignPilot(gd02KamilleBidan097, lowHostId), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02KamilleBidan097)).toBe(`hand:${PLAYER_ONE}`);
    expect(lowP1.getPilotId(lowHostId)).toBeUndefined();

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 5,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02KamilleBidan097],
      play: [createMockUnit({ name: "Cost-Gate Host" })],
      resourceArea: activeResources(5),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.assignPilot(gd02KamilleBidan097, hostId), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02KamilleBidan097)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getPilotId(hostId)).toBeUndefined();
  });
});
