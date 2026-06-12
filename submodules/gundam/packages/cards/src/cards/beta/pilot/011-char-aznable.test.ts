import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  expectSuccess,
  createMockUnit,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { betaCharAznable011 } from "./011-char-aznable.ts";
describe("Char Aznable (ST03-011)", () => {
  it("【Burst】 adds Char to hand when his shield is destroyed", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { deck: [betaCharAznable011] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.enterBattle(attacker, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getHand()).toContain(shieldId!);
  });

  it("【Attack】During this turn, this Unit gets AP+1 and, if it is a Link Unit, it gains <High-Maneuver>.", () => {
    const linkUnit = createMockUnit({
      ap: 3,
      hp: 5,
      level: 1,
      cost: 1,
      linkCondition: "[Char Aznable]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const defender = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create(
      {
        hand: [linkUnit, betaCharAznable011],
        resourceArea: activeResources(6),
        deck: 5,
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployUnit(linkUnit));
    expectSuccess(p1.assignPilot(betaCharAznable011, linkUnit));

    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    engine.getG().exhausted[attackerId] = false;
    engine.getG().turnMetadata.deployedThisTurn = [];

    expectSuccess(p1.enterBattle(linkUnit, defenderId));

    // AP+1 modifier should be present.
    const apMods = engine
      .getG()
      .continuousEffects.filter(
        (e) =>
          e.targetId === attackerId &&
          e.payload.kind === "stat-modifier" &&
          e.payload.stat === "ap" &&
          e.payload.modifier === 1,
      );
    expect(apMods.length).toBeGreaterThanOrEqual(1);

    // Link Unit → gains High-Maneuver.
    const hmGrants = engine
      .getG()
      .continuousEffects.filter(
        (e) =>
          e.targetId === attackerId &&
          e.payload.kind === "keyword-grant" &&
          e.payload.keyword === "HighManeuver",
      );
    expect(hmGrants.length).toBeGreaterThanOrEqual(1);
  });
});
