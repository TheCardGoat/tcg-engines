import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Shanks120,
  op10EdwardNewgate024,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-024 Edward.Newgate", () => {
  test("with two rested Characters, rests a cost-5 target then K.O.s a rested cost-3 target", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op10EdwardNewgate024],
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01Doma005, rested: true },
        ],
        activeDon: op10EdwardNewgate024.cost,
      },
      { character: [eb01Fourtricks025, eb01MountainGod018, op01Shanks120] },
    );
    const koId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const costFiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const tooExpensiveId = engine.findCardInZone("north", "character", op01Shanks120);

    engine.playCard(op10EdwardNewgate024, "south");
    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(rest).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (rest?.kind !== "selectEntity") throw new Error("Expected Newgate's rest choice.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toEqual([koId, costFiveId]);
    expect(rest.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [koId] }, "south");

    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ko).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (ko?.kind !== "selectEntity") throw new Error("Expected Newgate's K.O. choice.");
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toEqual([koId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [koId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(koId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(costFiveId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does nothing with only one rested Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op10EdwardNewgate024],
        character: [{ card: eb01Doma005, rested: true }],
        activeDon: op10EdwardNewgate024.cost,
      },
      { character: [eb01Fourtricks025] },
    );
    const opposingId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op10EdwardNewgate024, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
