import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailJudyALvarezBraindanceMaestro,
  welcomeToNightCityRetailMaelstromZealots,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Judy Álvarez — Braindance Maestro", () => {
  it("declares the BRAINDANCE-Program power grant and the spend-trash recovery", () => {
    const abilities = welcomeToNightCityRetailJudyALvarezBraindanceMaestro.abilities;
    expect(abilities).toHaveLength(2);

    // Ability 1: when you play a BRAINDANCE Program, give a friendly Unit +1 power this turn.
    expect(abilities[0]!.trigger).toMatchObject({
      trigger: "event",
      event: {
        event: "cardPlayed",
        player: "friendly",
        target: {
          selector: "card",
          controller: "friendly",
          cardTypes: ["program"],
          classifications: ["Braindance"],
        },
      },
    });
    expect(abilities[0]!.effects[0]).toMatchObject({
      effect: "modifyPower",
      value: 1,
      duration: "turn",
    });

    // Ability 2: {Spend} trash the top card; if it's a Program, you may add it to hand.
    expect(abilities[1]!.trigger).toMatchObject({ trigger: "activated" });
    expect(abilities[1]!.costs).toEqual([{ cost: "spend", target: { selector: "self" } }]);
    expect(abilities[1]!.effects.map((effect) => effect.effect)).toEqual([
      "trashFromDeck",
      "moveCard",
    ]);
    expect(abilities[1]!.effects[1]).toMatchObject({
      effect: "moveCard",
      destination: "hand",
      optional: true,
      target: { selector: "bound", id: "trashedCards", cardTypes: ["program"] },
    });
  });

  it("is a face-up legend with the braindance-maestro identity", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        {
          card: welcomeToNightCityRetailJudyALvarezBraindanceMaestro,
          faceDown: false,
          spent: false,
        },
      ],
      field: [{ card: welcomeToNightCityRetailMaelstromZealots, spent: false, hasLag: false }],
    });

    expect(
      engine.getCard(welcomeToNightCityRetailJudyALvarezBraindanceMaestro, "legendArea", P1).meta
        .faceDown,
    ).toBe(false);
  });
});
