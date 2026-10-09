// Rules grounding: Blinding Chem Ball (set14-166).
// Destabilize {E}, 2 {I} — Banish this item. Brilliant Burst — During your
// turn, when this item is banished, you may get 1 ink drop. If you do, chosen
// character gets -2 {S} this turn.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { blindingChemBall } from "./166-blinding-chem-ball";

const victim = createMockCharacter({
  id: "chem-ball-victim",
  name: "Chem Ball Victim",
  cost: 3,
  strength: 5,
  willpower: 5,
});

describe("Blinding Chem Ball", () => {
  it("the gained drop pays for a card without ending the strength penalty", () => {
    const purchase = createMockCharacter({
      id: "blinding-drop-purchase",
      name: "Purchase",
      cost: 1,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [blindingChemBall, victim],
      hand: [purchase],
      inkwell: 2,
      deck: 6,
    });
    expect(
      g.asPlayerOne().activateAbility(blindingChemBall, { ability: "Destabilize" }),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(blindingChemBall, { resolveOptional: true, targets: [victim] }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().playCard(purchase, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(purchase)).toBe("play");
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getCard(victim).strength).toBe(3);
  });

  it("the suspended target prompt retains Brilliant Burst ability index", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [blindingChemBall, victim],
      inkwell: 2,
    });
    expect(
      g.asPlayerOne().activateAbility(blindingChemBall, { ability: "Destabilize" }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(blindingChemBall, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getPendingEffects()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ payload: expect.objectContaining({ abilityIndex: 1 }) }),
      ]),
    );
  });

  it("rejects an opposing Ward target then accepts a friendly Ward target", () => {
    const ward = createMockCharacter({
      id: "chem-ward",
      name: "Ward",
      cost: 2,
      strength: 4,
      abilities: [{ type: "keyword", keyword: "Ward" }],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [blindingChemBall, ward], inkwell: 2 },
      { play: [ward] },
    );
    const friendly = g.findCardInstanceId(ward, "play", PLAYER_ONE);
    const opposing = g.findCardInstanceId(ward, "play", PLAYER_TWO);
    expect(
      g.asPlayerOne().activateAbility(blindingChemBall, { ability: "Destabilize" }),
    ).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(blindingChemBall, { resolveOptional: true, targets: [opposing] }),
    ).not.toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(blindingChemBall, { resolveOptional: true, targets: [friendly] }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getCard(friendly).strength).toBe(2);
    expect(g.asPlayerTwo().getCard(opposing).strength).toBe(4);
  });

  it("only the selected duplicate character gets the penalty", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [blindingChemBall, victim, victim],
      inkwell: 2,
    });
    const [selected, untouched] = g
      .getCardInstanceIdsInZone("play", PLAYER_ONE)
      .filter((id) => g.getCardDefinitionId(id) === victim.id);
    expect(
      g.asPlayerOne().activateAbility(blindingChemBall, { ability: "Destabilize" }),
    ).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(blindingChemBall, { resolveOptional: true, targets: [selected!] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCard(selected!).strength).toBe(3);
    expect(g.asPlayerOne().getCard(untouched!).strength).toBe(5);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("normal entry pays one ink without granting a drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [blindingChemBall],
      inkwell: 1,
    });
    expect(g.asPlayerOne().playCard(blindingChemBall)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(blindingChemBall)).toBe("play");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("normal inking grants ready ink without Brilliant Burst", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [blindingChemBall] });
    expect(g.asPlayerOne().putIntoInkwell(PLAYER_ONE, blindingChemBall)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("accepting with no character still gains the ink drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [blindingChemBall],
      inkwell: 2,
    });
    expect(
      g.asPlayerOne().activateAbility(blindingChemBall, { ability: "Destabilize" }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(blindingChemBall, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getCardZone(blindingChemBall)).toBe("discard");
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  const banishItem = createMockAction({
    id: "chem-ball-banish",
    name: "Banish Item",
    cost: 1,
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

  it("another card banishing this item during your turn triggers Brilliant Burst", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [banishItem],
      inkwell: 1,
      play: [blindingChemBall, victim],
    });
    expect(
      g.asPlayerOne().playCard(banishItem, { targets: [blindingChemBall] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(blindingChemBall)).toBe("discard");
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(blindingChemBall, { resolveOptional: true, targets: [victim] }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getCard(victim).strength).toBe(3);
  });

  it("external banishment triggers only the exact banished copy", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [banishItem],
      play: [blindingChemBall, blindingChemBall, victim],
      inkwell: 1,
    });
    const [first, second] = g
      .getCardInstanceIdsInZone("play", PLAYER_ONE)
      .filter((id) => g.getCardDefinitionId(id) === blindingChemBall.id);
    expect(g.asPlayerOne().playCard(banishItem, { targets: [second!] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(first!)).toBe("play");
    expect(g.asPlayerOne().getCardZone(second!)).toBe("discard");
    expect(
      g.asPlayerOne().resolvePendingByCard(second!, { resolveOptional: true, targets: [victim] }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getCard(victim).strength).toBe(3);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(
      g.asPlayerOne().resolvePendingByCard(first!, { resolveOptional: true, targets: [victim] }),
    ).not.toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("banishment during the opponent turn gives no drop or penalty", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [blindingChemBall, victim], deck: [victim, victim] },
      { hand: [banishItem], inkwell: 1, deck: [victim, victim] },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().playCard(banishItem, { targets: [blindingChemBall] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(blindingChemBall)).toBe("discard");
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(g.asPlayerOne().getCard(victim).strength).toBe(5);
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(blindingChemBall, { resolveOptional: true, targets: [victim] }),
    ).not.toBeSuccessfulCommand();
  });

  it("player two chooses an opposing character and receives the drop on their own turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [victim], deck: [victim, victim] },
      { play: [blindingChemBall], inkwell: 2, deck: [victim, victim] },
    );
    const target = g.findCardInstanceId(victim, "play", PLAYER_ONE);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().activateAbility(blindingChemBall, { ability: "Destabilize" }),
    ).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(blindingChemBall, { resolveOptional: true, targets: [target] }),
    ).not.toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(g.asPlayerOne().getCard(target).strength).toBe(5);
    expect(
      g
        .asPlayerTwo()
        .resolvePendingByCard(blindingChemBall, { resolveOptional: true, targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getCard(target).strength).toBe(3);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCard(target).strength).toBe(5);
    expect(g.getInkDrops(PLAYER_TWO)).toBe(1);
  });

  it("the strength penalty ends this turn while the gained ink drop persists", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { inkwell: 3, play: [blindingChemBall, victim], deck: [victim, victim] },
      { deck: [victim, victim] },
    );
    expect(
      g.asPlayerOne().activateAbility(blindingChemBall, { ability: "Destabilize" }),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(blindingChemBall, { resolveOptional: true, targets: [victim] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCard(victim).strength).toBe(3);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCard(victim).strength).toBe(5);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asServer().getWinner()).toBeUndefined();
  });

  it("an exerted item cannot pay Destabilize", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 2,
      play: [{ card: blindingChemBall, exerted: true }, victim],
    });
    expect(
      g.asPlayerOne().activateAbility(blindingChemBall, { ability: "Destabilize" }),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(blindingChemBall)).toBe("play");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("Destabilize — banishes this item and costs 2 ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 2,
      play: [blindingChemBall, victim],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(blindingChemBall, {
        ability: "Destabilize",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(blindingChemBall)).toBe("discard");
  });

  it("Brilliant Burst — accepting gets 1 ink drop and gives chosen character -2 {S}", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 2,
      play: [blindingChemBall, victim],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(blindingChemBall, {
        ability: "Destabilize",
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(blindingChemBall, {
        resolveOptional: true,
        targets: [victim],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne().getCard(victim).strength).toBe(3);
  });

  it("Brilliant Burst — declining gets no ink drop and no strength penalty", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 2,
      play: [blindingChemBall, victim],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(blindingChemBall, {
        ability: "Destabilize",
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(blindingChemBall, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().getCard(victim).strength).toBe(5);
  });

  it("negative — Destabilize requires 2 ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [blindingChemBall, victim],
    });

    const result = testEngine.asPlayerOne().activateAbility(blindingChemBall, {
      ability: "Destabilize",
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(blindingChemBall)).toBe("play");
    expect(testEngine.asPlayerOne().isExerted(blindingChemBall)).toBe(false);
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
  });
});
