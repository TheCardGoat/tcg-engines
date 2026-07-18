import { describe, expect, test } from "vite-plus/test";
import { op01XDrake054 } from "../../../../cards/src/cards/OP01/characters/054-x-drake.ts";
import { op01PunkGibson058 } from "../../../../cards/src/cards/OP01/events/058-punk-gibson.ts";
import { op01RoundTable027 } from "../../../../cards/src/cards/OP01/events/027-round-table.ts";
import { op01RoronoaZoro001 } from "../../../../cards/src/cards/OP01/leaders/001-roronoa-zoro.ts";
import { op04Dellinger029 } from "../../../../cards/src/cards/OP04/characters/029-dellinger.ts";
import { op12KouzukiHiyori028 } from "../../../../cards/src/cards/OP12/characters/028-kouzuki-hiyori.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

describe("OP12-028 Kouzuki Hiyori", () => {
  test("rests 1 DON!! and itself to find a Slash card or a green Event", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01RoronoaZoro001,
        character: [op12KouzukiHiyori028],
        deck: [op01XDrake054, op01PunkGibson058, op04Dellinger029, op01RoundTable027],
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const hiyoriId = engine.findCardInZone("south", "character", op12KouzukiHiyori028);
    const drakeId = engine.findCardInZone("south", "deck", op01XDrake054);
    const punkGibsonId = engine.findCardInZone("south", "deck", op01PunkGibson058);
    const dellingerId = engine.findCardInZone("south", "deck", op04Dellinger029);
    const roundTableId = engine.findCardInZone("south", "deck", op01RoundTable027);

    engine.activateEffect(hiyoriId, "activateMain", "south");
    const optionalPrompt = pendingPrompt(engine, "effectOptional");
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: optionalPrompt!.id,
      optionId: "yes",
    });

    expect(engine.getState().cards[hiyoriId]?.rested).toBe(true);
    expect(engine.getState().players.south.activeDon).toBe(0);
    expect(engine.getState().players.south.restedDon).toBe(1);
    const selectionPrompt = pendingPrompt(engine, "effectSearchSelection");
    expect(selectionPrompt).toBeDefined();
    expect(
      selectionPrompt!.options.filter((option) => option.enabled).map((option) => option.targetId),
    ).toEqual([drakeId, punkGibsonId]);
    expect(
      selectionPrompt!.options.find((option) => option.targetId === dellingerId)?.enabled,
    ).toBe(false);
    expect(
      selectionPrompt!.options.find((option) => option.targetId === roundTableId)?.enabled,
    ).toBe(false);
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: selectionPrompt!.id,
      selectedIds: [punkGibsonId],
    });

    const orderPrompt = pendingPrompt(engine, "effectSearchRemainderOrder");
    expect(orderPrompt).toBeDefined();
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: orderPrompt!.id,
      selectedIds: [roundTableId, dellingerId, drakeId],
    });

    expect(engine.findCardInZone("south", "hand", op01PunkGibson058)).toBe(punkGibsonId);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
