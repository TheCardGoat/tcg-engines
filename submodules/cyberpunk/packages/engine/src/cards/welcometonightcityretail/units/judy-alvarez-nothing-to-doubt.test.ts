import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailJudyAlvarezNothingToDoubt,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailTheRelicExperimentalBiochip,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Judy Álvarez — Nothing to Doubt", () => {
  it("is the exact blue 6-cost 6-power Ganger Mox Techie Unit with its activation", () => {
    const card = welcomeToNightCityRetailJudyAlvarezNothingToDoubt;
    expect(card).toMatchObject({
      type: "unit",
      color: "blue",
      classifications: ["Ganger", "Mox", "Techie"],
      cost: 6,
      power: 6,
      printNumber: "116",
      ram: 5,
      hasSellTag: false,
    });
    expect(card.abilities).toEqual([
      expect.objectContaining({
        trigger: { trigger: "activated" },
        costs: [
          { cost: "payEddies", amount: 1 },
          { cost: "spend", target: { selector: "self" } },
        ],
        effects: [
          {
            effect: "trashFromDeck",
            player: "friendly",
            amount: 1,
            outputBinding: "revealed",
          },
          expect.objectContaining({
            effect: "playCard",
            target: { selector: "bound", id: "revealed" },
            free: true,
            optional: true,
            elseEffects: [
              {
                effect: "moveCard",
                target: { selector: "bound", id: "revealed" },
                destination: "hand",
              },
            ],
          }),
        ],
      }),
    ]);
  });

  it("plays to the field, pays cost, and enters with lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailJudyAlvarezNothingToDoubt],
      eddies: 6,
    });

    engine.playCard(welcomeToNightCityRetailJudyAlvarezNothingToDoubt, { as: P1 });

    const judy = engine.getCard(welcomeToNightCityRetailJudyAlvarezNothingToDoubt, "field", P1);
    expect(judy.meta.hasLag).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("offers free-play of the revealed top card and can decline into hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJudyAlvarezNothingToDoubt,
            spent: false,
            hasLag: false,
          },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        trash: [welcomeToNightCityRetailFloorIt],
        eddies: 1,
      },
      {},
      { preserveDeckOrder: true },
    );
    for (const legendId of engine.getState().G.players[P1]!.zones.legendArea) {
      engine.getState().G.cardIndex[legendId as string]!.meta.spent = true;
    }

    engine.activateAbility(welcomeToNightCityRetailJudyAlvarezNothingToDoubt, 0, { as: P1 });

    // Free-play choice for the revealed card.
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseCardToPlay") {
      throw new Error("Expected revealed-card play choice.");
    }
    const revealedId = engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "trash", P1);
    const oldTrashId = engine.findCardId(welcomeToNightCityRetailFloorIt, "trash", P1);
    expect(choice.payload.canDecline).toBe(true);
    expect(choice.payload.cardIds).toEqual([revealedId]);
    expect(choice.payload.cardIds).not.toContain(oldTrashId);

    // Decline free-play → card should move to hand via elseEffects.
    engine.executeMove("resolveCardToPlay", { args: { pass: true } }, P1);

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(
      engine.getCard(welcomeToNightCityRetailJudyAlvarezNothingToDoubt, "field", P1).meta.spent,
    ).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFloorIt.id,
    );
  });

  it("can free-play the revealed unit onto the field", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJudyAlvarezNothingToDoubt,
            spent: false,
            hasLag: false,
          },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailOffdutyMalfini],
        eddies: 1,
      },
      {},
      { preserveDeckOrder: true },
    );
    for (const legendId of engine.getState().G.players[P1]!.zones.legendArea) {
      engine.getState().G.cardIndex[legendId as string]!.meta.spent = true;
    }

    engine.activateAbility(welcomeToNightCityRetailJudyAlvarezNothingToDoubt, 0, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseCardToPlay");
    if (choice?.type === "chooseCardToPlay") {
      const cardId = choice.payload.cardIds[0]!;
      engine.executeMove("resolveCardToPlay", { args: { cardId: cardId as string } }, P1);
    }

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P1).meta.hasLag).toBe(
      true,
    );
    expect(engine.getCardsInZone("deck", P1)[0]?.definitionId).toBe(
      welcomeToNightCityRetailOffdutyMalfini.id,
    );
    expect(engine.getEddies(P1)).toBe(0);
    expect(
      engine.getCard(welcomeToNightCityRetailJudyAlvarezNothingToDoubt, "field", P1).meta.spent,
    ).toBe(true);
  });

  it("when revealing gear, requires a host attach choice instead of unattached field play", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJudyAlvarezNothingToDoubt,
            spent: false,
            hasLag: false,
          },
          {
            card: welcomeToNightCityRetailCorpoSecurity,
            spent: false,
            hasLag: false,
          },
        ],
        deck: [welcomeToNightCityRetailTheRelicExperimentalBiochip],
        eddies: 1,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.activateAbility(welcomeToNightCityRetailJudyAlvarezNothingToDoubt, 0, { as: P1 });

    // Gear free-play becomes an attach-host target choice (or decline → hand).
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (choice?.type === "chooseTarget") {
      expect(choice.payload.canDecline).toBe(true);
      expect(choice.payload.targetPurpose).toBe("attachHost");
      engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    }

    const host = engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P1);
    expect(host.meta.attachedGearIds.length).toBe(1);
    // Gear must not sit unattached on the field.
    const unattachedGear = engine
      .getCardsInZone("field", P1)
      .filter(
        (c) =>
          c.definitionId === welcomeToNightCityRetailTheRelicExperimentalBiochip.id &&
          !c.meta.attachedToId,
      );
    expect(unattachedGear).toHaveLength(0);
  });

  it("cannot activate without the required Eddie and leaves the deck and Judy unchanged", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJudyAlvarezNothingToDoubt,
            spent: false,
            hasLag: false,
          },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 0,
      },
      {},
      { preserveDeckOrder: true },
    );
    for (const legendId of engine.getState().G.players[P1]!.zones.legendArea) {
      engine.getState().G.cardIndex[legendId as string]!.meta.spent = true;
    }

    const failure = engine.expectFailure(() =>
      engine.activateAbility(welcomeToNightCityRetailJudyAlvarezNothingToDoubt, 0, { as: P1 }),
    );

    expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    expect(engine.getCardsInZone("deck", P1)[0]?.definitionId).toBe(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(
      engine.getCard(welcomeToNightCityRetailJudyAlvarezNothingToDoubt, "field", P1).meta.spent,
    ).toBe(false);
  });

  it("cannot activate while Judy is already spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJudyAlvarezNothingToDoubt,
            spent: true,
            hasLag: false,
          },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
      },
      {},
      { preserveDeckOrder: true },
    );
    engine.getCard(welcomeToNightCityRetailJudyAlvarezNothingToDoubt, "field", P1).meta.spent =
      true;

    const failure = engine.expectFailure(() =>
      engine.activateAbility(welcomeToNightCityRetailJudyAlvarezNothingToDoubt, 0, { as: P1 }),
    );

    expect(failure.errorCode).toBe("CARD_SPENT");
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getCardsInZone("deck", P1)[0]?.definitionId).toBe(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("cannot activate its Spend ability while Judy has Lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJudyAlvarezNothingToDoubt,
            spent: false,
            hasLag: true,
          },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
      },
      {},
      { preserveDeckOrder: true },
    );

    const failure = engine.expectFailure(() =>
      engine.activateAbility(welcomeToNightCityRetailJudyAlvarezNothingToDoubt, 0, { as: P1 }),
    );

    expect(failure.errorCode).toBe("CARD_SPENT");
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getCardsInZone("deck", P1)[0]?.definitionId).toBe(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });
});
