import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

// OP06 Moria FAQ: the owner chooses the activation order of revived On Play effects.
describe("Moria's simultaneous On Play effects", () => {
  test.each(["Perona", "Absalom"])("the owner can activate %s first", (first) => {
    let engine = OnePieceTestEngine.create(
      {
        life: ["OP16-105"],
        trash: ["OP06-081", "OP06-093", "EB01-005", "EB01-025"],
      },
      { hand: 5, character: ["EB01-018"] },
      { activeSeat: "north" },
    );
    const target = engine.findCardInZone("north", "character", "EB01-018");
    engine.asNorth().attack(target, engine.leader("south"));
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    engine.resolveDecision(
      "effectGroupedPlaySelection",
      {
        selectedIds: ["OP06-081", "OP06-093"].map((cardId) =>
          engine.findCardInZone("south", "trash", cardId),
        ),
      },
      "south",
    );
    expect(engine.getView("south").players.south.characters.map((card) => card?.cardId)).toEqual(
      expect.arrayContaining(["OP06-081", "OP06-093"]),
    );
    // The owner's pending choice survives a JSON match snapshot.
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    const order = engine.pendingDecision("readyEffectOrder", "south").steps[0];
    if (order?.kind !== "chooseOption") throw new Error("Expected On Play activation choice.");
    expect(order.options).toHaveLength(2);
    const selected = order.options.find((option) => option.label.includes(first));
    if (!selected) throw new Error(`Missing ${first} choice.`);
    engine.resolveDecision("readyEffectOrder", { optionId: selected.id }, "south");

    const reduceCost = () => {
      engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
      engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
      expect(
        engine.getView("south").players.north.characters.find((card) => card?.instanceId === target)
          ?.cost,
      ).toBe(2);
    };
    const payAbsalom = () => {
      engine.asSouth().acceptOptional();
      engine.resolveDecision(
        "effectCostReturnTrashToDeck",
        {
          selectedIds: ["EB01-005", "EB01-025"].map((id) =>
            engine.findCardInZone("south", "trash", id),
          ),
        },
        "south",
      );
    };
    if (first === "Perona") {
      reduceCost();
      payAbsalom();
      engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
      expect(engine.getView("south").players.north.trash.map((card) => card.cardId)).toContain(
        "EB01-018",
      );
    } else {
      payAbsalom();
      reduceCost();
      expect(engine.getView("south").players.north.trash).toHaveLength(0);
    }
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
