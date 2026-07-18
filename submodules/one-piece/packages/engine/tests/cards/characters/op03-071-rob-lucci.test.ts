import { describe, expect, test } from "vite-plus/test";
import {
  eb01Fourtricks025,
  eb01MountainGod018,
  op03MonkeyDLuffy070,
  op03RobLucci071,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-071 Rob Lucci", () => {
  test("may return DON!! to rest only an opposing cost-5-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op03RobLucci071, playedOnTurn: 0 }], activeDon: 1 },
      { character: [eb01Fourtricks025, op03MonkeyDLuffy070] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lucciId = engine.findCardInZone("south", "character", op03RobLucci071);
    const eligibleId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const excludedId = engine.findCardInZone("north", "character", op03MonkeyDLuffy070);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;
    engine.declareAttack(lucciId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(rest?.kind).toBe("selectEntity");
    if (rest?.kind !== "selectEntity") throw new Error("Expected Lucci's rest target.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(rest.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 0,
      donDeckCount: donDeckBefore + 1,
    });
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
  });

  test("may decline without returning DON!! or resting a Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op03RobLucci071, playedOnTurn: 0 }], activeDon: 1 },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lucciId = engine.findCardInZone("south", "character", op03RobLucci071);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.declareAttack(lucciId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.getView("south").players.south.activeDon).toBe(1);
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.rested,
    ).toBe(false);
  });
});
