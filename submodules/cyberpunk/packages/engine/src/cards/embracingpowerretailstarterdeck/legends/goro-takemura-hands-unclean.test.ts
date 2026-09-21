import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  welcomeToNightCityRetailAdamSmasherMetalOverMeat,
  welcomeToNightCityRetailDelamainCab,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2, expectAttackCandidate } from "../../../testing/index.ts";

describe("Goro Takemura - Hands Unclean (Embracing Power retail starter)", () => {
  it("is the exact 5-cost 7-power green Arasaka Corpo Legend with GO SOLO and BLOCKER", () => {
    const goro = embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean;

    expect(goro).toMatchObject({
      canonicalId: "goro-takemura-hands-unclean",
      slug: "goro-takemura-hands-unclean",
      name: "Goro Takemura",
      subname: "Hands Unclean",
      displayName: "Goro Takemura: Hands Unclean",
      type: "legend",
      color: "green",
      classifications: ["Arasaka", "Corpo"],
      cost: 5,
      power: 7,
      ram: 2,
      hasSellTag: true,
      keywords: ["goSolo", "blocker"],
      printNumber: "012",
      rarity: "Epic",
      rulesText:
        "{Go Solo} (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)\n{Blocker} (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
    });
    expect(goro.abilities).toEqual([
      expect.objectContaining({ kind: "keyword", keyword: "goSolo" }),
      expect.objectContaining({ kind: "keyword", keyword: "blocker" }),
    ]);
  });

  it("pays for GO SOLO using its own Sell Tag and enters ready to attack this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: false },
      ],
      eddies: 5,
    });
    const goroId = engine.findCardId(
      embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
      "legendArea",
      P1,
    );

    const result = engine.executeMove("goSolo", { args: { cardId: goroId as string } }, P1);

    expect(result.success).toBe(true);
    const goro = engine.getCard(
      embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
      "field",
      P1,
    );
    expect(goro.meta.spent).toBe(false);
    expect(goro.meta.hasLag).toBe(false);
    expect(engine.getEddies(P1)).toBe(1);
    expectAttackCandidate(engine, embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, {
      as: P1,
    });
  });

  it("cannot go solo while face-down", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: true },
      ],
      eddies: 5,
    });
    const goroId = engine.findCardId(
      embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
      "legendArea",
      P1,
    );

    const result = engine.executeMove("goSolo", { args: { cardId: goroId as string } }, P1);

    expect(result).toMatchObject({ success: false, errorCode: "CARD_FACE_DOWN" });
    expect(
      engine.getCard(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, "legendArea", P1).meta
        .faceDown,
    ).toBe(true);
  });

  it("cannot go solo without paying the full printed cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: false },
      ],
      eddies: 3,
    });
    const goroId = engine.findCardId(
      embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
      "legendArea",
      P1,
    );

    const result = engine.executeMove("goSolo", { args: { cardId: goroId as string } }, P1);

    expect(result).toMatchObject({ success: false, errorCode: "INSUFFICIENT_EDDIES" });
    expect(engine.getEddies(P1)).toBe(3);
    expect(
      engine.getCard(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, "legendArea", P1),
    ).toBeDefined();
  });

  it("is removed from the game rather than trashed after GO SOLO when it leaves the field", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailAdamSmasherMetalOverMeat],
      legendArea: [
        { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: false },
      ],
      eddies: 14,
    });
    const goroId = engine.findCardId(
      embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
      "legendArea",
      P1,
    );

    engine.executeMove("goSolo", { args: { cardId: goroId as string } }, P1);
    engine.playCard(welcomeToNightCityRetailAdamSmasherMetalOverMeat, { as: P1 });

    expect(engine.getCardsInZone("removedFromGame", P1).map((card) => card.definitionId)).toContain(
      embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean.id,
    );
  });

  it("spends as BLOCKER to redirect a rival direct attack into a fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, { as: P1 });

    expect(
      engine.getCard(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, "field", P1).meta
        .spent,
    ).toBe(true);
    expect(engine.getAttackState()).toMatchObject({
      kind: "fight",
      defenderId: engine.findCardId(
        embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
        "field",
        P1,
      ),
    });
  });

  it("does not let a spent Goro block", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
            spent: true,
            hasLag: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P2 });
    engine.resolveAttack({ as: P2 });
    const failure = engine.expectFailure(() =>
      engine.useBlocker(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, { as: P1 }),
    );

    expect(failure.errorCode).toBe("CARD_SPENT");
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailDelamainCab.id,
    );
  });
});
