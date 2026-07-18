import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op13GolDRoger003,
  op13GuessWeLlHaveAnotherScrapYouCanOnlyRiskDeathWhileYouReStillAlive075,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP13-075 Guess We'll Have Another Scrap", () => {
  test("Main pays one DON!! before Roger with given DON!! adds one rested DON!!", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op13GolDRoger003,
      hand: [op13GuessWeLlHaveAnotherScrapYouCanOnlyRiskDeathWhileYouReStillAlive075],
      character: [{ card: eb01Doma005, attachedDon: 1 }],
      activeDon: 2,
      donDeckCount: 5,
    });

    engine.playCard(op13GuessWeLlHaveAnotherScrapYouCanOnlyRiskDeathWhileYouReStillAlive075);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 0,
      restedDon: 3,
      donDeckCount: 4,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Counter gives the defending Leader +3000 for the battle", () => {
    const event = op13GuessWeLlHaveAnotherScrapYouCanOnlyRiskDeathWhileYouReStillAlive075;
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [event], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", event);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
