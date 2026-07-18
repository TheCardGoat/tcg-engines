import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op08SShark111, op09NicoRobin062 } from "@tcg/op-cards";
import { op09ProfessorClover102 } from "../../../../../cards/src/cards/OP09/characters/102-professor-clover.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function resolveSearch(engine: OnePieceTestEngine, seat: "south" | "north", chosenId: string) {
  const search = engine.pendingDecision("effectSearchSelection", seat).steps[0];
  if (search?.kind !== "selectEntity") throw new Error("Expected Professor Clover's search.");
  expect(search.candidates.find((candidate) => candidate.ref.id === chosenId)?.legal).toBe(true);
  engine.resolveDecision("effectSearchSelection", { selectedIds: [chosenId] }, seat);
  const remainder = engine.pendingDecision("effectSearchRemainderOrder", seat).steps[0];
  if (remainder?.kind !== "orderItems") throw new Error("Expected Clover's remainder order.");
  engine.resolveDecision(
    "effectSearchRemainderOrder",
    { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id) },
    seat,
  );
}

describe("OP09-102 Professor Clover", () => {
  test("with Nico Robin, finds only a card with an executable Trigger", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09NicoRobin062,
      hand: [op09ProfessorClover102],
      deck: [op08SShark111, eb01Doma005, eb01MountainGod018, eb01Doma005],
      activeDon: 1,
    });
    const triggerId = engine.findCardInZone("south", "deck", op08SShark111);
    const plainId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op09ProfessorClover102, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Professor Clover's search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === triggerId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === plainId)?.legal).toBe(false);
    resolveSearch(engine, "south", triggerId);

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      triggerId,
    );
  });

  test("Life Trigger activates its On Play search", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op09NicoRobin062,
        life: [op09ProfessorClover102],
        deck: [op08SShark111, eb01Doma005, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "deck", op08SShark111);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    resolveSearch(engine, "north", triggerId);

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      triggerId,
    );
  });
});
