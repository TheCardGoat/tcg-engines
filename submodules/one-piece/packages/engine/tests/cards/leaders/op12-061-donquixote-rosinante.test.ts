import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op12DonquixoteRosinante061,
  op12Issho082,
  op12TrafalgarLaw106,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP12-061 Donquixote Rosinante", () => {
  test("discounts the next qualifying Law without revealing a hand choice", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12DonquixoteRosinante061,
      hand: [op12TrafalgarLaw106],
      activeDon: 5,
    });
    const lawId = engine.findCardInZone("south", "hand", op12TrafalgarLaw106);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    expect(
      engine.getView("south").players.south.hand.find((card) => card.instanceId === lawId)?.cost,
    ).toBe(4);
    engine.playCard(op12TrafalgarLaw106, "south");
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 4 });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("spends one Life to replace a Trafalgar Law battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op12Issho082, playedOnTurn: 0 }] },
      {
        leaderCardId: op12DonquixoteRosinante061,
        character: [{ card: op12TrafalgarLaw106, rested: true, playedOnTurn: 0 }],
        life: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", op12Issho082);
    const lawId = engine.findCardInZone("north", "character", op12TrafalgarLaw106);

    engine.declareAttack(attackerId, lawId, "south");
    engine.resolveDecision("battleKoReplacement", { optionId: "yes" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === lawId)).toBe(true);
    expect(view.players.north.lifeCount).toBe(0);
    expect(view.players.north.hand).toHaveLength(1);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
