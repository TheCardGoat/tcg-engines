import { describe, expect, test } from "vite-plus/test";
import { op01RoronoaZoro001, op03Iceburg058, op03PeepleyLulu067 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-067 Peepley Lulu", () => {
  test("with attached DON!! and an included Galley-La Company Leader, adds one rested DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Iceburg058,
        character: [{ card: op03PeepleyLulu067, playedOnTurn: 0, attachedDon: 1 }],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const luluId = engine.findCardInZone("south", "character", op03PeepleyLulu067);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;
    const restedDonBefore = engine.getView("south").players.south.restedDon;

    engine.declareAttack(luluId, engine.leader("north"), "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore - 1);
    expect(view.players.south.restedDon).toBe(restedDonBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose zero DON!! after meeting both attack conditions", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Iceburg058,
        character: [{ card: op03PeepleyLulu067, playedOnTurn: 0, attachedDon: 1 }],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const luluId = engine.findCardInZone("south", "character", op03PeepleyLulu067);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(luluId, engine.leader("north"), "south");
    engine.resolveDecision("effectAddDon", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer DON!! without attached DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op03Iceburg058, character: [{ card: op03PeepleyLulu067, playedOnTurn: 0 }] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const luluId = engine.findCardInZone("south", "character", op03PeepleyLulu067);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(luluId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer DON!! with a non-Galley-La Company Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01RoronoaZoro001,
        character: [{ card: op03PeepleyLulu067, playedOnTurn: 0, attachedDon: 1 }],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const luluId = engine.findCardInZone("south", "character", op03PeepleyLulu067);

    engine.declareAttack(luluId, engine.leader("north"), "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
