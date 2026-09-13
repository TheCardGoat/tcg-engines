import { describe, expect, it } from "vite-plus/test";

import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailHackedCorpo,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailRebootOptics,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Hacked Corpo (registration)", () => {
  it("is registered with the ingested card data", () => {
    expect(welcomeToNightCityRetailHackedCorpo).toBeDefined();
    expect(welcomeToNightCityRetailHackedCorpo.slug).toBe("hacked-corpo");
    expect(welcomeToNightCityRetailHackedCorpo.type).toBe("unit");
    expect(welcomeToNightCityRetailHackedCorpo.color).toBe("blue");
    expect(welcomeToNightCityRetailHackedCorpo.set.code).toBe("welcometonightcityretail");
    expect(welcomeToNightCityRetailHackedCorpo.cost).toBe(4);
    expect(welcomeToNightCityRetailHackedCorpo.power).toBe(3);
  });
});

describe('Hacked Corpo — "Play Trash 3. Add a Program from among them to your hand."', () => {
  it("trashes exactly 3 cards from the controller's deck", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailHackedCorpo],
        deck: [
          welcomeToNightCityRetailRebootOptics,
          welcomeToNightCityRetailOffdutyMalfini,
          welcomeToNightCityRetailKiroshiOptics,
        ],
        eddies: 4,
      },
      {},
      { preserveDeckOrder: true },
    );

    const deckBefore = engine.getCardsInZone("deck", P1).length;
    engine.playCard(welcomeToNightCityRetailHackedCorpo, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (choice && choice.type === "chooseTarget") {
      const eligible =
        (choice as { payload?: { eligibleIds?: string[] } }).payload?.eligibleIds ?? [];
      if (eligible.length > 0) {
        engine.resolveEffectTargetIds(eligible.slice(0, 1), { as: P1 });
      }
    }

    expect(engine.getCardsInZone("deck", P1).length).toBe(deckBefore - 3);
  });

  it("adds the chosen Program from among the trashed cards to hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailHackedCorpo],
        deck: [
          welcomeToNightCityRetailRebootOptics,
          welcomeToNightCityRetailOffdutyMalfini,
          welcomeToNightCityRetailKiroshiOptics,
        ],
        eddies: 4,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailHackedCorpo, { as: P1 });
    engine.resolveEffectTargetIds(
      [engine.findCardId(welcomeToNightCityRetailRebootOptics, "trash", P1)],
      { as: P1 },
    );

    expect(
      engine
        .getCardsInZone("hand", P1)
        .some((card) => card.definitionId === welcomeToNightCityRetailRebootOptics.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((card) => card.definitionId === welcomeToNightCityRetailRebootOptics.id),
    ).toBe(false);
  });

  it("leaves only Programs selectable (Gear/Unit among the trashed are ignored)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailHackedCorpo],
        deck: [
          welcomeToNightCityRetailRebootOptics,
          welcomeToNightCityRetailOffdutyMalfini,
          welcomeToNightCityRetailKiroshiOptics,
        ],
        eddies: 4,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailHackedCorpo, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    const eligible =
      choice && choice.type === "chooseTarget"
        ? ((choice as { payload?: { eligibleIds?: string[] } }).payload?.eligibleIds ?? [])
        : [];

    expect(eligible).toHaveLength(1);
    expect(eligible).toContain(
      engine.findCardId(welcomeToNightCityRetailRebootOptics, "trash", P1) as string,
    );
  });

  it("is a no-op when no Program is among the trashed cards", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailHackedCorpo],
        deck: [
          welcomeToNightCityRetailOffdutyMalfini,
          welcomeToNightCityRetailKiroshiOptics,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        eddies: 4,
      },
      {},
      { preserveDeckOrder: true },
    );

    const handBefore = engine.getCardsInZone("hand", P1).length;
    engine.playCard(welcomeToNightCityRetailHackedCorpo, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toBeUndefined();
    // No Program recovered: hand only loses the played Hacked Corpo Unit.
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore - 1);
    expect(engine.getCardsInZone("trash", P1)).toHaveLength(3);
  });

  it("requires recovery when a Program is available (min: 1)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailHackedCorpo],
        deck: [welcomeToNightCityRetailRebootOptics, welcomeToNightCityRetailOffdutyMalfini],
        eddies: 4,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailHackedCorpo, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;

    expect(choice).toBeDefined();
    expect(choice?.type).toBe("chooseTarget");
    expect((choice as { payload?: { min?: number; max?: number } }).payload?.max).toBe(1);
  });

  it("puts the Hacked Corpo Unit itself on the field when played", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailHackedCorpo],
        deck: 20,
        eddies: 4,
      },
      {},
    );

    engine.playCard(welcomeToNightCityRetailHackedCorpo, { as: P1 });

    expect(
      engine
        .getCardsInZone("field", P1)
        .some((card) => card.definitionId === welcomeToNightCityRetailHackedCorpo.id),
    ).toBe(true);
  });

  it("declares a play trigger that trashes 3 and recovers a Program to hand", () => {
    const ability = welcomeToNightCityRetailHackedCorpo.abilities[0]!;
    expect(ability.trigger).toMatchObject({ trigger: "play" });
    expect(ability.effects.map((effect) => effect.effect)).toEqual(["trashFromDeck", "moveCard"]);
    expect(ability.effects[0]).toMatchObject({ effect: "trashFromDeck", amount: 3 });
    expect(ability.effects[1]).toMatchObject({
      effect: "moveCard",
      destination: "hand",
      target: { selector: "bound", id: "trashedCards", cardTypes: ["program"] },
    });
  });
});
