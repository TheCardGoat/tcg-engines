// CR 1.2.1, 3.2.1.1: printed restriction applies only to the next Ready step.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { taVictoriaDisapprovingAncestor } from "./042-tia-victoria-disapproving-ancestor";

const chosenThug = createMockCharacter({
  id: "tia-test-chosen-thug",
  name: "Alley Thug",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const otherThug = createMockCharacter({
  id: "tia-test-other-thug",
  name: "Rooftop Lookout",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Tía Victoria - Disapproving Ancestor", () => {
  it("uses the target owner's next start when player two plays it and expires one round later", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [chosenThug, otherThug], deck: 6 },
      { hand: [taVictoriaDisapprovingAncestor], inkwell: 6, deck: 6 },
    );
    expect(engine.asPlayerOne().quest(chosenThug)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().quest(otherThug)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(taVictoriaDisapprovingAncestor)).toBeSuccessfulCommand();
    expect(
      engine
        .asPlayerTwo()
        .resolvePendingByCard(taVictoriaDisapprovingAncestor, { targets: [chosenThug] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.isExerted(chosenThug)).toBe(true);
    expect(
      engine
        .asServer()
        .getMoveLogHistory()
        .flatMap((log) => log.public),
    ).toContainEqual({
      key: "lorcana.outcome.nextStartReadyBlocked",
      values: {
        sourceId: engine.findCardInstanceId(taVictoriaDisapprovingAncestor, "play", PLAYER_TWO),
        targetId: engine.findCardInstanceId(chosenThug, "play"),
      },
    });
    expect(engine.isExerted(otherThug)).toBe(false);
    expect(engine.asPlayerOne().quest(chosenThug)).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.isExerted(chosenThug)).toBe(false);
    expect(engine.asPlayerOne().quest(chosenThug)).toBeSuccessfulCommand();
  });
  it("keeps the chosen opposing character exerted at the start of its controller's next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [taVictoriaDisapprovingAncestor],
        inkwell: taVictoriaDisapprovingAncestor.cost,
        deck: 2,
      },
      {
        play: [
          { card: chosenThug, exerted: true },
          { card: otherThug, exerted: true },
        ],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(taVictoriaDisapprovingAncestor, {
        targets: [chosenThug],
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(taVictoriaDisapprovingAncestor, {
        targets: [chosenThug],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // The chosen thug could not ready at the start of its controller's turn.
    expect(testEngine.asPlayerTwo().isExerted(chosenThug)).toBe(true);
  });

  it("leaves unchosen opposing characters free to ready as normal", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [taVictoriaDisapprovingAncestor],
        inkwell: taVictoriaDisapprovingAncestor.cost,
        deck: 2,
      },
      {
        play: [
          { card: chosenThug, exerted: true },
          { card: otherThug, exerted: true },
        ],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(taVictoriaDisapprovingAncestor, {
        targets: [chosenThug],
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(taVictoriaDisapprovingAncestor, {
        targets: [chosenThug],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().isExerted(otherThug)).toBe(false);
  });

  it("frees the chosen character to ready again on the following turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [taVictoriaDisapprovingAncestor],
        inkwell: taVictoriaDisapprovingAncestor.cost,
        deck: 2,
      },
      {
        play: [{ card: chosenThug, exerted: true }],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(taVictoriaDisapprovingAncestor, {
        targets: [chosenThug],
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(taVictoriaDisapprovingAncestor, {
        targets: [chosenThug],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().isExerted(chosenThug)).toBe(true);

    // One full round later the restriction has expired.
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().isExerted(chosenThug)).toBe(false);
  });
  it("does not exert a ready target and rejects choosing your own character", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [taVictoriaDisapprovingAncestor], play: [otherThug], inkwell: 6, deck: [] },
      { play: [chosenThug], deck: [] },
    );
    expect(engine.asPlayerOne().playCard(taVictoriaDisapprovingAncestor)).toBeSuccessfulCommand();
    expect(
      engine
        .asPlayerOne()
        .resolvePendingByCard(taVictoriaDisapprovingAncestor, { targets: [otherThug] }),
    ).not.toBeSuccessfulCommand();
    expect(
      engine
        .asPlayerOne()
        .resolvePendingByCard(taVictoriaDisapprovingAncestor, { targets: [chosenThug] }),
    ).toBeSuccessfulCommand();
    expect(engine.isExerted(chosenThug)).toBe(false);
  });

  it("allows effect-based readying during the target's next main phase", () => {
    const ready = createMockAction({
      id: "tia-ready-action",
      name: "Ready",
      cost: 0,
      text: "Ready chosen character.",
      abilities: [{ type: "action", effect: { type: "ready", target: "CHOSEN_CHARACTER" } }],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [taVictoriaDisapprovingAncestor], inkwell: 6, deck: 2 },
      { play: [{ card: chosenThug, exerted: true }], hand: [ready], deck: 2 },
    );
    expect(engine.asPlayerOne().playCard(taVictoriaDisapprovingAncestor)).toBeSuccessfulCommand();
    expect(
      engine
        .asPlayerOne()
        .resolvePendingByCard(taVictoriaDisapprovingAncestor, { targets: [chosenThug] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.isExerted(chosenThug)).toBe(true);
    expect(engine.asPlayerTwo().playCard(ready, { targets: [chosenThug] })).toBeSuccessfulCommand();
    expect(engine.isExerted(chosenThug)).toBe(false);
    expect(engine.asPlayerTwo().quest(chosenThug)).toBeSuccessfulCommand();
  });

  it("keeps the next-start restriction after its source leaves play", () => {
    const banish = createMockAction({
      id: "tia-banish-source",
      name: "Banish",
      cost: 0,
      text: "Banish chosen character.",
      abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_CHARACTER" } }],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [taVictoriaDisapprovingAncestor, banish], inkwell: 6, deck: 2 },
      { play: [{ card: chosenThug, exerted: true }], deck: 2 },
    );
    expect(engine.asPlayerOne().playCard(taVictoriaDisapprovingAncestor)).toBeSuccessfulCommand();
    expect(
      engine
        .asPlayerOne()
        .resolvePendingByCard(taVictoriaDisapprovingAncestor, { targets: [chosenThug] }),
    ).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().playCard(banish, { targets: [taVictoriaDisapprovingAncestor] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(taVictoriaDisapprovingAncestor)).toBe("discard");
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.isExerted(chosenThug)).toBe(true);
  });
});
