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
import { gd02JeridMessa086 } from "./086-jerid-messa.ts";

describe("Jerid Messa (GD02-086)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02JeridMessa086] },
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
      throw new Error("Expected Jerid Messa's visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02JeridMessa086)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("adds AP+1 while another friendly Titans Unit is in play", () => {
    const host = createMockUnit({ name: "Jerid Host", ap: 2, hp: 4 });
    const otherTitans = createMockUnit({ name: "Other Titans", traits: ["titans"] });
    const engine = GundamTestEngine.create({
      hand: [gd02JeridMessa086],
      play: [host, otherTitans],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd02JeridMessa086, hostId));

    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 4, effectiveHp: 5 });
    expect(p1.getPilotId(hostId)).toBeDefined();
  });

  it("does not add the conditional AP without another Titans Unit", () => {
    const host = createMockUnit({ name: "Jerid Host", ap: 2, hp: 4, traits: ["titans"] });
    const engine = GundamTestEngine.create({
      hand: [gd02JeridMessa086],
      play: [host],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd02JeridMessa086, hostId));

    expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(3);
  });

  it("requires both its printed Lv.3 and one active Resource to be paired", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02JeridMessa086],
      play: [createMockUnit({ name: "Low-Level Host" })],
      resourceArea: activeResources(2),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    const lowHostId = lowP1.getCardsInZone("battleArea")[0]!;

    expectFailure(lowP1.assignPilot(gd02JeridMessa086, lowHostId), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02JeridMessa086)).toBe(`hand:${PLAYER_ONE}`);
    expect(lowP1.getPilotId(lowHostId)).toBeUndefined();

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 3,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02JeridMessa086],
      play: [createMockUnit({ name: "Cost-Gate Host" })],
      resourceArea: activeResources(3),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.assignPilot(gd02JeridMessa086, hostId), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02JeridMessa086)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getPilotId(hostId)).toBeUndefined();
  });
});
