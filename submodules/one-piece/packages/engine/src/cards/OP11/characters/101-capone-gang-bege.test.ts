import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op01Bartolomeo019,
  op01Killer039,
  op02ArabesqueBrickFist067,
  op11CaponeGangBege101,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe('OP11-101 Capone"Gang"Bege', () => {
  test("offers its face-down Life replacement when an opponent effect removes another Supernovas Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11CaponeGangBege101, op01Killer039, op01Bartolomeo019] },
      {
        hand: [op02ArabesqueBrickFist067, op02ArabesqueBrickFist067],
        activeDon: op02ArabesqueBrickFist067.cost * 2,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const protectedId = engine.findCardInZone("south", "character", op01Killer039);
    const secondId = engine.findCardInZone("south", "character", op01Bartolomeo019);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op02ArabesqueBrickFist067, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "north");

    const replacement = engine.pendingDecision("effectRemovalReplacement", "south").steps[0];
    expect(replacement).toMatchObject({ kind: "confirm" });
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore + 1);
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(
      protectedId,
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(protectedId);
    expect(engine.getState().cards[protectedId]?.faceUp).toBe(false);
    expect(engine.getState().players.south.life[0]).toBe(protectedId);

    engine.playCard(op02ArabesqueBrickFist067, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [secondId] }, "north");

    const finalView = engine.getView("south");
    expect(finalView.players.south.hand.map((card) => card.instanceId)).toContain(secondId);
    expect(finalView.players.south.lifeCount).toBe(lifeBefore + 1);
    expect(finalView.prompts).toHaveLength(0);
  });

  test("does not replace removal of Capone Gang Bege itself", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11CaponeGangBege101] },
      {
        hand: [op02ArabesqueBrickFist067],
        activeDon: op02ArabesqueBrickFist067.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const begeId = engine.findCardInZone("south", "character", op11CaponeGangBege101);

    engine.playCard(op02ArabesqueBrickFist067, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [begeId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(begeId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not replace removal caused by its controller's own effect", () => {
    const engine = OnePieceTestEngine.create({
      character: [op11CaponeGangBege101, op01Killer039],
      hand: [op02ArabesqueBrickFist067],
      activeDon: op02ArabesqueBrickFist067.cost,
    });
    const allyId = engine.findCardInZone("south", "character", op01Killer039);

    engine.playCard(op02ArabesqueBrickFist067, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [allyId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(allyId);
    expect(view.prompts).toHaveLength(0);
  });

  test("is a legal Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11CaponeGangBege101] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const begeId = engine.findCardInZone("south", "character", op11CaponeGangBege101);

    engine.declareAttack(
      engine.findCardInZone("north", "character", eb01MountainGod018),
      engine.leader("south"),
      "north",
    );
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Bege's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(begeId);
  });
});
