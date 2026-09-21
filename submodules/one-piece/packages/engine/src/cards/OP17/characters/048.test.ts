import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-048 Shiki", () => {
  test("attacks a rested opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-048", attachedDon: 1 }], activeDon: 5 },
      { character: [{ cardId: "OP13-013", rested: true }], activeDon: 5 },
    );

    engine.asSouth().attack("OP17-048", "OP13-013");
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.cardId === "OP17-048")
        ?.rested,
    ).toBe(true);
  });

  test("[On Opponent's Attack] trigger resolves without error", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP17-048"], hand: ["OP17-049"], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    // The event trigger fires; resolve the optional decline.
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-048",
    );
  });
});
