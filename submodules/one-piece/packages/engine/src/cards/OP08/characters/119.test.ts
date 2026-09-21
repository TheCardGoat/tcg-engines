import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP08-119", () => {
  test("[When Attacking] DON!! 10 K.O.s every other Character and moves Life cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ cardId: "OP08-119", attachedDon: 10 }],
        life: ["OP12-013"],
        deck: ["OP12-017", "OP13-013"],
        activeDon: 10,
      },
      {
        character: ["OP16-003", "OP13-013"],
        life: ["OP12-018", "OP12-019"],
        activeDon: 5,
      },
    );
    const selfId = engine.findCardInZone("south", "character", "OP08-119");
    const newgateId = engine.findCardInZone("north", "character", "OP16-003");
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.asSouth().attack("OP08-119", engine.asNorth().leader());
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // DON!! 10 cost: return the 10 attached DON!! cards.
    const pay = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    if (pay?.kind !== "payCost") throw new Error("Expected the DON!! payment.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: pay.candidates.map((c) => c.ref.id).slice(0, 10) },
      "south",
    );
    // Add the deck top to Life.
    const life = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
    if (life?.kind === "chooseOption") {
      engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    }
    // Trash up to 1 card from the opponent's Life.
    const remove = engine.pendingDecision("effectRemoveFromLifeCount", "south").steps[0];
    if (remove?.kind === "chooseOption") {
      engine.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");
    }

    const northCharacters = engine
      .getView("south")
      .players.north.characters.filter((c) => c !== null)
      .map((c) => c.instanceId);
    expect(northCharacters).not.toContain(newgateId);
    expect(northCharacters).not.toContain(higumaId);
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      selfId,
    );
    expect(engine.getView("south").players.south.lifeCount).toBe(2);
    // 1 damage from the Leader battle + 1 Life trashed by the effect.
    expect(engine.getView("south").players.north.lifeCount).toBe(0);
  });
  test("[When Attacking] may be declined", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP08-119", attachedDon: 2 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const donBefore =
      engine.getView("south").players.south.activeDon +
      engine.getView("south").players.south.restedDon;

    engine.asSouth().attack("OP08-119", engine.asNorth().leader());
    const gate = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    const gateIntent = gate?.extensions?.resolutionIntent;
    if (gateIntent === "effectOptional") {
      engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    } else if (gateIntent) {
      const gateStep = engine.pendingDecision(gateIntent as never, "south").steps[0];
      if (gateStep?.kind === "selectEntity" || gateStep?.kind === "orderItems") {
        engine.resolveDecision(gateIntent as never, { selectedIds: [] }, "south");
      } else if (gateStep?.kind === "chooseOption") {
        engine.resolveDecision(gateIntent as never, { optionId: "0" }, "south");
      }
    }

    expect(
      engine.getView("south").players.south.activeDon +
        engine.getView("south").players.south.restedDon,
    ).toBe(donBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
