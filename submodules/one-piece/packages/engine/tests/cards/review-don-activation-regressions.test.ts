import { describe, expect, test } from "vite-plus/test";
import { eb01Mr2BonKureiBentham061, op14eb04BirdNeptunian016 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../src/index.ts";
import { addModifier } from "../../src/state.ts";

describe("DON!! activation review regressions", () => {
  test("a Character addDon action cannot bypass the active-DON!! lock", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Mr2BonKureiBentham061],
        character: [op14eb04BirdNeptunian016],
        activeDon: 4,
        restedDon: 1,
        donDeckCount: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const birdId = engine.findCardInZone("south", "character", op14eb04BirdNeptunian016);

    engine.activateEffect(birdId, "activateMain", "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");
    engine.playCard(eb01Mr2BonKureiBentham061, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({
      activeDon: 1,
      restedDon: 4,
      donDeckCount: 1,
    });
    expect(view.prompts).toHaveLength(0);
  });

  test("an already-published addDon choice revalidates the active-DON!! lock", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Mr2BonKureiBentham061],
        activeDon: eb01Mr2BonKureiBentham061.cost,
        donDeckCount: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(eb01Mr2BonKureiBentham061, "south");
    expect(engine.pendingDecision("effectAddDon", "south").actorId).toBe("south");

    const lockedState = structuredClone(engine.getState());
    addModifier(lockedState, null, engine.leader("south"), {
      type: "flag",
      flag: "cannotSetDonActiveByCharacterEffects",
      playerScope: true,
      duration: "thisTurn",
      expiresAtTurn: lockedState.turnNumber,
      expiresAtBattleId: null,
      expiresOnTurnStartOfSeat: null,
    });
    const lockedEngine = OnePieceTestEngine.fromState(lockedState);
    lockedEngine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = lockedEngine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});
