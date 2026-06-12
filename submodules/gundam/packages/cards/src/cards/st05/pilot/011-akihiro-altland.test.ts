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
import { st05AkihiroAltland011 } from "./011-akihiro-altland.ts";

function resources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => ({
    card: createMockResource(),
    exhausted: false,
  }));
}

describe("Akihiro Altland (ST05-011)", () => {
  it("【Burst】 Add this card to your hand — moves shield into hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [st05AkihiroAltland011] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("data: duringLink + onDestroyByBattle trigger retrieves a Tekkadan Lv.2 or lower Unit", () => {
    const effect = st05AkihiroAltland011.effects?.find(
      (e) =>
        e.type === "triggered" &&
        e.activation.conditions?.some((condition) => condition.type === "duringLink"),
    );
    expect(effect?.activation.timing).toEqual(["onDestroyByBattle"]);
    expect(effect?.activation.conditions).toContainEqual({ type: "duringLink" });
    expect(effect?.activation.conditions).toContainEqual({ type: "eventCardIsSelf" });
    expect(effect?.directives).toContainEqual({
      action: {
        action: "addFromTrash",
        target: {
          owner: "friendly",
          cardType: "unit",
          zone: "trash",
          count: 1,
          attributeFilters: [
            { attribute: "trait", comparison: "includes", value: "tekkadan" },
            { attribute: "level", comparison: "lte", value: 2 },
          ],
        },
      },
    });
  });

  it("【During Link】adds a Tekkadan Lv.2 or lower Unit from trash after destroying an enemy Unit with battle damage", () => {
    const pairedUnit = createMockUnit({
      ap: 2,
      hp: 5,
      level: 1,
      cost: 1,
      // biome-ignore lint/suspicious/noExplicitAny: UnitCard linkCondition is optional on the type
      linkCondition: "[Akihiro Altland]",
    } as any);
    const defender = createMockUnit({ ap: 1, hp: 1 });
    const target = createMockUnit({ name: "Tekkadan Target", traits: ["tekkadan"], level: 2 });
    const wrongTrait = createMockUnit({ name: "Wrong Trait", traits: ["gjallarhorn"], level: 2 });
    const tooHighLevel = createMockUnit({ name: "Too High", traits: ["tekkadan"], level: 3 });

    const engine = GundamTestEngine.create(
      {
        hand: [pairedUnit, st05AkihiroAltland011],
        resourceArea: resources(5),
        trash: [wrongTrait, tooHighLevel, target],
        deck: 10,
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployUnit(pairedUnit));
    expectSuccess(p1.assignPilot(st05AkihiroAltland011, pairedUnit));

    const attackerId = p1
      .getCardsInZone("battleArea")
      .find((id) => id.includes(pairedUnit.cardNumber))!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    engine.getG().exhausted[attackerId] = false;

    engine.resolveCombat({ attackerId, target: defenderId });

    expect(engine.getState().ctx.zones.private.cardIndex[defenderId]?.zoneKey).toBe(
      `trash:${PLAYER_TWO}`,
    );
    const framework = engine.getRuntime().getFrameworkReadAPI();
    const handNames = p1.getHand().map((id) => framework.cards.getDefinition(id)?.name);
    expect(handNames).toContain("Tekkadan Target");
    expect(handNames).not.toContain("Wrong Trait");
    expect(handNames).not.toContain("Too High");
    expect(engine.getG().pendingEffects.length).toBe(0);
  });
});
