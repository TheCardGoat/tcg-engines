import { describe, expect, test } from "vite-plus/test";
import {
  eb01Fourtricks025,
  eb03CharlotteBrulee033,
  op02Magellan085,
  op03CharlotteKatakuri099,
  op04WeaknessIsAnUnforgivableSin076,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "../events/battle-fixture.shared.ts";

describe("EB03-033 Charlotte Brulee", () => {
  test("adds one rested DON!! only once when its controller's effect returns DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
        ],
      },
      {
        leaderCardId: op03CharlotteKatakuri099,
        hand: [op04WeaknessIsAnUnforgivableSin076, op04WeaknessIsAnUnforgivableSin076],
        character: [eb03CharlotteBrulee033],
        activeDon: 4,
        donDeckCount: 2,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerIds = engine
      .getView("south")
      .players.south.characters.flatMap((card) => (card ? [card.instanceId] : []));
    const eventIds = engine.getView("north").players.north.hand.map((card) => card.instanceId);
    const donDeckBefore = engine.getView("north").players.north.donDeckCount;

    engine.declareAttack(attackerIds[0]!, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventIds[0]!] }, "north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const addDon = engine.pendingDecision("effectAddDon", "north").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") {
      throw new Error("Expected Brulee's controller to choose a rested DON!! count.");
    }
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    expect(engine.getView("north").players.north).toMatchObject({
      activeDon: 2,
      restedDon: 2,
      donDeckCount: donDeckBefore,
    });

    engine.declareAttack(attackerIds[1]!, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventIds[1]!] }, "north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({
      activeDon: 0,
      restedDon: 3,
      donDeckCount: donDeckBefore + 1,
    });
    expect(view.prompts).toHaveLength(0);
  });

  test("requires a Big Mom Pirates Leader and ignores DON!! returned by the opponent's effect", () => {
    const wrongLeader = OnePieceTestEngine.create(
      {
        character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }],
      },
      {
        hand: [op04WeaknessIsAnUnforgivableSin076],
        character: [eb03CharlotteBrulee033],
        activeDon: 2,
        donDeckCount: 1,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = wrongLeader.findCardInZone("south", "character", eb01Fourtricks025);
    const eventId = wrongLeader.findCardInZone("north", "hand", op04WeaknessIsAnUnforgivableSin076);

    wrongLeader.declareAttack(attackerId, wrongLeader.leader("north"), "south");
    wrongLeader.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    wrongLeader.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    wrongLeader.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [wrongLeader.leader("north")] },
      "north",
    );
    expect(wrongLeader.getView("north").players.north).toMatchObject({
      activeDon: 0,
      restedDon: 1,
      donDeckCount: 2,
    });
    expect(wrongLeader.getView("north").prompts).toHaveLength(0);

    const opponentCaused = OnePieceTestEngine.create(
      { hand: [op02Magellan085], activeDon: 6 },
      {
        leaderCardId: op03CharlotteKatakuri099,
        character: [eb03CharlotteBrulee033],
        activeDon: 2,
        donDeckCount: 1,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );

    opponentCaused.playCard(op02Magellan085, "south");
    opponentCaused.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    opponentCaused.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0"] },
      "south",
    );

    expect(opponentCaused.getView("north").players.north).toMatchObject({
      activeDon: 1,
      restedDon: 0,
      donDeckCount: 2,
    });
    expect(opponentCaused.getView("north").prompts).toHaveLength(0);
  });
});
