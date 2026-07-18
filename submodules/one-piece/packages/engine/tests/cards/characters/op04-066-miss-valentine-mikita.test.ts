import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op04Bananagator062,
  op04Franky063,
  op04MissValentineMikita066,
  op04MsAllSunday064,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-066 Miss.Valentine(Mikita)", () => {
  test("searches only Baroque Works and may reveal another Miss.Valentine", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04MissValentineMikita066],
      deck: [
        op04MissValentineMikita066,
        op04MsAllSunday064,
        eb01Doma005,
        op04Franky063,
        op04Bananagator062,
        eb01MountainGod018,
      ],
      activeDon: op04MissValentineMikita066.cost,
    });
    const sameNameId = engine.findCardInZone("south", "deck", op04MissValentineMikita066);
    const baroqueWorksId = engine.findCardInZone("south", "deck", op04MsAllSunday064);
    const unrelatedIds = [
      engine.findCardInZone("south", "deck", eb01Doma005),
      engine.findCardInZone("south", "deck", op04Franky063),
      engine.findCardInZone("south", "deck", op04Bananagator062),
    ];
    const untouchedId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op04MissValentineMikita066, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Miss.Valentine's search.");
    expect(
      search.candidates.map((candidate) => ({ id: candidate.ref.id, legal: candidate.legal })),
    ).toEqual([
      { id: sameNameId, legal: true },
      { id: baroqueWorksId, legal: true },
      ...unrelatedIds.map((id) => ({ id, legal: false })),
    ]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [sameNameId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected search remainder ordering.");
    const bottomOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(sameNameId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...bottomOrder]);
    expect(view.prompts).toHaveLength(0);
  });

  test("may reveal zero cards and order all five looked cards on the bottom", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04MissValentineMikita066],
      deck: [
        op04MissValentineMikita066,
        op04MsAllSunday064,
        eb01Doma005,
        op04Franky063,
        op04Bananagator062,
      ],
      activeDon: op04MissValentineMikita066.cost,
    });

    engine.playCard(op04MissValentineMikita066, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected search remainder ordering.");
    const bottomOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(0);
    expect(engine.getState().players.south.deck).toEqual(bottomOrder);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger plays the physical card before starting its On Play search", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op04MissValentineMikita066],
        deck: [op04MsAllSunday064, eb01Doma005, op04Franky063, op04Bananagator062],
        activeDon: 1,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const valentineId = engine.findCardInZone("north", "life", op04MissValentineMikita066);
    const searchedId = engine.findCardInZone("north", "deck", op04MsAllSunday064);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    expect(
      engine
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === valentineId),
    ).toBe(true);
    expect(engine.pendingDecision("effectSearchSelection", "north").actorId).toBe("north");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [searchedId] }, "north");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "north").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Trigger search remainder.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id) },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(searchedId);
    expect(view.players.north.activeDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the Life Trigger cost without paying or playing", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op04MissValentineMikita066], activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const valentineId = engine.findCardInZone("north", "life", op04MissValentineMikita066);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.activeDon).toBe(1);
    expect(view.players.north.characters.some((card) => card?.instanceId === valentineId)).toBe(
      false,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(valentineId);
  });
});
