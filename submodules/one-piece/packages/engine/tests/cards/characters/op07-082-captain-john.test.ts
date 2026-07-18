import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op07CaptainJohn082,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-082 Captain John", () => {
  test("trashes the top two deck cards, then reduces an opposing Character's cost for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07CaptainJohn082],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: op07CaptainJohn082.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const firstTrashedId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondTrashedId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op07CaptainJohn082, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Captain John's cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstTrashedId, secondTrashedId]),
    );
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      4,
    );

    engine.endTurn("south");
    view = engine.getView("north");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      5,
    );
  });
});
