import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01RadicalBeam029,
  op12KouzukiOden004,
  op13CurlyDadan009,
  op13Higuma013,
  op13Makino015,
} from "@tcg/op-cards";
import { op13GolDRoger064 } from "../../../../../cards/src/cards/OP13/characters/064-gol-d-roger.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-064 Gol.D.Roger", () => {
  test("returns three DON!! to buff its Leader and reduce all opposing Characters through their next End Phase", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13GolDRoger064], activeDon: op13GolDRoger064.cost },
      { character: [eb01Doma005, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const leaderPower = engine.getView("south").players.south.leader.power ?? 0;
    const firstOpponentId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondOpponentId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op13GolDRoger064, "south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    let view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 7, donDeckCount: donDeckBefore + 3 });
    expect(view.players.south.leader.power).toBe(leaderPower + 2000);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === firstOpponentId)?.power,
    ).toBe((eb01Doma005.power ?? 0) - 2000);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === secondOpponentId)?.power,
    ).toBe((eb01MountainGod018.power ?? 0) - 2000);
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    view = engine.getView("north");
    expect(view.players.south.leader.power).toBe(leaderPower + 2000);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === firstOpponentId)?.power,
    ).toBe((eb01Doma005.power ?? 0) - 2000);

    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(leaderPower);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === firstOpponentId)?.power,
    ).toBe(eb01Doma005.power);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === secondOpponentId)?.power,
    ).toBe(eb01MountainGod018.power);
  });

  test("may decline its On Play DON!! cost and applies no power modifiers", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13GolDRoger064], activeDon: op13GolDRoger064.cost },
      { character: [eb01Doma005] },
    );
    const leaderPower = engine.getView("south").players.south.leader.power;
    const opponentId = engine.findCardInZone("north", "character", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op13GolDRoger064, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(leaderPower);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opponentId)?.power,
    ).toBe(eb01Doma005.power);
    expect(view.prompts).toHaveLength(0);
  });

  test("negates own non-Roger Pirates effects while preserving included Roger Pirates effects", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01RadicalBeam029, op01RadicalBeam029],
      character: [op13GolDRoger064, op13Makino015, op12KouzukiOden004],
    });
    const makinoId = engine.findCardInZone("south", "character", op13Makino015);
    const odenId = engine.findCardInZone("south", "character", op12KouzukiOden004);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: makinoId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    engine.activateEffect(odenId, "activateMain", "south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
  });

  test("also negates permanent effects of own non-Roger Pirates Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          op13GolDRoger064,
          { card: op13CurlyDadan009, attachedDon: 3, playedOnTurn: 0 },
          op13Higuma013,
        ],
      },
      { life: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const dadanId = engine.findCardInZone("south", "character", op13CurlyDadan009);

    engine.declareAttack(dadanId, engine.leader("north"), "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(1);
  });
});
