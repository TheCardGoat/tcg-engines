import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { edgarBalthazarLongsufferingButler } from "./173-edgar-balthazar-long-suffering-butler";

const strongOpponent = createMockCharacter({
  id: "edgar-strong-opponent",
  name: "Strong Opponent",
  cost: 5,
  strength: 5,
  willpower: 5,
});

describe("Edgar Balthazar - Long-Suffering Butler", () => {
  it("same-owner copies keep independent damage and umbrella conditions", () => {
    const heal = createMockAction({
      id: "edgar-copy-heal",
      name: "Heal",
      cost: 0,
      abilities: [
        {
          type: "action",
          effect: { type: "remove-damage", amount: 1, target: "CHOSEN_CHARACTER" },
        },
      ],
    });
    const hit = createMockAction({
      id: "edgar-copy-hit",
      name: "Hit",
      cost: 0,
      abilities: [
        { type: "action", effect: { type: "deal-damage", amount: 3, target: "CHOSEN_CHARACTER" } },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: edgarBalthazarLongsufferingButler, damage: 1 },
        edgarBalthazarLongsufferingButler,
      ],
      hand: [heal, hit],
    });
    const [damaged, undamaged] = g.getCardInstanceIdsInZone("play", PLAYER_ONE);
    expect(g.asPlayerOne().hasKeyword(damaged!, "Resist")).toBe(false);
    expect(g.asPlayerOne()).toHaveKeyword({ card: undamaged!, keyword: "Resist", value: 2 });
    expect(g.asPlayerOne().playCard(heal, { targets: [damaged!] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveKeyword({ card: damaged!, keyword: "Resist", value: 2 });
    expect(g.asPlayerOne().playCard(hit, { targets: [undamaged!] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveDamage({ card: undamaged!, value: 1 });
    expect(g.asPlayerOne().hasKeyword(undamaged!, "Resist")).toBe(false);
    expect(g.asPlayerOne()).toHaveDamage({ card: damaged!, value: 0 });
    expect(g.asPlayerOne()).toHaveKeyword({ card: damaged!, keyword: "Resist", value: 2 });
  });

  it("rejects an unpaid play without spending ink or applying abilities", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [edgarBalthazarLongsufferingButler],
      inkwell: 4,
    });
    expect(g.asPlayerOne().playCard(edgarBalthazarLongsufferingButler)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(edgarBalthazarLongsufferingButler)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(4);
    expect(g.getCardInstanceIdsInZone("play", PLAYER_ONE)).toHaveLength(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("stacks another Resist bonus and loses only the umbrella bonus after damage", () => {
    const grant = createMockAction({
      id: "edgar-extra-resist",
      name: "Extra Resist",
      cost: 0,
      abilities: [
        {
          type: "action",
          effect: {
            type: "gain-keyword",
            keyword: "Resist",
            value: 1,
            duration: "this-turn",
            target: "CHOSEN_CHARACTER",
          },
        },
      ],
    });
    const hit = createMockAction({
      id: "edgar-stack-hit",
      name: "Damage",
      cost: 0,
      abilities: [
        { type: "action", effect: { type: "deal-damage", amount: 4, target: "CHOSEN_CHARACTER" } },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [edgarBalthazarLongsufferingButler],
      hand: [grant, hit],
    });
    expect(
      g.asPlayerOne().playCard(grant, { targets: [edgarBalthazarLongsufferingButler] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveKeyword({
      card: edgarBalthazarLongsufferingButler,
      keyword: "Resist",
      value: 3,
    });
    expect(
      g.asPlayerOne().playCard(hit, { targets: [edgarBalthazarLongsufferingButler] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveDamage({ card: edgarBalthazarLongsufferingButler, value: 1 });
    expect(g.asPlayerOne()).toHaveKeyword({
      card: edgarBalthazarLongsufferingButler,
      keyword: "Resist",
      value: 1,
    });
  });

  it("moved damage bypasses Resist and removes only the destination's conditional bonus", () => {
    const source = createMockCharacter({
      id: "edgar-damage-source",
      name: "Source",
      cost: 1,
      willpower: 4,
    });
    const move = createMockAction({
      id: "edgar-move-damage",
      name: "Move Damage",
      cost: 0,
      abilities: [
        {
          type: "action",
          effect: {
            type: "move-damage",
            amount: 2,
            from: "CHOSEN_CHARACTER",
            to: "CHOSEN_OPPOSING_CHARACTER",
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: source, damage: 2 }], hand: [move] },
      { play: [edgarBalthazarLongsufferingButler] },
    );
    expect(
      g.asPlayerOne().playCard(move, { targets: [source, edgarBalthazarLongsufferingButler] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveDamage({ card: source, value: 0 });
    expect(g.asPlayerTwo()).toHaveDamage({ card: edgarBalthazarLongsufferingButler, value: 2 });
    expect(g.asPlayerTwo().hasKeyword(edgarBalthazarLongsufferingButler, "Resist")).toBe(false);
  });
  for (const amount of [1, 2, 3, 8]) {
    it(`reduces ${amount} effect damage while undamaged`, () => {
      const hit = createMockAction({
        id: `edgar-hit-${amount}`,
        name: "Damage",
        cost: 0,
        abilities: [
          { type: "action", effect: { type: "deal-damage", amount, target: "CHOSEN_CHARACTER" } },
        ],
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [edgarBalthazarLongsufferingButler],
        hand: [hit],
      });
      expect(
        g.asPlayerOne().playCard(hit, { targets: [edgarBalthazarLongsufferingButler] }),
      ).toBeSuccessfulCommand();
      if (amount === 8) {
        expect(g.asPlayerOne().getCardZone(edgarBalthazarLongsufferingButler)).toBe("discard");
      } else {
        expect(g.asPlayerOne()).toHaveDamage({
          card: edgarBalthazarLongsufferingButler,
          value: Math.max(0, amount - 2),
        });
        expect(g.asPlayerOne().hasKeyword(edgarBalthazarLongsufferingButler, "Resist")).toBe(
          amount <= 2,
        );
      }
    });
  }

  it("takes full damage while damaged and regains Resist only after complete healing", () => {
    const hit = createMockAction({
      id: "edgar-damaged-hit",
      name: "Damage",
      cost: 0,
      abilities: [
        { type: "action", effect: { type: "deal-damage", amount: 2, target: "CHOSEN_CHARACTER" } },
      ],
    });
    const heal = createMockAction({
      id: "edgar-heal",
      name: "Heal",
      cost: 0,
      abilities: [
        {
          type: "action",
          effect: { type: "remove-damage", amount: 2, target: "CHOSEN_CHARACTER" },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: edgarBalthazarLongsufferingButler, damage: 1 }],
      hand: [hit, heal, heal, hit],
    });
    const hits = g
      .getCardInstanceIdsInZone("hand", PLAYER_ONE)
      .filter((id) => g.getCardDefinitionId(id) === hit.id);
    const heals = g
      .getCardInstanceIdsInZone("hand", PLAYER_ONE)
      .filter((id) => g.getCardDefinitionId(id) === heal.id);
    expect(g.asPlayerOne().hasKeyword(edgarBalthazarLongsufferingButler, "Resist")).toBe(false);
    expect(
      g.asPlayerOne().playCard(hits[0]!, { targets: [edgarBalthazarLongsufferingButler] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveDamage({ card: edgarBalthazarLongsufferingButler, value: 3 });
    expect(
      g.asPlayerOne().playCard(heals[0]!, { targets: [edgarBalthazarLongsufferingButler] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveDamage({ card: edgarBalthazarLongsufferingButler, value: 1 });
    expect(g.asPlayerOne().hasKeyword(edgarBalthazarLongsufferingButler, "Resist")).toBe(false);
    expect(
      g.asPlayerOne().playCard(heals[1]!, { targets: [edgarBalthazarLongsufferingButler] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveDamage({ card: edgarBalthazarLongsufferingButler, value: 0 });
    expect(g.asPlayerOne()).toHaveKeyword({
      card: edgarBalthazarLongsufferingButler,
      keyword: "Resist",
      value: 2,
    });
    expect(
      g.asPlayerOne().playCard(hits[1]!, { targets: [edgarBalthazarLongsufferingButler] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveDamage({ card: edgarBalthazarLongsufferingButler, value: 0 });
  });

  it("put damage bypasses Resist and turns the umbrella off", () => {
    const put = createMockAction({
      id: "edgar-put",
      name: "Put damage",
      cost: 0,
      abilities: [
        { type: "action", effect: { type: "put-damage", amount: 1, target: "CHOSEN_CHARACTER" } },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [edgarBalthazarLongsufferingButler],
      hand: [put],
    });
    expect(
      g.asPlayerOne().playCard(put, { targets: [edgarBalthazarLongsufferingButler] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveDamage({ card: edgarBalthazarLongsufferingButler, value: 1 });
    expect(g.asPlayerOne().hasKeyword(edgarBalthazarLongsufferingButler, "Resist")).toBe(false);
  });

  it("opponent Edgar loses protection after the first hit without changing an undamaged copy", () => {
    const hit = createMockAction({
      id: "edgar-owner-hit",
      name: "Damage",
      cost: 0,
      abilities: [
        { type: "action", effect: { type: "deal-damage", amount: 3, target: "CHOSEN_CHARACTER" } },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [edgarBalthazarLongsufferingButler], hand: [hit, hit] },
      { play: [edgarBalthazarLongsufferingButler] },
    );
    const target = g.findCardInstanceId(edgarBalthazarLongsufferingButler, "play", "player_two");
    const hits = g.getCardInstanceIdsInZone("hand", PLAYER_ONE);
    expect(g.asPlayerOne().playCard(hits[0]!, { targets: [target] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo()).toHaveDamage({ card: target, value: 1 });
    expect(g.asPlayerTwo().hasKeyword(target, "Resist")).toBe(false);
    expect(g.asPlayerOne()).toHaveKeyword({
      card: edgarBalthazarLongsufferingButler,
      keyword: "Resist",
      value: 2,
    });
    expect(g.asPlayerOne().playCard(hits[1]!, { targets: [target] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo()).toHaveDamage({ card: target, value: 4 });
  });

  it("pays five to play, quests for two after drying, and can be inked normally", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [edgarBalthazarLongsufferingButler], inkwell: 5, deck: 3 },
      { deck: 3 },
    );
    expect(g.asPlayerOne().playCard(edgarBalthazarLongsufferingButler)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne()).toHaveKeyword({
      card: edgarBalthazarLongsufferingButler,
      keyword: "Resist",
      value: 2,
    });
    expect(g.asPlayerOne().quest(edgarBalthazarLongsufferingButler)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(edgarBalthazarLongsufferingButler)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(2);
    const ink = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [edgarBalthazarLongsufferingButler],
    });
    expect(
      ink.asPlayerOne().putIntoInkwell(PLAYER_ONE, edgarBalthazarLongsufferingButler),
    ).toBeSuccessfulCommand();
    expect(ink.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(ink.asPlayerOne().getCardZone(edgarBalthazarLongsufferingButler)).toBe("inkwell");
  });
  it("gains Resist +2 while he has no damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [edgarBalthazarLongsufferingButler],
      deck: 1,
    });

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: edgarBalthazarLongsufferingButler,
      keyword: "Resist",
      value: 2,
    });
  });

  it("deals 2 less challenge damage while undamaged, then loses Resist once damaged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: edgarBalthazarLongsufferingButler, exerted: true }],
        deck: 1,
      },
      {
        play: [{ card: strongOpponent, isDrying: false }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(strongOpponent, edgarBalthazarLongsufferingButler),
    ).toBeSuccessfulCommand();

    // 5 damage dealt minus Resist +2.
    expect(testEngine.asPlayerOne()).toHaveDamage({
      card: edgarBalthazarLongsufferingButler,
      value: 3,
    });
    expect(testEngine.asPlayerOne().hasKeyword(edgarBalthazarLongsufferingButler, "Resist")).toBe(
      false,
    );
  });
});
