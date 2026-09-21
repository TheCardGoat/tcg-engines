import { describe, expect, test } from "vite-plus/test";
import { op17Rockstar034 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-034 Rockstar", () => {
  test("against a 6000+ Leader it sets a DON!! active and boosts its Red-Haired Leader to 6000", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-020",
        character: [{ card: op17Rockstar034 }],
        restedDon: 1,
        activeDon: 3,
      },
      { leaderCardId: "OP13-002" },
    );
    const south = () => engine.getView("south").players.south;
    expect(south().leader?.power).toBe(5000);

    engine.activateEffect(
      engine.findCardInZone("south", "character", op17Rockstar034),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    expect(south().activeDon).toBe(4);
    expect(south().restedDon).toBe(0);
    expect(south().leader?.power).toBe(6000);

    // The boost spans the opponent's next turn...
    engine.endTurn("south");
    expect(south().leader?.power).toBe(6000);
    // ...and expires when that turn's End Phase completes.
    engine.endTurn("north");
    expect(south().leader?.power).toBe(5000);
  });

  test("never opens against a Leader under 6000 power", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-020",
        character: [{ card: op17Rockstar034 }],
        restedDon: 1,
        activeDon: 3,
      },
      { leaderCardId: "OP13-001" },
    );

    expect(() =>
      engine.activateEffect(
        engine.findCardInZone("south", "character", op17Rockstar034),
        "activateMain",
        "south",
      ),
    ).toThrow();
    expect(engine.getView("south").players.south.activeDon).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
