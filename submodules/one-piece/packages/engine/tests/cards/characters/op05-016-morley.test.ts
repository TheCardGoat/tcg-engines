import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op02EmporioIvankov049,
  op02Inazuma050,
  op05BeloBetty002,
  op05Morley016,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-016 Morley", () => {
  test("has separate Giant and Revolutionary Army types", () => {
    expect(op05Morley016.traits).toEqual(["Giant", "Revolutionary Army"]);
  });

  test("at 7000 power prevents every opposing Blocker during only that battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Morley016, attachedDon: 2, playedOnTurn: 0 }] },
      { character: [op02Inazuma050], life: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const morleyId = engine.findCardInZone("south", "character", op05Morley016);

    engine.declareAttack(morleyId, engine.leader("north"), "south");

    expect(
      engine.getView("north").decisions.some((decision) => decision.title.includes("Blocker")),
    ).toBe(false);
  });

  test("below 7000 power still permits an opposing Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Morley016, playedOnTurn: 0 }] },
      { character: [op02Inazuma050] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const morleyId = engine.findCardInZone("south", "character", op05Morley016);
    const blockerId = engine.findCardInZone("north", "character", op02Inazuma050);

    engine.declareAttack(morleyId, engine.leader("north"), "south");
    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Inazuma's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
  });

  test("Life Trigger trashes a hand card and plays the exact resolving card only for a multicolored Leader", () => {
    const run = (multicolored: boolean) => {
      const engine = OnePieceTestEngine.create(
        { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
        {
          leaderCardId: multicolored ? op05BeloBetty002 : op02EmporioIvankov049,
          life: [op05Morley016],
          hand: [eb01Doma005],
        },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
      const triggerId = engine.findCardInZone("north", "life", op05Morley016);
      const paymentId = engine.findCardInZone("north", "hand", eb01Doma005);
      engine.declareAttack(attackerId, engine.leader("north"), "south");
      engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
      engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
      engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
      return { engine, triggerId, paymentId };
    };

    const accepted = run(true);
    expect(
      accepted.engine.getView("north").players.north.characters.map((card) => card?.instanceId),
    ).toContain(accepted.triggerId);
    expect(
      accepted.engine.getView("north").players.north.trash.map((card) => card.instanceId),
    ).toContain(accepted.paymentId);

    const gated = run(false);
    expect(
      gated.engine.getView("north").players.north.characters.map((card) => card?.instanceId),
    ).not.toContain(gated.triggerId);
    expect(
      gated.engine.getView("north").players.north.trash.map((card) => card.instanceId),
    ).toEqual(expect.arrayContaining([gated.paymentId, gated.triggerId]));
  });
});
