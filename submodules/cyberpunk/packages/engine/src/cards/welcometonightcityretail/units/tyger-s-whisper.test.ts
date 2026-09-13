import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailRogueAmendiaresPreemSolo,
  welcomeToNightCityRetailTygerSWhisper,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const whisper = welcomeToNightCityRetailTygerSWhisper;

describe("Tyger's Whisper", () => {
  it("is a green power-0 Fixer that may Call a Legend for free on play", () => {
    expect(whisper).toMatchObject({
      type: "unit",
      color: "green",
      cost: 2,
      power: 0,
      printNumber: "090",
    });
    expect(whisper.abilities[0]?.effects[0]).toMatchObject({
      effect: "callLegend",
      free: true,
      optional: true,
    });
  });

  it("can Call a face-down Legend for free when played", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [whisper],
      eddies: 2,
      legendArea: [{ card: welcomeToNightCityRetailRogueAmendiaresPreemSolo, faceDown: true }],
    });

    engine.playCard(whisper, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    engine.resolveEffectTarget(welcomeToNightCityRetailRogueAmendiaresPreemSolo, { as: P1 });

    const legend = engine.getCard(
      welcomeToNightCityRetailRogueAmendiaresPreemSolo,
      "legendArea",
      P1,
    );
    expect(legend.meta.faceDown).toBe(false);
    expect(engine.getEddies(P1)).toBe(0);
  });
});
