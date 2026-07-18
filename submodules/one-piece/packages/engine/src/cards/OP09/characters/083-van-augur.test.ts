import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op09MarshallDTeach081,
  op09VanAugur083,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-083 Van Augur", () => {
  test("rests itself to give an opposing Character minus 3 cost for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op09MarshallDTeach081, character: [op09VanAugur083] },
      { character: [eb01MountainGod018] },
    );
    const vanAugurId = engine.findCardInZone("south", "character", op09VanAugur083);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(vanAugurId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === vanAugurId)?.rested,
    ).toBe(true);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      2,
    );
    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      5,
    );
  });

  test("may pay the rest cost without the required Leader type but changes no cost", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op09VanAugur083] },
      { character: [eb01MountainGod018] },
    );
    const vanAugurId = engine.findCardInZone("south", "character", op09VanAugur083);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(vanAugurId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === vanAugurId)?.rested,
    ).toBe(true);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      5,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("draws one card when K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op09VanAugur083, rested: true, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Fourtricks025],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const vanAugurId = engine.findCardInZone("south", "character", op09VanAugur083);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const drawnId = engine.getState().players.south.deck[0]!;

    engine.declareAttack(attackerId, vanAugurId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(vanAugurId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.deckCount).toBe(1);
  });
});
