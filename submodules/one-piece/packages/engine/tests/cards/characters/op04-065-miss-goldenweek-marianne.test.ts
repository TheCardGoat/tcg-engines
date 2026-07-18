import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op02MonkeyDLuffy041,
  op04Crocodile058,
  op04MissGoldenweekMarianne065,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-065 Miss.Goldenweek(Marianne)", () => {
  test("with an included Baroque Works Leader restricts only cost-5-or-less until next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04Crocodile058,
        hand: [op04MissGoldenweekMarianne065],
        activeDon: op04MissGoldenweekMarianne065.cost,
      },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op02MonkeyDLuffy041, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const tooExpensiveId = engine.findCardInZone("north", "character", op02MonkeyDLuffy041);

    engine.playCard(op04MissGoldenweekMarianne065, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Goldenweek's target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    engine.endTurn("south");
    expect(() => engine.declareAttack(eligibleId, engine.leader("south"), "north")).toThrow();

    engine.endTurn("north");
    engine.endTurn("south");
    expect(() => engine.declareAttack(eligibleId, engine.leader("south"), "north")).not.toThrow();
  });

  test("does not offer an On Play restriction with a non-Baroque Works Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04MissGoldenweekMarianne065],
        activeDon: op04MissGoldenweekMarianne065.cost,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
    );

    engine.playCard(op04MissGoldenweekMarianne065, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may pay the Life Trigger cost to play itself, or decline without paying", () => {
    const accepted = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op04MissGoldenweekMarianne065], activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const acceptedAttacker = accepted.findCardInZone("south", "character", eb01MountainGod018);
    const acceptedId = accepted.findCardInZone("north", "life", op04MissGoldenweekMarianne065);
    accepted.declareAttack(acceptedAttacker, accepted.leader("north"), "south");
    accepted.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    accepted.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    expect(
      accepted
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === acceptedId),
    ).toBe(true);
    expect(accepted.getView("north").players.north.activeDon).toBe(0);

    const declined = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op04MissGoldenweekMarianne065], activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const declinedAttacker = declined.findCardInZone("south", "character", eb01MountainGod018);
    const declinedId = declined.findCardInZone("north", "life", op04MissGoldenweekMarianne065);
    declined.declareAttack(declinedAttacker, declined.leader("north"), "south");
    declined.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    declined.resolveDecision("effectOptional", { optionId: "no" }, "north");

    const view = declined.getView("north");
    expect(view.players.north.activeDon).toBe(1);
    expect(view.players.north.characters.some((card) => card?.instanceId === declinedId)).toBe(
      false,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(declinedId);
  });
});
