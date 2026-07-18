import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op06MonkeyDLuffy013,
  op06Shuraiya009,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function resolveSearch(engine: OnePieceTestEngine, actor: "south" | "north", selectedId: string) {
  const search = engine.pendingDecision("effectSearchSelection", actor).steps[0];
  expect(search?.kind).toBe("selectEntity");
  if (search?.kind !== "selectEntity") throw new Error("Expected Luffy's FILM search.");
  expect(search).toMatchObject({ min: 0, max: 1 });
  expect(search.candidates.find((candidate) => candidate.ref.id === selectedId)?.legal).toBe(true);
  engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, actor);

  const remainder = engine.pendingDecision("effectSearchRemainderOrder", actor).steps[0];
  expect(remainder?.kind).toBe("orderItems");
  if (remainder?.kind !== "orderItems") throw new Error("Expected search remainder ordering.");
  engine.resolveDecision(
    "effectSearchRemainderOrder",
    { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
    actor,
  );
}

describe("OP06-013 Monkey.D.Luffy", () => {
  test("on play searches the top three for a card whose type includes FILM", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06MonkeyDLuffy013],
      deck: [op06Shuraiya009, eb01Doma005, eb01MountainGod018, eb01Doma005],
      activeDon: op06MonkeyDLuffy013.cost,
    });
    const filmId = engine.findCardInZone("south", "deck", op06Shuraiya009);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op06MonkeyDLuffy013, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Luffy's FILM search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === filmId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
      false,
    );
    resolveSearch(engine, "south", filmId);

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(filmId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger activates the On Play search without playing the resolving card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op06MonkeyDLuffy013],
        deck: [op06Shuraiya009, eb01Doma005, eb01MountainGod018, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const luffyId = engine.findCardInZone("north", "life", op06MonkeyDLuffy013);
    const filmId = engine.findCardInZone("north", "deck", op06Shuraiya009);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    resolveSearch(engine, "north", filmId);

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(filmId);
    expect(view.players.north.characters.some((card) => card?.instanceId === luffyId)).toBe(false);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(luffyId);
    expect(view.prompts).toHaveLength(0);
  });
});
