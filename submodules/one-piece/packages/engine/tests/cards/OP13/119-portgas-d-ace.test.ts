import { describe, expect, test } from "vite-plus/test";
import { op01Nekomamushi048 } from "../../../../cards/src/cards/OP01/characters/048-nekomamushi.ts";
import { op01XDrake054 } from "../../../../cards/src/cards/OP01/characters/054-x-drake.ts";
import { op13PortgasDAce119 } from "../../../../cards/src/cards/OP13/characters/119-portgas-d-ace.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

describe("OP13-119 Portgas.D.Ace", () => {
  test("lets the opponent choose the Character they play after one is returned", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13PortgasDAce119],
        activeDon: op13PortgasDAce119.cost,
      },
      {
        hand: [op01Nekomamushi048],
        character: [op01XDrake054],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const drakeId = engine.findCardInZone("north", "character", op01XDrake054);
    const nekomamushiId = engine.findCardInZone("north", "hand", op01Nekomamushi048);

    engine.playCard(op13PortgasDAce119);
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: pendingPrompt(engine, "effectGiveDonCount")!.id,
      optionId: "0",
    });
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: pendingPrompt(engine, "effectTargetSelection")!.id,
      selectedIds: [drakeId],
    });

    const playPrompt = pendingPrompt(engine, "effectPlaySelection");
    expect(playPrompt?.seat).toBe("north");
    expect(playPrompt?.options.map((option) => option.targetId)).toContain(nekomamushiId);
    engine.exec({
      type: "resolvePrompt",
      seat: "north",
      promptId: playPrompt!.id,
      selectedIds: [nekomamushiId],
    });

    expect(engine.findCardInZone("north", "hand", op01XDrake054)).toBe(drakeId);
    expect(engine.findCardInZone("north", "character", op01Nekomamushi048)).toBe(nekomamushiId);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });

  test("does not make the opponent play a card when no Character was returned", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13PortgasDAce119],
        activeDon: op13PortgasDAce119.cost,
      },
      {
        hand: [op01Nekomamushi048],
        character: [op01XDrake054],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op13PortgasDAce119);
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: pendingPrompt(engine, "effectGiveDonCount")!.id,
      optionId: "0",
    });
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: pendingPrompt(engine, "effectTargetSelection")!.id,
      selectedIds: [],
    });

    expect(pendingPrompt(engine, "effectPlaySelection")).toBeUndefined();
    expect(engine.findCardInZone("north", "hand", op01Nekomamushi048)).toBeDefined();
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
