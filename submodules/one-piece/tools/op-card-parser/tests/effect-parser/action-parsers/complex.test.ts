import { expect, test, describe } from "vite-plus/test";
import { parseActions } from "../../../src/effect-parser/index.ts";

describe("parseActions — activateEffect", () => {
  test("selects a Character and changes the attack target to it", () => {
    const result = parseActions(
      "Select 1 of your Characters. Change the attack target to the selected Character.",
    );

    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "changeBattleTarget",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1 },
        },
      },
    ]);
  });

  test("activate this card's [Main] effect", () => {
    const result = parseActions("Activate this card's [Main] effect.");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "activateEffect",
      effectTrigger: "main",
    });
  });

  test("activate this card's [On Play] effect", () => {
    const result = parseActions("Activate this card's [On Play] effect.");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "activateEffect",
      effectTrigger: "onPlay",
    });
  });

  test("activate this card's [Counter] effect", () => {
    const result = parseActions("Activate this card's [Counter] effect.");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "activateEffect",
      effectTrigger: "counter",
    });
  });
});

describe("parseActions — totalConstraint targets", () => {
  test("K.O. with total power constraint", () => {
    const result = parseActions(
      "K.O. up to 2 of your opponent's Characters with a total power of 4000 or less.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "ko",
      target: {
        player: "opponent",
        zones: ["character"],
        count: { amount: 2, upTo: true },
        totalConstraint: {
          property: "power",
          comparison: "lte",
          value: 4000,
        },
      },
    });
  });

  test("K.O. with total cost constraint", () => {
    const result = parseActions(
      "K.O. up to 3 of your opponent's Characters with a total cost of 6 or less.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "ko",
      target: {
        totalConstraint: {
          property: "cost",
          comparison: "lte",
          value: 6,
        },
      },
    });
  });

  test("rest with total power constraint", () => {
    const result = parseActions(
      "Rest up to 2 of your opponent's Characters with a total power of 6000 or less.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "rest",
      target: {
        totalConstraint: {
          property: "power",
          comparison: "lte",
          value: 6000,
        },
      },
    });
  });
});
