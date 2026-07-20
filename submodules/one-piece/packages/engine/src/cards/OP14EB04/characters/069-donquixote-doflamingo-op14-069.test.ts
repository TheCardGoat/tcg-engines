import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01RoronoaZoro001,
  op01Shanks120,
  op04DonquixoteDoflamingo019,
  op14eb04EdwardNewgate044,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04DonquixoteDoflamingoOp14069069 } from "../../../../../cards/src/cards/OP14EB04/characters/069-donquixote-doflamingo-op14-069.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function payDoflamingoCost(engine: OnePieceTestEngine) {
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
  const cost = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
  if (cost?.kind !== "payCost") throw new Error("Expected Doflamingo's three-DON cost.");
  engine.resolveDecision(
    "effectCostReturnDon",
    { selectedIds: cost.candidates.slice(0, 3).map((candidate) => candidate.ref.id) },
    "south",
  );
}

describe("OP14-069 Donquixote Doflamingo", () => {
  test("with an included Donquixote Pirates Leader may pay DON minus 3 and choose the cost-8-or-less K.O. branch", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04DonquixoteDoflamingo019,
        hand: [op14eb04DonquixoteDoflamingoOp14069069],
        activeDon: op14eb04DonquixoteDoflamingoOp14069069.cost + 3,
      },
      { character: [op14eb04EdwardNewgate044, op01Shanks120] },
    );
    const eligibleId = engine.findCardInZone("north", "character", op14eb04EdwardNewgate044);
    const expensiveId = engine.findCardInZone("north", "character", op01Shanks120);

    engine.playCard(op14eb04DonquixoteDoflamingoOp14069069, "south");
    payDoflamingoCost(engine);
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Doflamingo's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(expensiveId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 10 });
    expect(view.prompts).toHaveLength(0);
  });

  test("the K.O. branch does nothing with a non-Donquixote Pirates Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01RoronoaZoro001,
        hand: [op14eb04DonquixoteDoflamingoOp14069069],
        activeDon: op14eb04DonquixoteDoflamingoOp14069069.cost + 3,
      },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op14eb04DonquixoteDoflamingoOp14069069, "south");
    payDoflamingoCost(engine);
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose up to three cost-7-or-less opposing Characters that cannot rest through the opponent's next End Phase", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04DonquixoteDoflamingoOp14069069],
        activeDon: op14eb04DonquixoteDoflamingoOp14069069.cost + 3,
      },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op14eb04EdwardNewgate044, playedOnTurn: 0 },
        ],
      },
    );
    const protectedIds = [
      engine.findCardInZone("north", "character", eb01Doma005),
      engine.findCardInZone("north", "character", eb01Fourtricks025),
      engine.findCardInZone("north", "character", eb01MountainGod018),
    ];
    const expensiveId = engine.findCardInZone("north", "character", op14eb04EdwardNewgate044);

    engine.playCard(op14eb04DonquixoteDoflamingoOp14069069, "south");
    payDoflamingoCost(engine);
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Doflamingo's rest protection.");
    expect(target).toMatchObject({ min: 0, max: 3 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining(protectedIds),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: protectedIds }, "south");

    engine.endTurn("south");
    for (const attackerId of protectedIds) {
      expect(
        engine.expectFailure({
          type: "declareAttack",
          seat: "north",
          attackerId,
          targetId: engine.leader("south"),
        }).accepted,
      ).toBe(false);
    }

    engine.endTurn("north");
    engine.endTurn("south");
    engine.declareAttack(protectedIds[0]!, engine.leader("south"), "north");

    const view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === protectedIds[0])?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the three-DON cost and both branches", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04DonquixoteDoflamingoOp14069069],
        activeDon: op14eb04DonquixoteDoflamingoOp14069069.cost + 3,
      },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op14eb04DonquixoteDoflamingoOp14069069, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(3);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
