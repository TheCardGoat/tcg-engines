import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op02Sakazuki099,
  op09JesusBurgess086,
  op09MarshallDTeach081,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

function burgessPower(trashCount: number, blackbeardLeader = true): number | null | undefined {
  const engine = OnePieceTestEngine.create({
    leaderCardId: blackbeardLeader ? op09MarshallDTeach081 : undefined,
    character: [op09JesusBurgess086],
    trash: Array.from({ length: trashCount }, () => eb01Doma005),
  });
  const burgessId = engine.findCardInZone("south", "character", op09JesusBurgess086);
  return engine
    .getView("south")
    .players.south.characters.find((card) => card?.instanceId === burgessId)?.power;
}

describe("OP09-086 Jesus Burgess", () => {
  test("gains 1000 power for each complete group of four trash cards with a Blackbeard Pirates Leader", () => {
    expect(burgessPower(3)).toBe(5000);
    expect(burgessPower(4)).toBe(6000);
    expect(burgessPower(8)).toBe(7000);
    expect(burgessPower(8, false)).toBe(5000);
  });

  test("cannot be K.O.'d by an opponent's effect", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op09JesusBurgess086, eb01Doma005] },
      {
        hand: [op02Sakazuki099, eb01Doma005],
        activeDon: op02Sakazuki099.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const burgessId = engine.findCardInZone("south", "character", op09JesusBurgess086);
    const vulnerableId = engine.findCardInZone("south", "character", eb01Doma005);
    const discardId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.playCard(op02Sakazuki099, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    const selection = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(selection?.kind).toBe("selectEntity");
    if (selection?.kind !== "selectEntity") throw new Error("Expected a K.O. target choice.");
    expect(selection.candidates.map((candidate) => candidate.ref.id)).toContain(vulnerableId);
    expect(selection.candidates.map((candidate) => candidate.ref.id)).not.toContain(burgessId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [vulnerableId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === burgessId)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(burgessId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(vulnerableId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.prompts).toHaveLength(0);
  });

  test("can still be K.O.'d in battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op09JesusBurgess086, rested: true, playedOnTurn: 0 }] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const burgessId = engine.findCardInZone("south", "character", op09JesusBurgess086);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, burgessId, "north");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      burgessId,
    );
  });
});
