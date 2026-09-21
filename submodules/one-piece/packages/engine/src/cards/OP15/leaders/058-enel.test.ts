import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op15Enel058 } from "../../../../../cards/src/cards/leaders/op15-058-enel.ts";

import { getLegalCommands, OnePieceTestEngine } from "../../../index.ts";

describe("OP15-058 Enel", () => {
  test("reduces the DON!! deck to 6 cards", () => {
    const engine = OnePieceTestEngine.create({ leaderCardId: op15Enel058 }, {});

    expect(engine.getView("south").players.south.donDeckCount).toBe(6);
  });

  test("cannot activate on the player's first turn", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15Enel058, character: [eb01Doma005], donDeckCount: 6 },
      {},
      { turnNumber: 1 },
    );

    const legal = getLegalCommands(engine.getState(), "south").some(
      (command) => command.type === "activateEffect" && command.sourceId === engine.leader("south"),
    );
    expect(legal).toBe(false);
  });

  test("adds active and rested DON!! from the second turn on and gives rested DON!! to a Character", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15Enel058, character: [eb01Doma005], donDeckCount: 6 },
      {},
    );
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    const activeAdd = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (activeAdd?.kind !== "chooseOption") throw new Error("Expected Enel's active DON!! add.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const restedAdd = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (restedAdd?.kind !== "chooseOption") throw new Error("Expected Enel's rested DON!! add.");
    expect(restedAdd.options.map((option) => option.id)).toEqual(["0", "1", "2", "3", "4"]);
    engine.resolveDecision("effectAddDon", { optionId: "4" }, "south");

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected Enel's DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1", "2", "3", "4"]);
    // The sole eligible Character is selected automatically.
    engine.resolveDecision("effectGiveDonCount", { optionId: "4" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.activeDon).toBe(1);
    expect(south.restedDon).toBe(0);
    expect(south.donDeckCount).toBe(1);
    expect(south.characters.find((card) => card?.instanceId === domaId)?.attachedDon).toBe(4);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
