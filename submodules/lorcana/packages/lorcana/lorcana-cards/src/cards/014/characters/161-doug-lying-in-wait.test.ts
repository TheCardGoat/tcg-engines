import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { dougLyingInWait } from "./161-doug-lying-in-wait";

const ally = createMockCharacter({
  id: "doug-lying-in-wait-ally",
  name: "Plain Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const targetedAction = createMockAction({
  id: "doug-lying-in-wait-targeted-action",
  name: "Targeted Action",
  cost: 2,
  text: "Deal 3 damage to chosen character.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 3,
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
});

// CR 8.15.1: only opponents cannot choose Ward. CR 8.15.2: nonchosen effects still apply.
describe("Doug - Lying in Wait", () => {
  for (const controller of [PLAYER_ONE, PLAYER_TWO]) {
    it(`Ward does not stop all-opposing damage controlled by ${controller}`, () => {
      const allDamage = createMockAction({
        id: "doug-all-damage",
        name: "All Damage",
        cost: 2,
        abilities: [
          {
            type: "action",
            effect: {
              type: "deal-damage",
              amount: 2,
              target: {
                selector: "all",
                count: "all",
                owner: "opponent",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
          },
        ],
      });
      const acting = { hand: [allDamage], inkwell: 2, play: [dougLyingInWait], deck: 3 };
      const defending = { play: [dougLyingInWait, ally], deck: 3 };
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        controller === PLAYER_ONE ? acting : defending,
        controller === PLAYER_ONE ? defending : acting,
      );
      const opponent = controller === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
      const ownDoug = g.findCardInstanceId(dougLyingInWait, "play", controller);
      const opposingDoug = g.findCardInstanceId(dougLyingInWait, "play", opponent);
      const opposingAlly = g.findCardInstanceId(ally, "play", opponent);
      if (controller === PLAYER_TWO) expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      const actor = controller === PLAYER_ONE ? g.asPlayerOne() : g.asPlayerTwo();
      expect(actor.playCard(allDamage)).toBeSuccessfulCommand();
      expect(actor.getCard(opposingDoug).damage).toBe(2);
      expect(actor.getCard(opposingAlly).damage).toBe(2);
      expect(actor.getCard(ownDoug).damage).toBe(0);
      expect(actor.getCardZone(opposingDoug)).toBe("play");
      expect(g.asServer().getAvailableInk(controller)).toBe(0);
    });
  }

  it("player two cannot target opposing Doug but can target their own Doug", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [dougLyingInWait], deck: 3 },
      { play: [dougLyingInWait], hand: [targetedAction], inkwell: 2, deck: 3 },
    );
    const enemyId = g.findCardInstanceId(dougLyingInWait, "play", PLAYER_ONE);
    const ownId = g.findCardInstanceId(dougLyingInWait, "play", PLAYER_TWO);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().playCard(targetedAction, { targets: [enemyId] }),
    ).not.toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(g.asPlayerTwo().getCardZone(targetedAction)).toBe("hand");
    expect(g.asPlayerOne().getCard(enemyId).damage).toBe(0);
    expect(g.asPlayerTwo().playCard(targetedAction, { targets: [ownId] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCard(ownId).damage).toBe(3);
    expect(g.asPlayerOne().getCard(enemyId).damage).toBe(0);
  });

  it("normal entry pays four ink, retains Ward and cannot quest while drying", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [dougLyingInWait],
      inkwell: 4,
      deck: 3,
    });
    expect(g.asPlayerOne().playCard(dougLyingInWait)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().hasKeyword(dougLyingInWait, "Ward")).toBe(true);
    expect(g.asPlayerOne().quest(dougLyingInWait)).not.toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(0);
  });

  it("three ink cannot pay for Doug and leaves the hand and ink unchanged", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [dougLyingInWait],
      inkwell: 3,
      deck: 3,
    });
    expect(g.asPlayerOne().playCard(dougLyingInWait)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(dougLyingInWait)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(3);
  });

  it("Doug can be inked for one ready ink", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [dougLyingInWait], deck: 3 });
    expect(g.asPlayerOne().putIntoInkwell(PLAYER_ONE, dougLyingInWait)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(dougLyingInWait)).toBe("inkwell");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
  });

  it("rejects opposing targeted damage without payment and allows an unwarded retry", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [targetedAction], inkwell: 2, deck: 3 },
      { play: [dougLyingInWait, ally], deck: 3 },
    );
    expect(
      g.asPlayerOne().playCard(targetedAction, { targets: [dougLyingInWait] }),
    ).not.toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.asPlayerOne().getCardZone(targetedAction)).toBe("hand");
    expect(g.asPlayerTwo().getCard(dougLyingInWait).damage).toBe(0);
    expect(g.asPlayerOne().playCard(targetedAction, { targets: [ally] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(ally)).toBe("discard");
    expect(g.asPlayerTwo().getCardZone(dougLyingInWait)).toBe("play");
  });

  it("Ward permits its controller to target Doug", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [dougLyingInWait],
      hand: [targetedAction],
      inkwell: 2,
      deck: 3,
    });
    expect(
      g.asPlayerOne().playCard(targetedAction, { targets: [dougLyingInWait] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCard(dougLyingInWait).damage).toBe(3);
    expect(g.asPlayerOne().getCardZone(dougLyingInWait)).toBe("play");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("has Ward and keeps challenging legal (challenge is allowed on a Ward character)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: dougLyingInWait, exerted: true }],
        deck: 1,
      },
      {
        play: [{ card: ally, isDrying: false }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().hasKeyword(dougLyingInWait, "Ward")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().challenge(ally, dougLyingInWait)).toBeSuccessfulCommand();
  });

  it("cannot be chosen by an opponent's targeted effect while an unwarded target exists", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [targetedAction],
        inkwell: targetedAction.cost,
        deck: 1,
      },
      {
        play: [ally, dougLyingInWait],
        deck: 1,
      },
    );

    const playMove = testEngine
      .asPlayerOne()
      .getAvailableMoves()
      .find((move) => move.moveId === "playCard");
    expect(playMove).toBeDefined();

    const options = testEngine
      .asPlayerOne()
      .getMoveOptions("playCard", playMove!.selectableCardIds[0]);

    // Only the unwarded ally is a legal target; Doug is protected by Ward.
    expect(options).toHaveLength(1);
    expect(options[0]?.kind).toBe("card");
  });
});
