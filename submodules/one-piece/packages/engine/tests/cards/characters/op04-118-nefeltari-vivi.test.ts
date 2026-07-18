import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op04Chaka008,
  op04NefeltariVivi118,
  op04Randolph114,
  op04Sanji007,
  op04SuperSpotBilledDuckTroops009,
  op04Usopp003,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const chakaCostReducer: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP04-118-CHAKA-COST-REDUCER",
  canonicalId: "TEST-OP04-118-CHAKA-COST-REDUCER",
  name: "Chaka Cost Reducer",
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: "all" },
              filters: [{ filter: "name", value: "Chaka" }],
            },
            value: -1,
            duration: "permanent",
          },
        ],
      },
    ],
  },
};

registerCards([chakaCostReducer]);

const RUSH_TURN = { firstPlayer: "north" as const, activeSeat: "south" as const };

function attackSources(engine: OnePieceTestEngine): string[] {
  const step = engine
    .getView("south")
    .decisions.find((decision) => decision.kind === "chooseAction")?.steps[0];
  expect(step?.kind).toBe("chooseAction");
  if (step?.kind !== "chooseAction") throw new Error("Expected turn actions.");
  return step.actions
    .filter((action) => action.commandType === "declareAttack")
    .map((action) => action.source?.id)
    .filter((id): id is string => Boolean(id));
}

describe("OP04-118 Nefeltari Vivi", () => {
  test("continuously grants Rush only to other red Characters currently costing at least 3", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op04NefeltariVivi118, playedOnTurn: 1 },
          { card: op04Chaka008, playedOnTurn: 1 },
          { card: op04SuperSpotBilledDuckTroops009, playedOnTurn: 1 },
          { card: op04Randolph114, playedOnTurn: 1 },
        ],
      },
      {},
      RUSH_TURN,
    );
    const viviId = engine.findCardInZone("south", "character", op04NefeltariVivi118);
    const chakaId = engine.findCardInZone("south", "character", op04Chaka008);
    const cheapRedId = engine.findCardInZone(
      "south",
      "character",
      op04SuperSpotBilledDuckTroops009,
    );
    const nonRedId = engine.findCardInZone("south", "character", op04Randolph114);
    const sources = attackSources(engine);
    expect(sources).toContain(chakaId);
    expect(sources).not.toContain(viviId);
    expect(sources).not.toContain(cheapRedId);
    expect(sources).not.toContain(nonRedId);
  });

  test("gives Rush to an eligible red Character played after Vivi", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op04NefeltariVivi118],
        hand: [op04Usopp003],
        activeDon: op04Usopp003.cost,
      },
      {},
      RUSH_TURN,
    );
    engine.playCard(op04Usopp003, "south");
    const usoppId = engine.findCardInZone("south", "character", op04Usopp003);
    engine.declareAttack(usoppId, engine.leader("north"), "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === usoppId)
        ?.rested,
    ).toBe(true);
  });

  test("removes granted Rush when the recipient's current cost falls below 3", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op04NefeltariVivi118, playedOnTurn: 1 },
          { card: op04Chaka008, playedOnTurn: 1 },
          chakaCostReducer,
        ],
      },
      {},
      RUSH_TURN,
    );
    const chakaId = engine.findCardInZone("south", "character", op04Chaka008);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === chakaId)
        ?.cost,
    ).toBe(2);
    expect(attackSources(engine)).not.toContain(chakaId);
  });

  test("does not grant Rush to a newly played cheap red or non-red Character", () => {
    const cheap = OnePieceTestEngine.create(
      { character: [op04NefeltariVivi118], hand: [op04Sanji007], activeDon: op04Sanji007.cost },
      {},
      RUSH_TURN,
    );
    cheap.playCard(op04Sanji007, "south");
    const sanjiId = cheap.findCardInZone("south", "character", op04Sanji007);
    expect(
      cheap.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: sanjiId,
        targetId: cheap.leader("north"),
      }).reason,
    ).toContain("cannot attack");

    const nonRed = OnePieceTestEngine.create(
      {
        character: [op04NefeltariVivi118],
        hand: [eb01Fourtricks025],
        activeDon: eb01Fourtricks025.cost,
      },
      {},
      RUSH_TURN,
    );
    nonRed.playCard(eb01Fourtricks025, "south");
    const nonRedId = nonRed.findCardInZone("south", "character", eb01Fourtricks025);
    expect(
      nonRed.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: nonRedId,
        targetId: nonRed.leader("north"),
      }).reason,
    ).toContain("cannot attack");
  });
});
