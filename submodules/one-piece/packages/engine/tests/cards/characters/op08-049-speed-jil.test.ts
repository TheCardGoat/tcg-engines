import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op08EdwardWeevil042, op08Namule050, op08SpeedJil049 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-049 Speed Jil", () => {
  test("its controller puts a compound Whitebeard Pirates reveal on the bottom and gains Rush", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08SpeedJil049],
        deck: [op08Namule050, eb01Doma005],
        activeDon: op08SpeedJil049.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const revealedId = engine.findCardInZone("south", "deck", op08Namule050);
    const remainingId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op08SpeedJil049, "south");
    const speedJilId = engine.findCardInZone("south", "character", op08SpeedJil049);
    const position = engine.pendingDecision("effectRevealedDeckPosition", "south");
    expect(position.actorId).toBe("south");
    expect(position.steps[0]).toMatchObject({ kind: "chooseOption" });
    engine.resolveDecision("effectRevealedDeckPosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.south.deck).toEqual([remainingId, revealedId]);
    expect(() => engine.declareAttack(speedJilId, engine.leader("north"), "south")).not.toThrow();
  });

  test("puts a nonmatching reveal on top and does not gain Rush", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08SpeedJil049],
        deck: [op08EdwardWeevil042, eb01Doma005],
        activeDon: op08SpeedJil049.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const revealedId = engine.findCardInZone("south", "deck", op08EdwardWeevil042);
    const remainingId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op08SpeedJil049, "south");
    const speedJilId = engine.findCardInZone("south", "character", op08SpeedJil049);
    engine.resolveDecision("effectRevealedDeckPosition", { optionId: "top" }, "south");

    expect(engine.getState().players.south.deck).toEqual([revealedId, remainingId]);
    expect(() => engine.declareAttack(speedJilId, engine.leader("north"), "south")).toThrow();
  });
});
