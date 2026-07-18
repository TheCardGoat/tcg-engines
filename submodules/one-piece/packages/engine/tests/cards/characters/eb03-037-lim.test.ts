import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb03Lim037, op09Lim022, op10Enel025 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-037 Lim", () => {
  test("gives every own ODYSSEY Leader and Character +1000 through the opponent's next End Phase", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09Lim022,
      hand: [eb03Lim037],
      deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      character: [{ card: op10Enel025, attachedDon: 1 }, eb01Doma005],
      activeDon: 6,
      donDeckCount: 0,
    });
    const enelId = engine.findCardInZone("south", "character", op10Enel025);
    const unrelatedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(eb03Lim037, "south");
    const limId = engine.findCardInZone("south", "character", eb03Lim037);

    let view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(6000);
    expect(view.players.south.characters.find((card) => card?.instanceId === enelId)?.power).toBe(
      8000,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === limId)?.power).toBe(
      6000,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === unrelatedId)?.power,
    ).toBe(3000);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(6000);
    expect(view.players.south.characters.find((card) => card?.instanceId === enelId)?.power).toBe(
      7000,
    );

    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.players.south.characters.find((card) => card?.instanceId === enelId)?.power).toBe(
      6000,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === limId)?.power).toBe(
      5000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not grant power when only 6 DON!! cards remain on its field after play", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09Lim022,
      hand: [eb03Lim037],
      character: [{ card: op10Enel025, attachedDon: 1 }],
      activeDon: 5,
      donDeckCount: 0,
    });

    engine.playCard(eb03Lim037, "south");
    const limId = engine.findCardInZone("south", "character", eb03Lim037);
    const view = engine.getView("south");

    expect(view.players.south.leader.power).toBe(5000);
    expect(view.players.south.characters.find((card) => card?.instanceId === limId)?.power).toBe(
      5000,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
