import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op09MarshallDTeach081 } from "@tcg/op-cards";
import { op09DocQ090 } from "../../../../../cards/src/cards/OP09/characters/090-doc-q.ts";
import { op09Laffitte095 } from "../../../../../cards/src/cards/OP09/characters/095-laffitte.ts";
import { op09VascoShot091 } from "../../../../../cards/src/cards/OP09/characters/091-vasco-shot.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-090 Doc Q", () => {
  test("rests itself and K.O.s only a cost-1-or-less Character with an included Blackbeard Pirates Leader trait", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09MarshallDTeach081,
        character: [op09DocQ090],
      },
      { character: [op09Laffitte095, op09VascoShot091] },
    );
    const docQId = engine.findCardInZone("south", "character", op09DocQ090);
    const eligibleId = engine.findCardInZone("north", "character", op09Laffitte095);
    const expensiveId = engine.findCardInZone("north", "character", op09VascoShot091);

    engine.activateEffect(docQId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Doc Q's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === docQId)?.rested).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
  });

  test("draws when it is K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op09DocQ090, rested: true }], deck: [eb01Doma005] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const docQId = engine.findCardInZone("south", "character", op09DocQ090);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const handBefore = engine.getView("south").players.south.hand.length;

    engine.declareAttack(attackerId, docQId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(docQId);
    expect(view.players.south.hand).toHaveLength(handBefore + 1);
  });
});
