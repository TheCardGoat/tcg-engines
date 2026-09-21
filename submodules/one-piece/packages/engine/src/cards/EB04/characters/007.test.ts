import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-007", () => {
  test("[On Play] resolves its play effects", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-007"], activeDon: 9 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    engine.playCard("EB04-007");
    engine.acceptLeadingOptional("south");

    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "EB04-007",
    );
  });

  test("[Activate: Main] grants [Rush] when the opponent has a Character with 8000 power or more, once per turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB04-007", rested: false }], activeDon: 11 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const cardId = engine.findCardInZone("south", "character", "EB04-007");

    engine.activateEffect(cardId, "activateMain", "south");
    expect(engine.getView("south").prompts).toHaveLength(0);

    // [Once Per Turn]: a second activation on the same turn is rejected.
    expect(() => engine.activateEffect(cardId, "activateMain", "south")).toThrow();
  });
});
