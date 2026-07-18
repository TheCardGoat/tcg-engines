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
import { gd02ChalliaBullGq090 } from "./090-challia-bull-gq.ts";

describe("Challia Bull (GQ) (GD02-090)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02ChalliaBullGq090] },
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
      throw new Error("Expected Challia Bull (GQ)'s visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02ChalliaBullGq090)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("adds AP+1 while another Unit with High-Maneuver is in play", () => {
    const host = createMockUnit({ name: "Challia Host", ap: 2, hp: 4 });
    const other = createMockUnit({ keywordEffects: [{ keyword: "HighManeuver" }] });
    const engine = GundamTestEngine.create({
      hand: [gd02ChalliaBullGq090],
      play: [host, other],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd02ChalliaBullGq090, hostId));

    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 4, effectiveHp: 6 });
  });

  it("does not count the paired host itself as another High-Maneuver Unit", () => {
    const host = createMockUnit({
      name: "Challia Host",
      ap: 2,
      hp: 4,
      keywordEffects: [{ keyword: "HighManeuver" }],
    });
    const engine = GundamTestEngine.create({
      hand: [gd02ChalliaBullGq090],
      play: [host],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd02ChalliaBullGq090, hostId));

    expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(3);
  });

  it("requires both its printed Lv.5 and one active Resource to be paired", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02ChalliaBullGq090],
      play: [createMockUnit({ name: "Low-Level Host" })],
      resourceArea: activeResources(4),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    const lowHostId = lowP1.getCardsInZone("battleArea")[0]!;

    expectFailure(
      lowP1.assignPilot(gd02ChalliaBullGq090, lowHostId),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowP1.getCardZone(gd02ChalliaBullGq090)).toBe(`hand:${PLAYER_ONE}`);
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
      hand: [setup, gd02ChalliaBullGq090],
      play: [createMockUnit({ name: "Cost-Gate Host" })],
      resourceArea: activeResources(5),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.assignPilot(gd02ChalliaBullGq090, hostId), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02ChalliaBullGq090)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getPilotId(hostId)).toBeUndefined();
  });
});
