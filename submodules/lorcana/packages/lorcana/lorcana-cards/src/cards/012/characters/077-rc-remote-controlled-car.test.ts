import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { reckless } from "../../../helpers/abilities/reckless";
import { rcRemotecontrolledCar } from "./077-rc-remote-controlled-car";

const defender = createMockCharacter({
  id: "rc-test-defender",
  name: "Test Defender",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
});

describe("RC - Remote-Controlled Car", () => {
  describe("LOW BATTERIES - This character can't quest or challenge unless you pay 1 {I}. (You pay this cost each time.)", () => {
    it("cannot quest when the controller has no ready ink to pay the bypass", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 0,
        play: [{ card: rcRemotecontrolledCar, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().quest(rcRemotecontrolledCar).success).toBe(false);
    });

    it("cannot challenge when the controller has no ready ink to pay the bypass", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 0,
          play: [{ card: rcRemotecontrolledCar, isDrying: false }],
        },
        {
          play: [{ card: defender, exerted: true, isDrying: false }],
        },
      );

      expect(testEngine.asPlayerOne().challenge(rcRemotecontrolledCar, defender).success).toBe(
        false,
      );
    });

    it("can quest when the controller has 1 ready ink, gaining lore and exerting RC", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 1,
        play: [{ card: rcRemotecontrolledCar, isDrying: false }],
      });

      const initialLore = testEngine.getLore("player_one");
      expect(testEngine.asPlayerOne().quest(rcRemotecontrolledCar)).toBeSuccessfulCommand();
      expect(testEngine.getLore("player_one")).toBe(initialLore + rcRemotecontrolledCar.lore);
      expect(testEngine.asPlayerOne().isExerted(rcRemotecontrolledCar)).toBe(true);
    });

    it("can challenge when the controller has 1 ready ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 1,
          play: [{ card: rcRemotecontrolledCar, isDrying: false }],
        },
        {
          play: [{ card: defender, exerted: true, isDrying: false }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(rcRemotecontrolledCar, defender),
      ).toBeSuccessfulCommand();
    });

    it("release notes ruling: with Reckless gained, RC is NOT forced to challenge when 0 ink available — the controller can still pass the turn", () => {
      // Q&A: Reckless requires the character be declared a challenger if able.
      // RC's Low Batteries makes him unable to challenge unless 1 {I} is paid.
      // With 0 ready ink, RC cannot challenge, so Reckless does not force him,
      // and the turn can be passed normally.
      const recklessRC = {
        ...rcRemotecontrolledCar,
        id: `${rcRemotecontrolledCar.id}-reckless`,
        abilities: [...(rcRemotecontrolledCar.abilities ?? []), reckless],
      };

      const opposingDefender = createMockCharacter({
        id: "rc-release-defender",
        name: "Defender",
        cost: 2,
        strength: 1,
        willpower: 3,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 0,
          play: [{ card: recklessRC, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: opposingDefender, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      // With 0 ink and Reckless, the player must still be able to pass turn.
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    });

    it("consumes 1 ink from the inkwell when questing (paid each time)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 2,
        play: [{ card: rcRemotecontrolledCar, isDrying: false }],
      });

      const inkwellIdsBefore = testEngine.getCardInstanceIdsInZone("inkwell", "player_one");
      const readyBefore = inkwellIdsBefore.filter(
        (id) => !testEngine.isExertedByInstance(id),
      ).length;
      expect(readyBefore).toBe(2);

      expect(testEngine.asPlayerOne().quest(rcRemotecontrolledCar)).toBeSuccessfulCommand();

      const inkwellIdsAfter = testEngine.getCardInstanceIdsInZone("inkwell", "player_one");
      const readyAfter = inkwellIdsAfter.filter((id) => !testEngine.isExertedByInstance(id)).length;
      expect(readyAfter).toBe(1);
    });
  });
});
