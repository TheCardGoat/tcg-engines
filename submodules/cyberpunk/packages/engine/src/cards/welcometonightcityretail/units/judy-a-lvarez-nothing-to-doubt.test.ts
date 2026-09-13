import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailJudyALvarezNothingToDoubt,
  welcomeToNightCityRetailTheRelicExperimentalBiochip,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Judy Álvarez — Nothing to Doubt", () => {
  it("is a blue Ganger/Mox/Techie unit with cost 6 and power 6", () => {
    const card = welcomeToNightCityRetailJudyALvarezNothingToDoubt;
    expect(card.type).toBe("unit");
    expect(card.color).toBe("blue");
    expect(card.classifications).toEqual(["Ganger", "Mox", "Techie"]);
    expect(card.cost).toBe(6);
    expect(card.power).toBe(6);
    expect(card.printNumber).toBe("116");
  });

  it("plays to the field, pays cost, and enters with lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailJudyALvarezNothingToDoubt],
      eddies: 6,
    });

    engine.playCard(welcomeToNightCityRetailJudyALvarezNothingToDoubt, { as: P1 });

    const judy = engine.getCard(welcomeToNightCityRetailJudyALvarezNothingToDoubt, "field", P1);
    expect(judy.meta.hasLag).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("offers free-play of the revealed top card and can decline into hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJudyALvarezNothingToDoubt,
            spent: false,
            hasLag: false,
          },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.activateAbility(welcomeToNightCityRetailJudyALvarezNothingToDoubt, 0, { as: P1 });

    // Free-play choice for the revealed card.
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseCardToPlay");
    expect((choice as { payload?: { canDecline?: boolean } })?.payload?.canDecline).toBe(true);

    // Decline free-play → card should move to hand via elseEffects.
    engine.executeMove("resolveCardToPlay", { args: { pass: true } }, P1);

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(
      engine.getCard(welcomeToNightCityRetailJudyALvarezNothingToDoubt, "field", P1).meta.spent,
    ).toBe(true);
  });

  it("can free-play the revealed unit onto the field", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJudyALvarezNothingToDoubt,
            spent: false,
            hasLag: false,
          },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.activateAbility(welcomeToNightCityRetailJudyALvarezNothingToDoubt, 0, { as: P1 });
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
  });

  it("when revealing gear, requires a host attach choice instead of unattached field play", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJudyALvarezNothingToDoubt,
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

    engine.activateAbility(welcomeToNightCityRetailJudyALvarezNothingToDoubt, 0, { as: P1 });

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
});
