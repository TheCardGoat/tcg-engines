import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  activeResources,
  createMockUnit,
  hasPreventDamage,
} from "@tcg/gundam-engine";
import { gd02GundamAshtaron040 } from "./040-gundam-ashtaron.ts";

describe("Gundam Ashtaron (GD02-040)", () => {
  it("【Activate·Main】<Support 2> buffs only the chosen friendly Unit by AP+2", () => {
    const ally = createMockUnit({ ap: 2, hp: 3, traits: ["new une"] });
    const engine = GundamTestEngine.create(
      { play: [gd02GundamAshtaron040, ally], resourceArea: activeResources(5) },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const battleCards = p1.getCardsInZone("battleArea");
    const ashtaronId = battleCards.find((id) => id.includes(gd02GundamAshtaron040.cardNumber))!;
    const allyId = battleCards.find((id) => id !== ashtaronId)!;

    expectSuccess(p1.useSupport(ashtaronId, allyId));

    expect(engine.getG().exhausted[ashtaronId]).toBe(true);
    const apBuffs = engine
      .getG()
      .continuousEffects.filter(
        (e) => e.payload.kind === "stat-modifier" && e.payload.stat === "ap",
      );
    expect(apBuffs).toHaveLength(1);
    expect(apBuffs[0]!.targetId).toBe(allyId);
    // Support keyword value 2 is encoded via keywordEffects.
  });

  it("【Deploy】: prevent-damage lands only on the chosen other (New UNE) Unit — sibling untouched", () => {
    const uneA = createMockUnit({ ap: 2, hp: 3, traits: ["new une"] });
    const uneB = createMockUnit({ ap: 2, hp: 3, traits: ["new une"] });
    const nonUne = createMockUnit({ ap: 2, hp: 3, traits: [] });
    const engine = GundamTestEngine.create({
      hand: [gd02GundamAshtaron040],
      play: [uneA, uneB, nonUne],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [uneAId, uneBId, nonUneId] = p1.getCardsInZone("battleArea");

    // Pass chosenTargets at play-time (rule 10-1-8-1-1). We pick uneA; the
    // count:1 filter MUST NOT over-apply to uneB.
    expectSuccess(p1.deployUnit(gd02GundamAshtaron040, { targets: [uneAId!] }));

    expect(hasPreventDamage(engine, uneAId!)).toBe(true);
    expect(hasPreventDamage(engine, uneBId!)).toBe(false);
    expect(hasPreventDamage(engine, nonUneId!)).toBe(false);
    // Ashtaron itself (excludeSource) never receives prevent-damage.
    const ashtaronId = p1
      .getCardsInZone("battleArea")
      .find((id) => ![uneAId, uneBId, nonUneId].includes(id))!;
    expect(hasPreventDamage(engine, ashtaronId)).toBe(false);
  });
});
