import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op07MonkeyDDragon001,
  op09BeloBetty112,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-112 Belo Betty", () => {
  test("On Play draws at two Life but not at three", () => {
    const eligible = OnePieceTestEngine.create({
      hand: [op09BeloBetty112],
      life: [eb01Doma005, eb01Doma005],
      deck: [eb01MountainGod018, eb01Doma005],
      activeDon: op09BeloBetty112.cost,
    });
    const eligibleDeck = eligible.getView("south").players.south.deckCount;
    eligible.playCard(op09BeloBetty112, "south");
    expect(eligible.getView("south").players.south.deckCount).toBe(eligibleDeck - 1);

    const ineligible = OnePieceTestEngine.create({
      hand: [op09BeloBetty112],
      life: [eb01Doma005, eb01Doma005, eb01Doma005],
      deck: [eb01MountainGod018, eb01Doma005],
      activeDon: op09BeloBetty112.cost,
    });
    const ineligibleDeck = ineligible.getView("south").players.south.deckCount;
    ineligible.playCard(op09BeloBetty112, "south");
    expect(ineligible.getView("south").players.south.deckCount).toBe(ineligibleDeck);
  });

  test("Life Trigger plays Betty at five total Life and resolves its On Play draw", () => {
    const engine = OnePieceTestEngine.create(
      {
        life: Array.from({ length: 5 }, () => eb01Doma005),
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        leaderCardId: op07MonkeyDDragon001,
        life: [op09BeloBetty112],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005, eb01MountainGod018, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const bettyId = engine.findCardInZone("north", "life", op09BeloBetty112);
    const deckBefore = engine.getView("north").players.north.deckCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(bettyId);
    expect(view.players.north.deckCount).toBe(deckBefore - 1);
  });
});
