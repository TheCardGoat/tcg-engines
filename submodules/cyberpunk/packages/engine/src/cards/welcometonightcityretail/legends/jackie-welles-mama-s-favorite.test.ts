import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAnimalsWrecker,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2, expectAttackCandidate } from "../../../testing/index.ts";

const jackie = welcomeToNightCityRetailJackieWellesMamaSFavorite;

describe("Jackie Welles — Mama's Favorite", () => {
  it("is the exact green Merc GO SOLO Legend with its optional paid defeat replacement", () => {
    expect(jackie).toMatchObject({
      canonicalId: "jackie-welles-mama-s-favorite",
      slug: "jackie-welles-mama-s-favorite",
      name: "Jackie Welles",
      subname: "Mama's Favorite",
      displayName: "Jackie Welles: Mama's Favorite",
      type: "legend",
      color: "green",
      classifications: ["Merc"],
      cost: 6,
      power: 8,
      ram: 2,
      hasSellTag: true,
      keywords: ["goSolo"],
      printNumber: "073",
      rarity: "Rare",
      rulesText:
        "{Go Solo} (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)\nIf a friendly Unit would be defeated, you may spend 1 €$ to defeat this Legend instead. (Remove it from the game.)",
    });
    expect(jackie.abilities).toEqual([
      {
        kind: "keyword",
        text: "Go Solo (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)",
        keyword: "goSolo",
        source: { selector: "self" },
        effects: [],
      },
      {
        kind: "static",
        text: "If a friendly Unit would be defeated, you may spend 1 €$ to defeat this Legend instead. (Remove it from the game.)",
        effects: [
          {
            effect: "grantRule",
            target: { selector: "self" },
            rule: "redirectFriendlyDefeatToSelf",
            duration: "continuous",
          },
        ],
      },
    ]);
  });

  it("goes solo from the legend area and can attack this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false }],
      eddies: 6,
    });
    const jackieId = engine.findCardId(
      welcomeToNightCityRetailJackieWellesMamaSFavorite,
      "legendArea",
      P1,
    );

    const result = engine.executeMove("goSolo", { args: { cardId: jackieId as string } }, P1);

    expect(result.success).toBe(true);
    const jackie = engine.getCard(welcomeToNightCityRetailJackieWellesMamaSFavorite, "field", P1);
    expect(jackie.meta.spent).toBe(false);
    expect(jackie.meta.hasLag).toBe(false);
    expect(engine.getEddies(P1)).toBe(1);
    expectAttackCandidate(engine, welcomeToNightCityRetailJackieWellesMamaSFavorite, {
      as: P1,
    });
  });

  it("cannot go solo without enough eddies", () => {
    // Fill all three legend slots with Jackie face-up so filler face-down
    // legends cannot be spent as Eddie substitutes.
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false },
        { card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false },
        { card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false },
      ],
      eddies: 0,
    });
    const jackieId = engine.findCardId(
      welcomeToNightCityRetailJackieWellesMamaSFavorite,
      "legendArea",
      P1,
    );

    const result = engine.executeMove("goSolo", { args: { cardId: jackieId as string } }, P1);

    expect(result).toMatchObject({ success: false, errorCode: "INSUFFICIENT_EDDIES" });
  });

  it("may spend 1 Eddie and remove itself instead of a friendly Unit defeated in a fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: jackie, faceDown: false }],
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false }],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
      { activePlayerId: P2 },
    );
    engine.judgeSpendCard(jackie, { as: P1 });

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P2,
      },
    );
    engine.resolveAttack({ as: P2 });
    engine.resolveAttack({ as: P1, pass: true });
    engine.resolveAttack({ as: P2 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "redirectDefeat") throw new Error("Expected Jackie's choice.");
    expect(choice).toMatchObject({
      chooserId: P1,
      payload: { cost: 1 },
    });
    expect(engine.getPrompt(P1).choice).toMatchObject({
      type: "redirectDefeat",
      chooserId: P1,
      payload: {
        fightPlayerId: P2,
        source: { controllerId: P1 },
      },
    });
    engine.applyRedirectDefeat({ as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P1)).toBeDefined();
    expect(engine.getCardsInZone("removedFromGame", P1).map((card) => card.definitionId)).toContain(
      jackie.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getAttackState()).toBeNull();
  });

  it("may decline the replacement without paying, so the friendly Unit is defeated", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: jackie, faceDown: false }],
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false }],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
      { activePlayerId: P2 },
    );
    engine.judgeSpendCard(jackie, { as: P1 });

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P2,
      },
    );
    engine.resolveAttack({ as: P2 });
    engine.resolveAttack({ as: P1, pass: true });
    engine.resolveAttack({ as: P2 });
    engine.declineRedirectDefeat({ as: P1 });

    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getCard(jackie, "legendArea", P1)).toBeDefined();
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getAttackState()).toBeNull();
  });

  it("offers no replacement without a payable Eddie or while Jackie is face-down", () => {
    for (const fixture of [
      { faceDown: false, spent: true, eddies: 0 },
      { faceDown: true, spent: false, eddies: 1 },
    ]) {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: jackie, faceDown: fixture.faceDown }],
          field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false }],
          eddies: fixture.eddies,
        },
        {
          field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        },
        { activePlayerId: P2 },
      );
      if (fixture.spent) engine.judgeSpendCard(jackie, { as: P1 });
      expect(engine.getCard(jackie, "legendArea", P1).meta).toMatchObject({
        faceDown: fixture.faceDown,
        spent: fixture.spent,
      });

      engine.attackUnit(
        welcomeToNightCityRetailFieldOperator,
        welcomeToNightCityRetailCorpoSecurity,
        { as: P2 },
      );
      engine.resolveFullFight({ as: P2 });

      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
      expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
        welcomeToNightCityRetailCorpoSecurity.id,
      );
      expect(engine.getCard(jackie, "legendArea", P1)).toBeDefined();
    }
  });

  it("cannot replace its own defeat after going solo and is removed from the game", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: jackie, faceDown: false }],
        eddies: 7,
      },
      {
        field: [{ card: welcomeToNightCityRetailAnimalsWrecker, spent: true, hasLag: false }],
      },
    );
    const jackieId = engine.findCardId(jackie, "legendArea", P1);
    engine.executeMove("goSolo", { args: { cardId: jackieId } }, P1);

    engine.attackUnit(jackie, welcomeToNightCityRetailAnimalsWrecker, { as: P1 });
    engine.resolveFullFight({ as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("removedFromGame", P1).map((card) => card.definitionId)).toContain(
      jackie.id,
    );
    expect(engine.getEddies(P1)).toBe(2);
  });
});
