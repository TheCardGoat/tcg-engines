import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  findStatModifier,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03WarpedIntent112 } from "./112-warped-intent.ts";

describe("Warped Intent (GD03-112)", () => {
  it("【Burst】 adds this card to its owner's hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd03WarpedIntent112] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  it("【Main】/【Action】During this turn, all Units paired with a Pilot get AP+2", () => {
    const pairedUnit = createMockUnit({ ap: 2 });
    const unpairedUnit = createMockUnit({ ap: 2 });
    const pilot = createMockPilot();
    const engine = GundamTestEngine.create({
      hand: [pilot, gd03WarpedIntent112],
      play: [pairedUnit, unpairedUnit],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [pairedId, unpairedId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(pilot, pairedId!));
    expectSuccess(p1.playCommand(gd03WarpedIntent112));

    expect(findStatModifier(engine, pairedId!, "ap")?.modifier).toBe(2);
    expect(findStatModifier(engine, unpairedId!, "ap")).toBeUndefined();
  });
});
