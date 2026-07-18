import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op02DonquixoteRosinante108 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-108 Donquixote Rosinante", () => {
  test("the defending player can rest it to retarget an attack and protect their Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op02DonquixoteRosinante108] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const rosinanteId = engine.findCardInZone("south", "character", op02DonquixoteRosinante108);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    const blocker = engine.pendingDecision("battleBlocker", "south");
    const choice = blocker.steps[0];
    expect(blocker.actorId).toBe("south");
    expect(choice?.kind).toBe("selectEntity");
    if (choice?.kind !== "selectEntity") throw new Error("Expected Rosinante's Blocker choice.");
    expect(choice.candidates.map((candidate) => candidate.ref.id)).toContain(rosinanteId);
    engine.resolveDecision("battleBlocker", { selectedIds: [rosinanteId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(rosinanteId);
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline Blocker, leaving the original Leader attack to resolve", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op02DonquixoteRosinante108] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const rosinanteId = engine.findCardInZone("south", "character", op02DonquixoteRosinante108);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === rosinanteId)).toBe(
      true,
    );
    expect(view.players.south.lifeCount).toBe(lifeBefore - 1);
    expect(view.prompts).toHaveLength(0);
  });
});
