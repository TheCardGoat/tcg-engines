import { describe, expect, test } from "vite-plus/test";
import { eb03Alvida021, op09Buggy042, op09Crocodile046, pBuggy084 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-084 Buggy", () => {
  test("replays a Cross Guild Character of cost 6 or less from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09Buggy042,
        hand: [pBuggy084, eb03Alvida021, op09Crocodile046],
        activeDon: pBuggy084.cost,
      },
      {},
    );
    const alvidaId = engine.findCardInZone("south", "hand", eb03Alvida021);

    engine.playCard(pBuggy084, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the replay choice.");
    const candidates = play.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(alvidaId);
    expect(candidates).not.toContain(engine.findCardInZone("south", "hand", op09Crocodile046));
    engine.resolveDecision("effectPlaySelection", { selectedIds: [alvidaId] }, "south");
    // Alvida's own [On Play] cascade follows; resolve it (its choice prompt
    // is hers to make — pass 0 for a no-op where supported).
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south").players.south;
    expect(view.characters.map((card) => card?.instanceId)).toContain(alvidaId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Buggy's Leader can play the printed Cross Guild Character", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP09-042",
      hand: ["P-084", "EB01-005"],
      activeDon: 5,
    });
    const buggy = e.findCardInZone("south", "hand", "P-084");
    const payment = e.findCardInZone("south", "hand", "EB01-005");
    e.activateEffect(e.leader("south"), "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectCostTrashFromHand", { selectedIds: [payment] }, "south");
    const step = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("Expected Cross Guild play");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([buggy]);
    e.resolveDecision("effectPlaySelection", { selectedIds: [buggy] }, "south");
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(buggy);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("Ipponmatsu can select Buggy's printed Slash attribute", () => {
    const e = OnePieceTestEngine.create({
      character: ["P-084"],
      hand: ["OP04-042"],
      activeDon: 2,
      deck: ["EB01-005", "EB01-005"],
    });
    const buggy = e.findCardInZone("south", "character", "P-084");
    e.playCard("OP04-042");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("Expected Slash target");
    expect(step.candidates.map((c) => c.ref.id)).toContain(buggy);
    e.resolveDecision("effectTargetSelection", { selectedIds: [buggy] }, "south");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(11000);
    expect(e.getView("south").players.south.deckCount).toBe(1);
  });

  test.each(["south", "north"] as const)(
    "both cost-three and cost-four Characters on %s cannot attack",
    (seat) => {
      const attackers = [
        { cardId: "EB01-025", playedOnTurn: 0 },
        { cardId: "EB01-036", playedOnTurn: 0 },
      ];
      const e = OnePieceTestEngine.create(
        { leaderCardId: "OP09-042", character: ["P-084", ...(seat === "south" ? attackers : [])] },
        { character: seat === "north" ? attackers : [] },
        { firstPlayer: seat === "south" ? "north" : "south", activeSeat: seat },
      );
      for (const cardId of ["EB01-025", "EB01-036"]) {
        const id = e.findCardInZone(seat, "character", cardId);
        expect(
          e.expectFailure({
            type: "declareAttack",
            seat,
            attackerId: id,
            targetId: e.leader(seat === "south" ? "north" : "south"),
          }).reason,
        ).toBe("The selected attacker cannot attack.");
      }
      expect(
        e
          .getView(seat)
          .players[seat].characters.filter(Boolean)
          .every((c) => !c?.rested),
      ).toBe(true);
    },
  );

  test("without a Buggy Leader only Buggy's own attack is prohibited", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [
          { cardId: "P-084", playedOnTurn: 0 },
          { cardId: "EB01-025", playedOnTurn: 0 },
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const buggy = e.findCardInZone("south", "character", "P-084");
    expect(
      e.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: buggy,
        targetId: e.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
    const before = e.getView("north").players.north.lifeCount;
    e.asSouth().attack("EB01-025", e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(before - 1);
  });
});
