import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op14eb04ChakaPellEb04023023,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "../events/battle-fixture.shared.ts";

describe("EB04-023 Chaka & Pell", () => {
  test("may reduce its active Leader by 5000 for the turn to draw 2 on play", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04ChakaPellEb04023023],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: 8,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const firstDrawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondDrawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op14eb04ChakaPellEb04023023, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(0);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawnId, secondDrawnId]),
    );
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("cannot pay the draw cost after its Leader has attacked and become rested", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04ChakaPellEb04023023],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: 8,
      },
      {},
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.playCard(op14eb04ChakaPellEb04023023, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader).toMatchObject({ rested: true, power: 5000 });
    expect(view.players.south.handCount).toBe(0);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("deals 2 Life damage with Double Attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op14eb04ChakaPellEb04023023, playedOnTurn: 0 }] },
      { life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op14eb04ChakaPellEb04023023);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 2);
  });
});
