import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02ArabesqueBrickFist067,
  op11Koby001,
  op12Borsalino053,
  op12JaguarDSaul050,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-053 Borsalino", () => {
  test("once per turn trashes a hand card instead of an opponent effect removing itself", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op12Borsalino053],
        hand: [eb01Doma005, eb01Fourtricks025],
      },
      {
        hand: [op02ArabesqueBrickFist067, op02ArabesqueBrickFist067],
        activeDon: op02ArabesqueBrickFist067.cost * 2,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const borsalinoId = engine.findCardInZone("south", "character", op12Borsalino053);
    const paidId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op02ArabesqueBrickFist067, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [borsalinoId] }, "north");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [paidId] }, "south");
    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(borsalinoId);

    engine.playCard(op02ArabesqueBrickFist067, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [borsalinoId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(borsalinoId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paidId);
    expect(view.prompts).toHaveLength(0);
  });

  test("with a Navy Leader on the opponent's turn gains 1000 power and Blocker", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op11Koby001,
        character: [op12Borsalino053],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const borsalinoId = engine.findCardInZone("south", "character", op12Borsalino053);

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === borsalinoId)?.power,
    ).toBe((op12Borsalino053.power ?? 0) + 1000);
    engine.declareAttack(
      engine.findCardInZone("north", "character", eb01MountainGod018),
      engine.leader("south"),
      "north",
    );
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Borsalino's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(borsalinoId);
  });

  test("without a Navy Leader does not gain power or Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op12Borsalino053, op12JaguarDSaul050] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const borsalinoId = engine.findCardInZone("south", "character", op12Borsalino053);
    const saulId = engine.findCardInZone("south", "character", op12JaguarDSaul050);

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === borsalinoId)?.power,
    ).toBe(op12Borsalino053.power);
    engine.declareAttack(
      engine.findCardInZone("north", "character", eb01MountainGod018),
      engine.leader("south"),
      "north",
    );
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Saul's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(saulId);
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).not.toContain(borsalinoId);
  });
});
