import { eb01Doma005, eb01MiniMerry011, op02Vista011 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04CrocodileOp14079079 } from "../../../../../cards/src/cards/OP14EB04/leaders/079-crocodile-op14-079.ts";
import { op14eb04MissMerrychristmasDrophy088 } from "../../../../../cards/src/cards/OP14EB04/characters/088-miss-merrychristmas-drophy.ts";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-088 Miss.MerryChristmas(Drophy)", () => {
  test("on K.O. with an included Baroque Works Leader draws then may K.O. an opposing cost-1 Stage", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op14eb04CrocodileOp14079079,
        character: [op14eb04MissMerrychristmasDrophy088],
        deck: [eb01Doma005],
      },
      { hand: [op02Vista011], stage: eb01MiniMerry011, activeDon: op02Vista011.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sourceId = engine.findCardInZone(
      "south",
      "character",
      op14eb04MissMerrychristmasDrophy088,
    );
    const stageId = engine.findCardInZone("north", "stage", eb01MiniMerry011);
    const drawId = engine.findCardInZone("south", "deck", eb01Doma005);
    engine.playCard(op02Vista011, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [sourceId] }, "north");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Stage K.O. choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(stageId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [stageId] }, "south");
    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(stageId);
    expect(view.prompts).toHaveLength(0);
  });

  test("with a non-Baroque Works Leader neither draws nor offers the Stage K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04MissMerrychristmasDrophy088], deck: [eb01Doma005] },
      { hand: [op02Vista011], stage: eb01MiniMerry011, activeDon: op02Vista011.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sourceId = engine.findCardInZone(
      "south",
      "character",
      op14eb04MissMerrychristmasDrophy088,
    );
    const stageId = engine.findCardInZone("north", "stage", eb01MiniMerry011);

    engine.playCard(op02Vista011, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [sourceId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ hand: [], deckCount: 1 });
    expect(view.players.north.stage?.instanceId).toBe(stageId);
    expect(view.prompts).toHaveLength(0);
  });
});
