import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op02ArabesqueBrickFist067,
  op12DonquixoteRosinante048,
  op12Fullbody052,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-048 Donquixote Rosinante", () => {
  test.each([0, 1, "no"] as const)(
    "selects replacement source %s among two Rosinantes",
    (choice) => {
      const engine = OnePieceTestEngine.create(
        {
          character: [op12DonquixoteRosinante048, op12DonquixoteRosinante048, op12Fullbody052],
          hand: [eb01Doma005, eb01Fourtricks025],
        },
        { hand: [op02ArabesqueBrickFist067], activeDon: op02ArabesqueBrickFist067.cost },
        { firstPlayer: "south", activeSeat: "north" },
      );
      const sources = engine
        .getView("south")
        .players.south.characters.filter((card) => card?.cardId === op12DonquixoteRosinante048.id)
        .map((card) => card!.instanceId);
      const target = engine.findCardInZone("south", "character", op12Fullbody052);
      const payment = engine.findCardInZone("south", "hand", eb01Doma005);
      engine.playCard(op02ArabesqueBrickFist067, "north");
      engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "north");
      const decision = engine.pendingDecision("effectRemovalReplacement", "south").steps[0];
      if (decision?.kind !== "chooseOption") throw new Error("Expected replacement choices.");
      expect(decision.options.map((option) => option.id)).toEqual(
        expect.arrayContaining(sources.map((id) => `replacement:${id}:0`)),
      );
      engine.resolveDecision(
        "effectRemovalReplacement",
        { optionId: choice === "no" ? "no" : `replacement:${sources[choice]}:0` },
        "south",
      );
      if (choice !== "no")
        engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [payment] }, "south");
      const view = engine.getView("south");
      expect(view.players.south.characters.some((card) => card?.instanceId === target)).toBe(
        choice !== "no",
      );
      for (const [index, source] of sources.entries())
        expect(
          view.players.south.characters.find((card) => card?.instanceId === source)?.rested,
        ).toBe(choice === index);
      expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
        choice === "no" ? [] : [payment],
      );
      expect(view.prompts).toHaveLength(0);
    },
  );

  test("on the opponent's turn rests itself and trashes a card instead of an opponent effect removing a blue Navy Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op12DonquixoteRosinante048, op12Fullbody052],
        hand: [eb01Doma005, eb01Fourtricks025],
      },
      {
        hand: [op02ArabesqueBrickFist067],
        activeDon: op02ArabesqueBrickFist067.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const rosinanteId = engine.findCardInZone("south", "character", op12DonquixoteRosinante048);
    const protectedId = engine.findCardInZone("south", "character", op12Fullbody052);
    const paidId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op02ArabesqueBrickFist067, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "north");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [paidId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(protectedId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === rosinanteId)?.rested,
    ).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paidId);
    expect(view.prompts).toHaveLength(0);
  });
  test.each(["rested", "empty hand"] as const)(
    "cannot replace its own removal with %s",
    (boundary) => {
      const engine = OnePieceTestEngine.create(
        {
          character: [{ card: op12DonquixoteRosinante048, rested: boundary === "rested" }],
          hand: boundary === "rested" ? [eb01Doma005] : [],
        },
        { hand: [op02ArabesqueBrickFist067], activeDon: op02ArabesqueBrickFist067.cost },
        { activeSeat: "north" },
      );
      const source = engine.findCardInZone("south", "character", op12DonquixoteRosinante048);
      engine.asNorth().play(op02ArabesqueBrickFist067);
      engine.asNorth().chooseTargets(source);
      expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(source);
      expect(engine.getView("south").players.south.trash).toHaveLength(0);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );

  test("may rest itself and trash a hand card to replace its own removal", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op12DonquixoteRosinante048], hand: [eb01Doma005] },
      { hand: [op02ArabesqueBrickFist067], activeDon: op02ArabesqueBrickFist067.cost },
      { activeSeat: "north" },
    );
    const source = engine.findCardInZone("south", "character", op12DonquixoteRosinante048);
    const payment = engine.findCardInZone("south", "hand", eb01Doma005);
    engine.asNorth().play(op02ArabesqueBrickFist067);
    engine.asNorth().chooseTargets(source);
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === source)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toEqual([payment]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
