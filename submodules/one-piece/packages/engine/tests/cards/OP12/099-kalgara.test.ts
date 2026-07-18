import { describe, expect, test } from "vite-plus/test";
import { eb01EdwardWeevil023 } from "../../../../cards/src/cards/EB01/characters/023-edward-weevil.ts";
import { op02Squard009 } from "../../../../cards/src/cards/OP02/characters/009-squard.ts";
import { op02EdwardNewgate001 } from "../../../../cards/src/cards/OP02/leaders/001-edward-newgate.ts";
import { op12Kalgara099 } from "../../../../cards/src/cards/OP12/characters/099-kalgara.ts";
import { op14eb04Killer005 } from "../../../../cards/src/cards/OP14EB04/characters/005-killer.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP12-099 Kalgara", () => {
  test("draws when Life is removed, then blocks later draws from own effects this turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02EdwardNewgate001,
        character: [op12Kalgara099],
        hand: [op02Squard009, eb01EdwardWeevil023],
        life: [op14eb04Killer005],
        deck: [op14eb04Killer005, op14eb04Killer005, op14eb04Killer005, op14eb04Killer005],
        activeDon: op02Squard009.cost + eb01EdwardWeevil023.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op02Squard009);

    expect(engine.getState().players.south.hand).toHaveLength(3);
    expect(engine.getState().players.south.deck).toHaveLength(3);

    engine.playCard(eb01EdwardWeevil023);

    expect(engine.getState().players.south.hand).toHaveLength(2);
    expect(engine.getState().players.south.deck).toHaveLength(3);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
