import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { wildcatMechanic } from "./092-wildcat-mechanic";

const targetItem = createMockItem({
  id: "wildcat-target-item",
  name: "Target Item",
  cost: 2,
});

const opponentItem = createMockItem({
  id: "wildcat-opponent-item",
  name: "Opponent Item",
  cost: 2,
});

describe("Wildcat - Mechanic", () => {
  it("has Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [wildcatMechanic],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().hasKeyword(wildcatMechanic, "Evasive")).toBe(true);
  });

  describe("DISASSEMBLE - {E} — Banish chosen item.", () => {
    it("banishes a chosen item by exerting Wildcat", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [wildcatMechanic],
          deck: 1,
        },
        {
          play: [opponentItem],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(wildcatMechanic, {
          targets: [opponentItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(wildcatMechanic)).toBe(true);
      expect(testEngine.asPlayerTwo().getCardZone(opponentItem)).toBe("discard");
    });

    it("can banish own item", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [wildcatMechanic, targetItem],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(wildcatMechanic, {
          targets: [targetItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(wildcatMechanic)).toBe(true);
      expect(testEngine.asPlayerOne().getCardZone(targetItem)).toBe("discard");
    });

    it("fails when Wildcat is already exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: wildcatMechanic, exerted: true }],
          deck: 1,
        },
        {
          play: [opponentItem],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(wildcatMechanic, {
          targets: [opponentItem],
        }),
      ).not.toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentItem)).toBe("play");
    });

    it("fails when no items are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [wildcatMechanic],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(wildcatMechanic, {}),
      ).not.toBeSuccessfulCommand();
    });
  });
});
