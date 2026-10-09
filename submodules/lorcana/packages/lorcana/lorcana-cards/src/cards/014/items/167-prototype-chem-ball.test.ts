// Rules grounding: Prototype Chem Ball (set14-167).
// Destabilize {E}, 2 {I} — Banish this item. Enigma Burst — During your turn,
// when this item is banished, you may get 1 ink drop. If you do, chosen
// character of yours gains Resist +1 until the start of your next turn.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { prototypeChemBall } from "./167-prototype-chem-ball";

const defender = createMockCharacter({
  id: "prototype-defender",
  name: "Prototype Defender",
  cost: 3,
  strength: 1,
  willpower: 6,
});

const attacker = createMockCharacter({
  id: "prototype-attacker",
  name: "Prototype Attacker",
  cost: 3,
  strength: 3,
  willpower: 6,
});

describe("Prototype Chem Ball", () => {
  it("the gained drop pays for a card without removing granted Resist", () => {
    const purchase = createMockCharacter({
      id: "prototype-drop-purchase",
      name: "Purchase",
      cost: 1,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [prototypeChemBall, defender],
      hand: [purchase],
      inkwell: 2,
      deck: 6,
    });
    expect(
      g.asPlayerOne().activateAbility(prototypeChemBall, { ability: "Destabilize" }),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(prototypeChemBall, { resolveOptional: true, targets: [defender] }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().playCard(purchase, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(purchase)).toBe("play");
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne()).toHaveKeyword({ card: defender, keyword: "Resist", value: 1 });
  });

  it("normal play pays one ink without granting a drop or Resist", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [prototypeChemBall],
      inkwell: 1,
      play: [defender],
    });
    expect(g.asPlayerOne().playCard(prototypeChemBall)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(prototypeChemBall)).toBe("play");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne()).not.toHaveKeyword({ card: defender, keyword: "Resist" });
  });

  it("ordinary inking adds ready ink without the banish trigger", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [prototypeChemBall],
      play: [defender],
    });
    expect(g.asPlayerOne().putIntoInkwell(PLAYER_ONE, prototypeChemBall)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne()).not.toHaveKeyword({ card: defender, keyword: "Resist" });
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  const damage = createMockAction({
    id: "prototype-damage",
    name: "Damage",
    cost: 0,
    abilities: [
      { type: "action", effect: { type: "deal-damage", amount: 3, target: "CHOSEN_CHARACTER" } },
    ],
  });
  const banish = createMockAction({
    id: "prototype-banish",
    name: "Banish",
    cost: 0,
    abilities: [
      {
        type: "action",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
        },
      },
    ],
  });

  it("Resist stacks with printed Resist and reduces action damage", () => {
    const resistant = createMockCharacter({
      id: "prototype-resistant",
      name: "Resistant",
      cost: 2,
      willpower: 6,
      abilities: [{ type: "keyword", keyword: "Resist", value: 1 }],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [damage],
      inkwell: 2,
      play: [prototypeChemBall, resistant],
    });
    expect(
      g.asPlayerOne().activateAbility(prototypeChemBall, { ability: "Destabilize" }),
    ).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(prototypeChemBall, { resolveOptional: true, targets: [resistant] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveKeyword({ card: resistant, keyword: "Resist", value: 2 });
    expect(g.asPlayerOne().playCard(damage, { targets: [resistant] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(resistant)).toBe(1);
  });

  it("another card banishing the item on your turn triggers Enigma Burst", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [banish],
      play: [prototypeChemBall, defender],
    });
    expect(
      g.asPlayerOne().playCard(banish, { targets: [prototypeChemBall] }),
    ).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(prototypeChemBall, { resolveOptional: true, targets: [defender] }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne()).toHaveKeyword({ card: defender, keyword: "Resist", value: 1 });
  });

  it("separate externally banished copies each stack Resist once on the selected character", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [banish, banish],
      play: [prototypeChemBall, prototypeChemBall, defender],
      deck: 3,
    });
    const sources = g
      .getCardInstanceIdsInZone("play", PLAYER_ONE)
      .filter((id) => g.getCardDefinitionId(id) === prototypeChemBall.id);
    const actions = g.getCardInstanceIdsInZone("hand", PLAYER_ONE);
    for (const [index, source] of sources.entries()) {
      expect(
        g.asPlayerOne().playCard(actions[index]!, { targets: [source] }),
      ).toBeSuccessfulCommand();
      expect(
        g
          .asPlayerOne()
          .resolvePendingByCard(source, { resolveOptional: true, targets: [defender] }),
      ).toBeSuccessfulCommand();
      expect(g.getInkDrops(PLAYER_ONE)).toBe(index + 1);
      expect(g.asPlayerOne()).toHaveKeyword({
        card: defender,
        keyword: "Resist",
        value: index + 1,
      });
      expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    }
  });

  it("opponent-turn banishment does not grant Resist or an ink drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [prototypeChemBall, defender], deck: [defender, defender] },
      { hand: [banish], deck: [attacker, attacker] },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().playCard(banish, { targets: [prototypeChemBall] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(prototypeChemBall)).toBe("discard");
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne()).not.toHaveKeyword({ card: defender, keyword: "Resist" });
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(prototypeChemBall, { resolveOptional: true, targets: [defender] }),
    ).not.toBeSuccessfulCommand();
  });

  it("player two grants Resist only to its selected duplicate and gains its own drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: [attacker, attacker] },
      { play: [prototypeChemBall, defender, defender], inkwell: 2, deck: [attacker, attacker] },
    );
    const [selected, untouched] = g
      .getCardInstanceIdsInZone("play", PLAYER_TWO)
      .filter((id) => g.getCardDefinitionId(id) === defender.id);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().activateAbility(prototypeChemBall, { ability: "Destabilize" }),
    ).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(prototypeChemBall, { resolveOptional: true, targets: [selected!] }),
    ).not.toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(g.asPlayerTwo()).not.toHaveKeyword({ card: selected!, keyword: "Resist" });
    expect(
      g
        .asPlayerTwo()
        .resolvePendingByCard(prototypeChemBall, { resolveOptional: true, targets: [selected!] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo()).toHaveKeyword({ card: selected!, keyword: "Resist", value: 1 });
    expect(g.asPlayerTwo()).not.toHaveKeyword({ card: untouched!, keyword: "Resist" });
    expect(g.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("rejects opposing character choice then grants Resist to the friendly character", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { inkwell: 3, play: [prototypeChemBall, defender] },
      { play: [attacker] },
    );
    expect(
      g.asPlayerOne().activateAbility(prototypeChemBall, { ability: "Destabilize" }),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(prototypeChemBall, { resolveOptional: true, targets: [attacker] }),
    ).not.toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(prototypeChemBall, { resolveOptional: true, targets: [defender] }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne()).toHaveKeyword({ card: defender, keyword: "Resist", value: 1 });
    expect(g.asPlayerTwo()).not.toHaveKeyword({ card: attacker, keyword: "Resist" });
  });

  it("accepting without a friendly character still grants one drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { inkwell: 2, play: [prototypeChemBall] },
      { play: [attacker] },
    );
    expect(
      g.asPlayerOne().activateAbility(prototypeChemBall, { ability: "Destabilize" }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(prototypeChemBall, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerTwo()).not.toHaveKeyword({ card: attacker, keyword: "Resist" });
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("exerted item cannot activate or spend ink", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 2,
      play: [{ card: prototypeChemBall, exerted: true }, defender],
    });
    expect(
      g.asPlayerOne().activateAbility(prototypeChemBall, { ability: "Destabilize" }),
    ).not.toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.asPlayerOne().getCardZone(prototypeChemBall)).toBe("play");
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("Destabilize — banishes this item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 2,
      play: [prototypeChemBall, defender],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(prototypeChemBall, {
        ability: "Destabilize",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(prototypeChemBall)).toBe("discard");
  });

  it("Enigma Burst — accepting gets 1 ink drop and Resist +1 reduces challenge damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 2,
        play: [prototypeChemBall, { card: defender, exerted: true, isDrying: false }],
      },
      {
        play: [{ card: attacker, isDrying: false }],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(prototypeChemBall, {
        ability: "Destabilize",
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(prototypeChemBall, {
        resolveOptional: true,
        targets: [defender],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);

    // Priority passes to the opponent, whose attacker with 3 {S} hits the
    // Resist +1 defender for 2.
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().challenge(attacker, defender)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(defender)).toBe(2);
  });

  it("Enigma Burst — declining grants no Resist and full damage applies", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 2,
        play: [prototypeChemBall, { card: defender, exerted: true, isDrying: false }],
      },
      {
        play: [{ card: attacker, isDrying: false }],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(prototypeChemBall, {
        ability: "Destabilize",
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(prototypeChemBall, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().challenge(attacker, defender)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(defender)).toBe(3);
  });

  it("Enigma Burst — Resist +1 expires at the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 2,
        play: [prototypeChemBall, { card: defender, exerted: true, isDrying: false }],
      },
      {
        play: [{ card: attacker, isDrying: false }],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(prototypeChemBall, {
        ability: "Destabilize",
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(prototypeChemBall, {
        resolveOptional: true,
        targets: [defender],
      }),
    ).toBeSuccessfulCommand();

    // Resist +1 lasts until the start of your next turn, so it is still up
    // during the opponent's turn: the challenge deals only 2.
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().challenge(attacker, defender)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(defender)).toBe(2);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Start of your next turn has passed (Resist +1 expired). Re-exert the
    // defender and pass so the opponent can challenge again.
    expect(testEngine.asPlayerOne().quest(defender)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().challenge(attacker, defender)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(defender)).toBe(2 + 3);
  });

  it("negative — Destabilize requires 2 ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [prototypeChemBall, defender],
    });

    const result = testEngine.asPlayerOne().activateAbility(prototypeChemBall, {
      ability: "Destabilize",
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(prototypeChemBall)).toBe("play");
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
  });
});
