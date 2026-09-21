import { describe, expect, it } from "vite-plus/test";

import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailGunpointDiplomacy,
  welcomeToNightCityRetailHackedCorpo,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailRebootOptics,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Hacked Corpo (registration)", () => {
  it("is the exact 4-cost 3-power blue AI Corpo Unit with its Play sequence", () => {
    expect(welcomeToNightCityRetailHackedCorpo).toMatchObject({
      canonicalId: "hacked-corpo",
      slug: "hacked-corpo",
      name: "Hacked Corpo",
      displayName: "Hacked Corpo",
      type: "unit",
      color: "blue",
      classifications: ["AI", "Corpo"],
      cost: 4,
      power: 3,
      ram: 1,
      hasSellTag: false,
      printNumber: "114",
      rarity: "Common",
      rulesText: "{Play} Trash 3. Add a Program from among them to your hand.",
    });
    expect(welcomeToNightCityRetailHackedCorpo.abilities).toHaveLength(1);
    expect(welcomeToNightCityRetailHackedCorpo.abilities[0]).toMatchObject({
      trigger: { trigger: "play" },
      effects: [
        {
          effect: "trashFromDeck",
          player: "friendly",
          amount: 3,
          outputBinding: "trashedCards",
        },
        {
          effect: "moveCard",
          target: {
            selector: "bound",
            id: "trashedCards",
            cardTypes: ["program"],
            selection: { min: 1, max: 1 },
          },
          destination: "hand",
          outputBinding: "recoveredProgram",
        },
      ],
    });
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
          welcomeToNightCityRetailCorpoSecurity,
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
    expect(engine.getCardsInZone("deck", P1)[0]?.definitionId).toBe(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailOffdutyMalfini.id,
        welcomeToNightCityRetailKiroshiOptics.id,
      ]),
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailRebootOptics.id,
    );
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
    expect(choice?.chooserId).toBe(P1);
    expect(choice?.type === "chooseTarget" ? choice.payload : undefined).toMatchObject({
      min: 1,
      max: 1,
      canDecline: false,
    });
    expect(
      engine.executeMove("resolveEffectTarget", { args: { targetIds: [], pass: true } }, P1),
    ).toMatchObject({ success: false, errorCode: "CANNOT_PASS" });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
  });

  it("chooses exactly one of multiple newly trashed Programs and excludes old trash", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailHackedCorpo],
        deck: [
          welcomeToNightCityRetailRebootOptics,
          welcomeToNightCityRetailFloorIt,
          welcomeToNightCityRetailOffdutyMalfini,
        ],
        trash: [welcomeToNightCityRetailGunpointDiplomacy],
        eddies: 4,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailHackedCorpo, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected Program choice.");
    const rebootId = engine.findCardId(welcomeToNightCityRetailRebootOptics, "trash", P1);
    const floorItId = engine.findCardId(welcomeToNightCityRetailFloorIt, "trash", P1);
    const oldTrashId = engine.findCardId(welcomeToNightCityRetailGunpointDiplomacy, "trash", P1);
    const eligibleIds = choice.payload.eligibleIds ?? [];
    expect(choice.chooserId).toBe(P1);
    expect(choice.payload).toMatchObject({ min: 1, max: 1, canDecline: false });
    expect(eligibleIds.sort()).toEqual([floorItId, rebootId].sort());
    expect(eligibleIds).not.toContain(oldTrashId);

    expect(
      engine.executeMove("resolveEffectTarget", { args: { targetIds: [oldTrashId] } }, P1),
    ).toMatchObject({ success: false, errorCode: "INVALID_CHOICE" });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailGunpointDiplomacy.id,
    );

    engine.resolveEffectTargetIds([floorItId], { as: P1 });
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFloorIt.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailRebootOptics.id,
        welcomeToNightCityRetailOffdutyMalfini.id,
        welcomeToNightCityRetailGunpointDiplomacy.id,
      ]),
    );
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
    expect(engine.getCard(welcomeToNightCityRetailHackedCorpo, "field", P1).meta.hasLag).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
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
