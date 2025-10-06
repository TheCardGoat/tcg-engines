/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { hakunaMatata } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/027-hakuna-matata";
import { clarabelleLightOnHerHooves } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/084-clarabelle-light-on-her-hooves";
import { allIsFound } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  mickeyMouseBraveLittlePrince,
  minnieMouseSweetheartPrincess,
  ursulaVoiceStealer,
} from "~/game-engine/engines/lorcana/src/cards/definitions/009";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ursula - Voice Stealer", () => {
  it("SING FOR ME When you play this character, exert chosen opposing ready character. Then, you may play a song with cost equal to or less than the exerted character's cost for free.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: ursulaVoiceStealer.cost,
        hand: [ursulaVoiceStealer, hakunaMatata],
      },
      {
        play: [minnieMouseSweetheartPrincess],
      },
    );

    await testEngine.playCard(
      ursulaVoiceStealer,
      {
        acceptOptionalLayer: true,
        targets: [minnieMouseSweetheartPrincess],
      },
      true,
    );

    expect(testEngine.getCardModel(minnieMouseSweetheartPrincess).ready).toBe(
      false,
    );

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [hakunaMatata] });
    expect(testEngine.getCardModel(hakunaMatata).zone).toBe("discard");
  });

  describe("Regression", () => {
    it("Clarabelle interaction", async () => {
      const targets = [
        minnieMouseSweetheartPrincess,
        mickeyMouseBraveLittlePrince,
      ];
      const testEngine = new TestEngine(
        {
          inkwell: ursulaVoiceStealer.cost,
          hand: [ursulaVoiceStealer, allIsFound],
          discard: targets,
        },
        {
          play: [clarabelleLightOnHerHooves],
        },
      );

      await testEngine.playCard(
        ursulaVoiceStealer,
        {
          targets: [clarabelleLightOnHerHooves],
          acceptOptionalLayer: true,
        },
        true,
      );

      expect(testEngine.getCardModel(clarabelleLightOnHerHooves).ready).toBe(
        false,
      );

      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack({ targets: [allIsFound] }, true);
      expect(testEngine.getCardModel(allIsFound).zone).toBe("discard");

      await testEngine.resolveTopOfStack({ targets: targets });

      for (const target of targets) {
        // "Put up to 2 cards from your discard into your inkwell, facedown and exerted."
        expect(testEngine.getCardModel(target).zone).toBe("inkwell");
      }
    });
  });
});
