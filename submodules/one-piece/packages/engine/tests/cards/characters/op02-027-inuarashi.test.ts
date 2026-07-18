import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01XDrake054, op02Inuarashi027 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-027 Inuarashi", () => {
  test("with no active DON!!, cannot be K.O.'d by an opponent's effect", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01XDrake054],
        activeDon: op01XDrake054.cost,
      },
      {
        character: [
          { card: op02Inuarashi027, rested: true, playedOnTurn: 0 },
          { card: eb01Doma005, rested: true, playedOnTurn: 0 },
        ],
        restedDon: 1,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const inuarashiId = engine.findCardInZone("north", "character", op02Inuarashi027);
    const legalId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op01XDrake054, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected X.Drake's K.O. choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([legalId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(inuarashiId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [legalId] }, "south");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === inuarashiId)).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(inuarashiId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(legalId);
    expect(view.prompts).toHaveLength(0);
  });

  test("with an active DON!!, an opponent's effect can K.O. it", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01XDrake054],
        activeDon: op01XDrake054.cost,
      },
      {
        character: [{ card: op02Inuarashi027, rested: true, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const inuarashiId = engine.findCardInZone("north", "character", op02Inuarashi027);

    engine.playCard(op01XDrake054, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [inuarashiId] }, "south");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(inuarashiId);
    expect(view.prompts).toHaveLength(0);
  });

  test("with attached DON!!, an opponent's effect can K.O. it", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01XDrake054],
        activeDon: op01XDrake054.cost,
      },
      {
        character: [{ card: op02Inuarashi027, attachedDon: 1, rested: true, playedOnTurn: 0 }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const inuarashiId = engine.findCardInZone("north", "character", op02Inuarashi027);

    engine.playCard(op01XDrake054, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [inuarashiId] }, "south");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(inuarashiId);
    expect(view.players.north.restedDon).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
