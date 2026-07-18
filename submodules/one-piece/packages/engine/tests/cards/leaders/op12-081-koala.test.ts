import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op01JeanBart045,
  op01TrafalgarLaw047,
  op12Issho082,
  op12Koala081,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP12-081 Koala", () => {
  test("draws on a Leader attack and reacts once to a directly played base-cost-8 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op12Koala081,
        character: [op12Issho082, op12Issho082],
        deck: [eb01Doma005, eb01Doma005],
      },
      { hand: [op12Issho082], life: [eb01Doma005, eb01Doma005], activeDon: 8 },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    engine.endTurn("south");
    engine.playCard(op12Issho082, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("north").players.north.lifeCount).toBe(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("reacts to a low-cost Character played by a Character effect", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op12Koala081 },
      {
        hand: [op01TrafalgarLaw047, eb01Doma005],
        character: [op01JeanBart045],
        life: [eb01Doma005],
        activeDon: 5,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const domaId = engine.findCardInZone("north", "hand", eb01Doma005);
    const jeanBartId = engine.findCardInZone("north", "character", op01JeanBart045);

    engine.playCard(op01TrafalgarLaw047, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [jeanBartId] }, "north");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [domaId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("north").players.north.lifeCount).toBe(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
