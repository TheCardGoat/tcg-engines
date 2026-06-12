import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { hiddenCoveTranquilHaven } from "../../009/locations/102-hidden-cove-tranquil-haven";
import { taffytaMuttonfudgeSourSpeedster } from "../../005/characters/117-taffyta-muttonfudge-sour-speedster";
import { magicCarpetFlyingRug } from "./047-magic-carpet-flying-rug";

describe("Magic Carpet - Flying Rug", () => {
  describe("FIND THE WAY — {E} Move a character of yours to a location for free.", () => {
    it("moves a character to a location for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: magicCarpetFlyingRug, exerted: false },
          hiddenCoveTranquilHaven,
          taffytaMuttonfudgeSourSpeedster,
        ],
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(magicCarpetFlyingRug, {
          ability: "FIND THE WAY",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [taffytaMuttonfudgeSourSpeedster, hiddenCoveTranquilHaven],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toBeAtLocation({
        card: taffytaMuttonfudgeSourSpeedster,
        location: hiddenCoveTranquilHaven,
      });
    });

    it("triggers move-to-location abilities when a character moves to a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: magicCarpetFlyingRug, exerted: false },
          hiddenCoveTranquilHaven,
          taffytaMuttonfudgeSourSpeedster,
        ],
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(magicCarpetFlyingRug, {
          ability: "FIND THE WAY",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [taffytaMuttonfudgeSourSpeedster, hiddenCoveTranquilHaven],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toBeAtLocation({
        card: taffytaMuttonfudgeSourSpeedster,
        location: hiddenCoveTranquilHaven,
      });

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
    });
  });
});
