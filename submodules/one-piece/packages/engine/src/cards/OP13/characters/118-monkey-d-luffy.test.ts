import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01RoronoaZoro001, op06Yamato022 } from "@tcg/op-cards";
import { op13JewelryBonney109 } from "../../../../../cards/src/cards/OP13/characters/109-jewelry-bonney.ts";
import { op13MonkeyDLuffy118 } from "../../../../../cards/src/cards/OP13/characters/118-monkey-d-luffy.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-118 Monkey.D.Luffy", () => {
  test("with a multicolored Leader activates up to four DON and restricts base-cost-5 Characters this turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06Yamato022,
      hand: [op13MonkeyDLuffy118, op13JewelryBonney109, eb01Doma005],
      activeDon: 10,
    });
    const restrictedId = engine.findCardInZone("south", "hand", op13JewelryBonney109);

    engine.playCard(op13MonkeyDLuffy118, "south");
    const don = engine.pendingDecision("effectSetActiveDon", "south").steps[0];
    if (don?.kind !== "chooseOption") throw new Error("Expected Luffy's DON!! count.");
    expect(don.options.map((option) => option.id)).toEqual(["0", "1", "2", "3", "4"]);
    engine.resolveDecision("effectSetActiveDon", { optionId: "4" }, "south");

    let view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 8, restedDon: 2 });
    expect(
      engine.expectFailure({ type: "playCard", seat: "south", instanceId: restrictedId }).reason,
    ).toBe("A card effect prevents this card from being played.");
    engine.playCard(eb01Doma005, "south");

    engine.endTurn("south");
    engine.endTurn("north");
    engine.playCard(op13JewelryBonney109, "south");
    view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(restrictedId);
    expect(view.prompts).toHaveLength(0);
  });

  test("with a monocolored Leader neither activates DON nor applies the play restriction", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01RoronoaZoro001,
      hand: [op13MonkeyDLuffy118, op13JewelryBonney109],
      activeDon: 11,
      restedDon: 4,
    });
    const playableId = engine.findCardInZone("south", "hand", op13JewelryBonney109);

    engine.playCard(op13MonkeyDLuffy118, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 5, restedDon: 10 });
    engine.playCard(op13JewelryBonney109, "south");

    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(playableId);
  });

  test("deals two Life damage with Double Attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op13MonkeyDLuffy118, playedOnTurn: 0 }] },
      { life: 3 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const luffyId = engine.findCardInZone("south", "character", op13MonkeyDLuffy118);

    engine.declareAttack(luffyId, engine.leader("north"), "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
