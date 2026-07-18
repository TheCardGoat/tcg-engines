import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01MonkeyDLuffy003,
  op12RoronoaZoro020,
} from "@tcg/op-cards";
import { op12Baby5112 } from "../../../../../cards/src/cards/OP12/characters/112-baby-5.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-112 Baby 5", () => {
  test("its Life Trigger draws two only for a multicolored Leader", () => {
    const multicolored = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op01MonkeyDLuffy003,
        life: [op12Baby5112],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const handBefore = multicolored.getView("north").players.north.handCount;
    multicolored.declareAttack(
      multicolored.findCardInZone("south", "character", eb01MountainGod018),
      multicolored.leader("north"),
      "south",
    );
    multicolored.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(multicolored.getView("north").players.north.handCount).toBe(handBefore + 2);

    const monocolored = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op12RoronoaZoro020,
        life: [op12Baby5112],
        deck: [
          eb01Doma005,
          eb01MountainGod018,
          eb01Doma005,
          eb01MountainGod018,
          eb01Doma005,
          eb01MountainGod018,
          eb01Doma005,
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const monoHandBefore = monocolored.getView("north").players.north.handCount;
    monocolored.declareAttack(
      monocolored.findCardInZone("south", "character", eb01MountainGod018),
      monocolored.leader("north"),
      "south",
    );
    monocolored.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(monocolored.getView("north").players.north.handCount).toBe(monoHandBefore);
  });
});
