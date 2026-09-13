import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01EdwardWeevil023,
  eb01MountainGod018,
  op09MarshallDTeach081,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-081 Marshall.D.Teach", () => {
  test("negates future On Play effects for each player through the printed duration", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09MarshallDTeach081,
        hand: [eb01EdwardWeevil023, eb01Doma005, eb01MountainGod018],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
        activeDon: 5,
      },
      {
        hand: [eb01EdwardWeevil023, eb01EdwardWeevil023],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
        activeDon: 8,
      },
    );
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const southDeckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(eb01EdwardWeevil023, "south");
    expect(engine.getView("south").players.south.deckCount).toBe(southDeckBefore);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");

    engine.endTurn("south");
    const northDeckBeforeSuppressedPlay = engine.getView("north").players.north.deckCount;
    engine.playCard(eb01EdwardWeevil023, "north");
    expect(engine.getView("north").players.north.deckCount).toBe(northDeckBeforeSuppressedPlay);

    engine.endTurn("north");
    engine.endTurn("south");
    const northDeckBeforeExpiredPlay = engine.getView("north").players.north.deckCount;
    engine.playCard(eb01EdwardWeevil023, "north");
    expect(engine.getView("north").players.north.deckCount).toBe(northDeckBeforeExpiredPlay - 1);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09MarshallDTeach081,
        hand: [eb01EdwardWeevil023, eb01Doma005, eb01MountainGod018],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
        activeDon: 5,
      },
      {
        hand: [eb01EdwardWeevil023, eb01EdwardWeevil023],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
        activeDon: 8,
      },
    );
    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
