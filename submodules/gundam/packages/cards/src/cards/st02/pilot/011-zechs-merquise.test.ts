import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  createMockResource,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import type { TestCardEntry } from "@tcg/gundam-engine";
import { st02ZechsMerquise011 } from "./011-zechs-merquise.ts";

function resources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => ({
    card: createMockResource(),
    exhausted: false,
  }));
}

describe("Zechs Merquise (ST02-011)", () => {
  it("【Burst】 Add this card to your hand — moves shield into hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [st02ZechsMerquise011] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("data: duringLink-gated destroyed trigger present", () => {
    const effect = st02ZechsMerquise011.effects?.find(
      (e) =>
        e.type === "triggered" &&
        e.activation.conditions?.some((condition) => condition.type === "duringLink"),
    );
    expect(effect?.activation.timing).toEqual(["destroyed"]);
    expect(effect?.activation.conditions).toContainEqual({ type: "duringLink" });
  });

  it("【During Link】【Destroyed】 — draws 1 when the paired unit destroys an enemy in combat", () => {
    // End-to-end firing through resolveCombat, unblocked by
    // fix/resolve-combat-zone-commit (harness: `markAsLinkUnit`
    // synthetic pilot now defaults `apBonus`/`hpBonus` to 0 so paired
    // units have well-formed stats, and paired Zechs sits in battleArea
    // where `enqueueObserverTriggers` scans him).
    const pairedUnit = createMockUnit({
      ap: 2,
      hp: 5,
      level: 1,
      cost: 1,
      // biome-ignore lint/suspicious/noExplicitAny: UnitCard linkCondition is optional on the type
      linkCondition: "[Zechs Merquise]",
    } as any);
    const defender = createMockUnit({ ap: 1, hp: 1 });

    const engine = GundamTestEngine.create(
      {
        hand: [pairedUnit, st02ZechsMerquise011],
        resourceArea: resources(5),
        deck: 10,
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployUnit(pairedUnit));
    expectSuccess(p1.assignPilot(st02ZechsMerquise011, pairedUnit));

    const attackerId = p1
      .getCardsInZone("battleArea")
      .find((id) => id.includes(pairedUnit.cardNumber))!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    engine.getG().exhausted[attackerId] = false;

    engine.resolveCombat({ attackerId, target: defenderId });

    // Defender's zone-move to trash committed.
    expect(engine.getState().ctx.zones.private.cardIndex[defenderId]?.zoneKey).toBe(
      `trash:${PLAYER_TWO}`,
    );
    // Zechs' duringLink + destroyed observer drew 1 card.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
  });
});
