import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03Lilith058,
  op07Vegapunk097,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-058 Lilith", () => {
  test("draws on play during its controller's turn at two Life, but not above the boundary", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03Lilith058],
      life: [eb01Doma005, eb01Fourtricks025],
      deck: [eb01MountainGod018, eb01Doma005],
      activeDon: eb03Lilith058.cost,
    });
    const drawnId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(eb03Lilith058, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      drawnId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);

    const aboveBoundary = OnePieceTestEngine.create({
      hand: [eb03Lilith058],
      life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: eb03Lilith058.cost,
    });
    aboveBoundary.playCard(eb03Lilith058, "south");
    expect(aboveBoundary.getView("south").players.south.handCount).toBe(0);
    expect(aboveBoundary.getView("south").players.south.deckCount).toBe(2);
  });

  test("plays its physical Life card with a Vegapunk Leader and does not draw on the opponent's turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        leaderCardId: op07Vegapunk097,
        life: [eb03Lilith058],
        deck: [eb01Doma005, eb01Fourtricks025],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const lilithId = engine.findCardInZone("north", "life", eb03Lilith058);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === lilithId)).toBe(true);
    expect(view.players.north.handCount).toBe(0);
    expect(view.players.north.deckCount).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });
});
