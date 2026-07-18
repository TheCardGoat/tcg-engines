import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01Sanji014,
  op08Jinbe085,
  op08Kaido079,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-085 Jinbe", () => {
  test("with DON!! and a cost-8-or-more Character K.O.s only an opposing cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op08Jinbe085, playedOnTurn: 0 },
          { card: op08Kaido079, playedOnTurn: 0 },
        ],
        activeDon: 1,
      },
      { character: [eb01Sanji014, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const jinbeId = engine.findCardInZone("south", "character", op08Jinbe085);
    const eligibleId = engine.findCardInZone("north", "character", eb01Sanji014);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.attachDon(jinbeId, 1, "south");
    engine.declareAttack(jinbeId, engine.leader("north"), "south");

    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ko).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (ko?.kind !== "selectEntity") throw new Error("Expected Jinbe's K.O. target.");
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(ko.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.some((card) => card?.instanceId === expensiveId)).toBe(
      true,
    );
  });

  test.each([
    { label: "without attached DON!!", attachedDon: 0, support: op08Kaido079 },
    { label: "without a cost-8-or-more Character", attachedDon: 1, support: eb01Doma005 },
  ])("does not offer a K.O. target $label", ({ attachedDon, support }) => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op08Jinbe085, attachedDon, playedOnTurn: 0 },
          { card: support, playedOnTurn: 0 },
        ],
      },
      { character: [eb01Sanji014] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const jinbeId = engine.findCardInZone("south", "character", op08Jinbe085);
    const targetId = engine.findCardInZone("north", "character", eb01Sanji014);

    engine.declareAttack(jinbeId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
