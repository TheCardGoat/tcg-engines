import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  markAsLinkUnit,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03Radish132 } from "./132-radish.ts";

describe("Radish (GD03-132)", () => {
  it("【Burst】Deploy this card — flips into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03Radish132] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd03Radish132);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd03Radish132], resourceArea: activeResources(2), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd03Radish132));

    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getCardsInZone("baseSection").length).toBe(1);
  });

  it("data: destroyed trigger requires a friendly AEUG Link Unit and targets an enemy Unit with 4 or less HP", () => {
    const destroyedEffect = gd03Radish132.effects?.find((effect) =>
      effect.sourceText.includes("【Destroyed】"),
    );

    expect(destroyedEffect?.activation).toMatchObject({
      timing: ["destroyed"],
      conditions: [
        {
          type: "unitCount",
          owner: "friendly",
          comparison: "gte",
          count: 1,
          hasTrait: "aeug",
          isLinkUnit: true,
        },
      ],
    });
    expect(destroyedEffect?.directives[0]).toMatchObject({
      action: {
        action: "rest",
        target: {
          owner: "opponent",
          cardType: "unit",
          count: 1,
          attributeFilters: [{ attribute: "hp", comparison: "lte", value: 4 }],
        },
      },
    });
  });

  it("behavior: when this Base is destroyed while you have a friendly AEUG Link Unit, rest an enemy Unit with 4 or less HP", () => {
    const aeugUnit = createMockUnit({ traits: ["aeug"] });
    const enemyUnit = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      { baseSection: [gd03Radish132], play: [aeugUnit], deck: 5 },
      { play: [enemyUnit], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const aeugId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    markAsLinkUnit(engine, aeugId);

    engine.destroyUnit(baseId);

    expect(engine.getG().exhausted[enemyId]).toBe(true);
  });
});
