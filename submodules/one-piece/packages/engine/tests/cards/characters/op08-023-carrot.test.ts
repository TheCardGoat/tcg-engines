import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op07MonkeyDDragon015,
  op08Carrot023,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function proveCarrotFreeze(trigger: "onPlay" | "whenAttacking") {
  const engine = OnePieceTestEngine.create(
    trigger === "onPlay"
      ? { hand: [op08Carrot023], activeDon: op08Carrot023.cost }
      : { character: [{ card: op08Carrot023, playedOnTurn: 0 }] },
    {
      character: [
        { card: eb01MountainGod018, rested: true },
        { card: op07MonkeyDDragon015, rested: true },
        eb01Doma005,
      ],
    },
    { firstPlayer: "north", activeSeat: "south" },
  );
  const eligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
  const expensiveId = engine.findCardInZone("north", "character", op07MonkeyDDragon015);
  const activeId = engine.findCardInZone("north", "character", eb01Doma005);

  if (trigger === "onPlay") {
    engine.playCard(op08Carrot023, "south");
  } else {
    const carrotId = engine.findCardInZone("south", "character", op08Carrot023);
    engine.declareAttack(carrotId, engine.leader("north"), "south");
  }

  const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
  expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
  if (target?.kind !== "selectEntity") throw new Error("Expected Carrot's freeze choice.");
  expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
  expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
  expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeId);
  engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

  engine.endTurn("south");
  let view = engine.getView("north");
  expect(
    view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
  ).toBe(true);
  expect(
    view.players.north.characters.find((card) => card?.instanceId === expensiveId)?.rested,
  ).toBe(false);

  engine.endTurn("north");
  engine.endTurn("south");
  view = engine.getView("north");
  expect(
    view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
  ).toBe(false);
}

describe("OP08-023 Carrot", () => {
  test("on play freezes only a rested cost-7-or-less Character for the next Refresh Phase", () => {
    proveCarrotFreeze("onPlay");
  });

  test("when attacking freezes only a rested cost-7-or-less Character for the next Refresh Phase", () => {
    proveCarrotFreeze("whenAttacking");
  });
});
