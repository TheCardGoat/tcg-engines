import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  activeResources,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { betaBanagherLinks088 } from "./088-banagher-links.ts";
describe("Banagher Links (GD01-088)", () => {
  it("【Burst】 adds Banagher to hand when his shield is destroyed", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { deck: [betaBanagherLinks088] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.enterBattle(attacker, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getHand()).toContain(shieldId!);
  });

  // Pilot-resident triggered effects now route through
  // executePilotPairing via enqueueOwnCardTriggers (rule 3-3-9-1).
  // The printed "if Link Unit" gating is now encoded as
  // `timing: ["whenLinked"]`, gated by rule 3-2-6 on the paired unit
  // satisfying its linkCondition. Rule 3-2-6-1/2: a unit printed with
  // NO linkCondition can never be a Link Unit; the pairing succeeds
  // but whenLinked does NOT fire.
  it("【When Paired】 with a Link Unit → 1 card drawn", () => {
    const unit = createMockUnit({ level: 5, cost: 1, linkCondition: "[Banagher Links]" });
    const engine = GundamTestEngine.create(
      { hand: [unit, betaBanagherLinks088], resourceArea: activeResources(6), deck: 10 },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const before = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(betaBanagherLinks088, unit));
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(before - 1);
  });

  it("【When Paired】 pairing non-Link Unit → no draw", () => {
    const unit = createMockUnit({ level: 5, cost: 1 });
    const engine = GundamTestEngine.create(
      { hand: [unit, betaBanagherLinks088], resourceArea: activeResources(6), deck: 10 },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const before = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(betaBanagherLinks088, unit));
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(before);
  });
});
