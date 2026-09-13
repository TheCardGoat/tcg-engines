import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailTheRelicExperimentalBiochip,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("The Relic — Experimental Biochip", () => {
  it("is yellow Arasaka/Cyberware gear with cost 5 and power 3", () => {
    const card = welcomeToNightCityRetailTheRelicExperimentalBiochip;
    expect(card.type).toBe("gear");
    expect(card.color).toBe("yellow");
    expect(card.classifications).toEqual(["Arasaka", "Cyberware"]);
    expect(card.cost).toBe(5);
    expect(card.power).toBe(3);
    expect(card.printNumber).toBe("063");
    expect(card.abilities[0]?.trigger).toMatchObject({ trigger: "defeated" });
    expect(card.abilities[0]?.effects.map((effect) => effect.effect)).toEqual([
      "playCard",
      "moveCard",
    ]);
    const bottomDeck = card.abilities[0]?.effects[1];
    expect(bottomDeck).toMatchObject({
      effect: "moveCard",
      destination: "deckBottom",
      target: { selector: "host" },
    });
  });

  it("attaches to a friendly unit and pays cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailTheRelicExperimentalBiochip],
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
      eddies: 5,
    });

    engine.attachGear(
      welcomeToNightCityRetailTheRelicExperimentalBiochip,
      welcomeToNightCityRetailFieldOperator,
      { as: P1 },
    );

    expect(
      engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1).meta.attachedGearIds,
    ).toHaveLength(1);
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("fires Defeated when its host is defeated, free-plays another Unit, and bottom-decks the host", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: true,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailTheRelicExperimentalBiochip],
          },
        ],
        trash: [welcomeToNightCityRetailSwordwiseHuscle],
        deck: [welcomeToNightCityRetailDelamainCab],
      },
      {
        field: [
          {
            // Base power 4 + modifier so it beats Field Operator (2) + Relic (3).
            card: welcomeToNightCityRetailDelamainCab,
            spent: false,
            hasLag: false,
            powerModifier: 5,
          },
        ],
      },
    );

    const hostInstanceId = engine.getCard(
      welcomeToNightCityRetailFieldOperator,
      "field",
      P1,
    ).instanceId;

    // Strong rival attacks and defeats the equipped host.
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(welcomeToNightCityRetailDelamainCab, welcomeToNightCityRetailFieldOperator, {
      as: P2,
    });
    engine.resolveFullFight({ as: P2 });

    // Binding: choose another Unit from trash (host must not be eligible).
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (choice?.type === "chooseTarget") {
      const eligible = choice.payload.eligibleIds ?? [];
      expect(eligible).not.toContain(hostInstanceId);
      engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });
    }

    // Free-play puts Swordwise on the field.
    expect(engine.getCardsInZone("field", P1).map((c) => c.definitionId)).toContain(
      welcomeToNightCityRetailSwordwiseHuscle.id,
    );

    // Host is bottom-decked (not left in trash); gear stays out of field.
    expect(engine.getCardsInZone("field", P1).map((c) => c.definitionId)).not.toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((c) => c.definitionId)).not.toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    const deckIds = engine.getCardsInZone("deck", P1).map((c) => c.definitionId);
    expect(deckIds[deckIds.length - 1]).toBe(welcomeToNightCityRetailFieldOperator.id);
  });
});
