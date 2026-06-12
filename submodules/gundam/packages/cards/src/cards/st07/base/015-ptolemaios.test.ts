import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st07Ptolemaios015 } from "./015-ptolemaios.ts";

describe("Ptolemaios (ST07-015)", () => {
  it("【Deploy】Add 1 of your Shields to your hand.", () => {
    const engine = GundamTestEngine.create({
      hand: [st07Ptolemaios015],
      resourceArea: activeResources(2),
      deck: 4,
    });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(st07Ptolemaios015));

    expect(p1.getHand()).toContain(shieldId);
    expect(p1.getCardsInZone("baseSection")).toHaveLength(1);
  });

  it("【Burst】Deploy this card.", () => {
    const engine = GundamTestEngine.create({}, { deck: [st07Ptolemaios015] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_TWO).getCardsInZone("baseSection")).toContain(shieldId);
  });

  it("while a rested friendly CB Unit is in play, prevents Base battle damage from enemy Lv.3 or lower non-token Units", () => {
    const cbUnit = createMockUnit({ traits: ["cb"] });
    const attacker = createMockUnit({ level: 3, ap: 3 });
    const engine = GundamTestEngine.create(
      { baseSection: [st07Ptolemaios015], play: [{ card: cbUnit, exhausted: true }], deck: 5 },
      { play: [attacker], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    engine.endTurn();
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(engine.resolveCombat({ attackerId, target: "direct" }));

    expect(p1.getDamage(baseId)).toBe(0);
  });

  it("does not prevent Base battle damage without a rested friendly CB Unit", () => {
    const cbUnit = createMockUnit({ traits: ["cb"] });
    const attacker = createMockUnit({ level: 3, ap: 3 });
    const engine = GundamTestEngine.create(
      { baseSection: [st07Ptolemaios015], play: [cbUnit], deck: 5 },
      { play: [attacker], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    engine.endTurn();
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(engine.resolveCombat({ attackerId, target: "direct" }));

    expect(p1.getDamage(baseId)).toBe(3);
  });

  it("does not prevent Base battle damage from an enemy Unit token", () => {
    const cbUnit = createMockUnit({ traits: ["cb"] });
    const tokenAttacker = createMockUnit({ level: 3, ap: 3 });
    const engine = GundamTestEngine.create(
      { baseSection: [st07Ptolemaios015], play: [{ card: cbUnit, exhausted: true }], deck: 5 },
      { play: [tokenAttacker], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    engine.endTurn();
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;
    engine.markAsToken(attackerId);

    expectSuccess(engine.resolveCombat({ attackerId, target: "direct" }));

    expect(p1.getDamage(baseId)).toBe(3);
  });
});
