import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01MsAllSunday079,
  op09Mr1DazBonez055,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04MissDoublefingerZala086 } from "../../../../../cards/src/cards/OP14EB04/characters/086-miss-doublefinger-zala.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-086 Miss Doublefinger(Zala)", () => {
  test("at seven trash cards gains 1000 power and gives every own included Baroque Works Character +2 cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04MissDoublefingerZala086],
        character: [op09Mr1DazBonez055, op01MsAllSunday079, eb01MountainGod018],
        trash: [
          eb01Doma005,
          eb01Doma005,
          eb01Doma005,
          eb01Doma005,
          eb01Fourtricks025,
          eb01Fourtricks025,
          eb01Fourtricks025,
        ],
        activeDon: op14eb04MissDoublefingerZala086.cost,
      },
      { character: [op09Mr1DazBonez055] },
    );
    const includedTraitId = engine.findCardInZone("south", "character", op09Mr1DazBonez055);
    const exactTraitId = engine.findCardInZone("south", "character", op01MsAllSunday079);
    const wrongTraitId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const opponentId = engine.findCardInZone("north", "character", op09Mr1DazBonez055);

    engine.playCard(op14eb04MissDoublefingerZala086, "south");
    const zalaId = engine.findCardInZone("south", "character", op14eb04MissDoublefingerZala086);

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === zalaId)).toMatchObject(
      {
        power: (op14eb04MissDoublefingerZala086.power ?? 0) + 1000,
        cost: op14eb04MissDoublefingerZala086.cost + 2,
      },
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === includedTraitId)?.cost,
    ).toBe(op09Mr1DazBonez055.cost + 2);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === exactTraitId)?.cost,
    ).toBe(op01MsAllSunday079.cost + 2);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === wrongTraitId)?.cost,
    ).toBe(eb01MountainGod018.cost);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opponentId)?.cost,
    ).toBe(op09Mr1DazBonez055.cost);
    expect(view.prompts).toHaveLength(0);
  });

  test("six trash cards do not satisfy either permanent modifier", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04MissDoublefingerZala086],
      character: [op09Mr1DazBonez055],
      trash: [
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Fourtricks025,
        eb01Fourtricks025,
        eb01Fourtricks025,
      ],
      activeDon: op14eb04MissDoublefingerZala086.cost,
    });
    const otherId = engine.findCardInZone("south", "character", op09Mr1DazBonez055);

    engine.playCard(op14eb04MissDoublefingerZala086, "south");
    const zalaId = engine.findCardInZone("south", "character", op14eb04MissDoublefingerZala086);

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === zalaId)).toMatchObject(
      {
        power: op14eb04MissDoublefingerZala086.power,
        cost: op14eb04MissDoublefingerZala086.cost,
      },
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === otherId)?.cost).toBe(
      op09Mr1DazBonez055.cost,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
