import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailSketchyRipper,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Sketchy Ripper", () => {
  it("searches the top 3 on attack, reveals a Gear, and adds it to hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailSketchyRipper, spent: false, playedThisTurn: false },
        ],
        deck: [welcomeToNightCityRetailMoxInciters, welcomeToNightCityRetailKiroshiOptics],
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      { preserveDeckOrder: true },
    );

    engine.attackRival(welcomeToNightCityRetailSketchyRipper, { as: P1 });

    const choice = engine.getPrompt(P1).choice;
    expect(choice).toMatchObject({
      type: "chooseTarget",
      payload: {
        source: {
          displayName: "Sketchy Ripper",
          rulesText: expect.stringContaining("Search the top 3 cards"),
        },
      },
    });
    if (choice?.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
      throw new Error("Expected Sketchy Ripper to offer attack-trigger targets.");
    }
    expect(choice?.payload.eligibleIds).toContain(
      engine.getCard(welcomeToNightCityRetailKiroshiOptics, "deck", P1).instanceId,
    );

    engine.resolveEffectTarget(welcomeToNightCityRetailKiroshiOptics, {
      as: P1,
      allowPendingChoice: true,
      reason: "Sketchy Ripper still needs the deck search selection to resolve",
    });
    expect(engine.getPrompt(P1).choice).toMatchObject({
      type: "searchDeck",
      payload: {
        source: {
          displayName: "Sketchy Ripper",
        },
      },
    });
    engine.resolveSearchDeck([welcomeToNightCityRetailKiroshiOptics], { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailKiroshiOptics.id,
    );
    expect(engine.getCardsInZone("deck", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMoxInciters.id,
    );
  });

  it("can choose no Gear and still resolves the attack trigger", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailSketchyRipper, spent: false, playedThisTurn: false },
        ],
        deck: [welcomeToNightCityRetailMoxInciters],
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      { preserveDeckOrder: true },
    );

    engine.attackRival(welcomeToNightCityRetailSketchyRipper, { as: P1 });
    engine.executeMove("resolveEffectTarget", { args: { targetIds: [] } }, P1);
    expect(engine.getPrompt(P1).choice).toMatchObject({ type: "searchDeck" });
    engine.resolveSearchDeck([], { as: P1 });

    expect(engine.getPrompt(P1).choice).toBeNull();
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
  });
});
