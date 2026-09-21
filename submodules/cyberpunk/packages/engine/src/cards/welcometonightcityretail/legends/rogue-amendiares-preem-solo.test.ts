import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailRogueAmendiaresPreemSolo,
  welcomeToNightCityRetailAdamSmasherMetalOverMeat,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2, expectAttackCandidate } from "../../../testing/index.ts";

const rogue = welcomeToNightCityRetailRogueAmendiaresPreemSolo;

function drainMandatoryTriggerChoices(engine: CyberpunkTestEngine): void {
  for (;;) {
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTrigger") return;
    const first = choice.payload.options[0];
    if (!first) throw new Error("Expected a mandatory trigger option");
    expect(choice.payload.canPass).toBe(false);
    engine.executeMove(
      "resolveTrigger",
      { args: { triggerId: first.triggerId } },
      choice.chooserId,
    );
  }
}

describe("Rogue Amendiares — Preem Solo", () => {
  it("has the exact yellow Merc GO SOLO identity and per-Gig parity trigger", () => {
    expect(rogue).toMatchObject({
      canonicalId: "rogue-amendiares-preem-solo",
      slug: "rogue-amendiares-preem-solo",
      name: "Rogue Amendiares",
      subname: "Preem Solo",
      displayName: "Rogue Amendiares: Preem Solo",
      type: "legend",
      color: "yellow",
      classifications: ["Merc"],
      printNumber: "040",
      cost: 7,
      power: 7,
      ram: 2,
      hasSellTag: true,
      rarity: "Rare",
      keywords: ["goSolo"],
      rulesText:
        "{Go Solo} (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)\nWhen a friendly Legend steals a Gig, if its value is even, draw 1. If its value is odd, a Rival discards 1.",
      abilities: [
        { kind: "keyword", keyword: "goSolo" },
        {
          kind: "triggered",
          trigger: {
            trigger: "event",
            event: {
              event: "gigStolen",
              player: "friendly",
              target: { selector: "gig", controller: "rival", amount: 1 },
              minAmount: 1,
              perGig: true,
              source: { controller: "friendly", cardTypes: ["legend"] },
            },
          },
          effects: [
            { effect: "draw", player: "friendly", amount: 1 },
            { effect: "discardFromHand", player: "rival", amount: 1 },
          ],
        },
      ],
    });
  });

  it("goes solo as a ready Unit that can attack this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: rogue, faceDown: false }],
      eddies: 7,
    });
    const id = engine.findCardId(rogue, "legendArea", P1);
    expect(engine.executeMove("goSolo", { args: { cardId: id as string } }, P1).success).toBe(true);
    expect(engine.getEddies(P1)).toBe(1);
    expectAttackCandidate(engine, rogue, { as: P1 });
  });

  it("cannot go solo without its exact printed cost, including its own Sell Tag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: rogue, faceDown: false }],
      eddies: 5,
    });
    const id = engine.findCardId(rogue, "legendArea", P1);

    expect(engine.executeMove("goSolo", { args: { cardId: id as string } }, P1)).toMatchObject({
      success: false,
      errorCode: "INSUFFICIENT_EDDIES",
    });
    expect(engine.getEddies(P1)).toBe(5);
    expect(engine.getCard(rogue, "legendArea", P1)).toBeDefined();
  });

  it("is removed from the game rather than trashed after GO SOLO when it leaves the field", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailAdamSmasherMetalOverMeat],
      legendArea: [{ card: rogue, faceDown: false }],
      eddies: 20,
    });
    const id = engine.findCardId(rogue, "legendArea", P1);

    engine.executeMove("goSolo", { args: { cardId: id as string } }, P1);
    engine.playCard(welcomeToNightCityRetailAdamSmasherMetalOverMeat, { as: P1 });

    expect(engine.getCardsInZone("removedFromGame", P1).map((card) => card.definitionId)).toContain(
      rogue.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      rogue.id,
    );
  });

  it("draws 1 when a friendly Legend steals an even Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: rogue, faceDown: false }],
        field: [
          {
            card: welcomeToNightCityRetailJackieWellesMamaSFavorite,
            spent: false,
            hasLag: false,
            faceDown: false,
          },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 7,
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      },
    );
    const handBefore = engine.getHandCount(P1);
    engine.attackRival(welcomeToNightCityRetailJackieWellesMamaSFavorite, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    expect(engine.getHandCount(P1)).toBe(handBefore + 1);
  });

  it("makes a Rival discard 1 when a friendly Legend steals an odd Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: rogue, faceDown: false }],
        field: [
          {
            card: welcomeToNightCityRetailJackieWellesMamaSFavorite,
            spent: false,
            hasLag: false,
            faceDown: false,
          },
        ],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 3 }],
        hand: [welcomeToNightCityRetailCorpoSecurity],
      },
    );

    engine.attackRival(welcomeToNightCityRetailJackieWellesMamaSFavorite, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    expect(engine.getCardsInZone("hand", P2)).toHaveLength(0);
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("does not trigger when a friendly Unit that is not a Legend steals a Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: rogue, faceDown: false }],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        deck: [welcomeToNightCityRetailCorpoSecurity],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      },
    );
    const handBefore = engine.getHandCount(P1);
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    expect(engine.getHandCount(P1)).toBe(handBefore);
  });

  it("resolves once per Gig when a friendly Legend simultaneously steals one even and one odd Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: rogue, faceDown: false }],
        field: [
          {
            card: welcomeToNightCityRetailJackieWellesMamaSFavorite,
            spent: false,
            hasLag: false,
            faceDown: false,
            powerModifier: 5,
          },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity],
      },
      {
        gigArea: [
          { dieType: "d6", faceValue: 3 },
          { dieType: "d4", faceValue: 4 },
        ],
        hand: [welcomeToNightCityRetailFieldOperator],
      },
      { preserveDeckOrder: true },
    );
    engine.attackRival(welcomeToNightCityRetailJackieWellesMamaSFavorite, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    drainMandatoryTriggerChoices(engine);

    expect(engine.getHandCount(P1)).toBe(1);
    expect(engine.getHandCount(P2)).toBe(0);
  });
});
