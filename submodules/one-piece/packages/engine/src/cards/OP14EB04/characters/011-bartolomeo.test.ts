import { eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op01RoronoaZoro001 } from "../../../../../cards/src/cards/OP01/leaders/001-roronoa-zoro.ts";
import { op14eb04Bartolomeo011 } from "../../../../../cards/src/cards/OP14EB04/characters/011-bartolomeo.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-011 Bartolomeo", () => {
  test("with two attached DON!! gains Blocker and redirects an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01RoronoaZoro001,
        character: [op14eb04Bartolomeo011],
        activeDon: 2,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const bartolomeoId = engine.findCardInZone("south", "character", op14eb04Bartolomeo011);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.attachDon(bartolomeoId, 2, "south");
    engine.endTurn("south");
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Bartolomeo's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(bartolomeoId);
    engine.resolveDecision("battleBlocker", { selectedIds: [bartolomeoId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(bartolomeoId);
    expect(view.prompts).toHaveLength(0);
  });

  test("with only one attached DON!! does not gain Blocker", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01RoronoaZoro001,
        character: [op14eb04Bartolomeo011],
        activeDon: 1,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const bartolomeoId = engine.findCardInZone("south", "character", op14eb04Bartolomeo011);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.attachDon(bartolomeoId, 1, "south");
    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");

    expect(() => engine.pendingDecision("battleBlocker", "south")).toThrow();
    expect(
      engine.getView("south").players.south.trash.map((card) => card.instanceId),
    ).not.toContain(bartolomeoId);
  });
});
