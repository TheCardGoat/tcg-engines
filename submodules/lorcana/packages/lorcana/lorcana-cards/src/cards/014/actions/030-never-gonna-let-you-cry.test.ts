import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import {
  arielOnHumanLegs,
  aladdinPrinceAli,
  arielSpectacularSinger,
  cinderellaGentleAndKind,
  healingGlow,
  simbaProtectiveCub,
} from "../../001";
import { neverGonnaLetYouCry } from "./030-never-gonna-let-you-cry";

const thirdCheapCharacter = createMockCharacter({
  id: "nglyc-third-cheap",
  name: "Third Cheap Character",
  cost: 2,
});

describe("Never Gonna Let You Cry", () => {
  it("returns up to 2 character cards with cost 2 or less from your discard to your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [neverGonnaLetYouCry],
      inkwell: neverGonnaLetYouCry.cost,
      discard: [simbaProtectiveCub, aladdinPrinceAli, arielOnHumanLegs, healingGlow],
      deck: [],
    });

    expect(testEngine.asPlayerOne().playCard(neverGonnaLetYouCry)).toBeSuccessfulCommand();

    // The engine asks which eligible cards to return; take both.
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [simbaProtectiveCub, aladdinPrinceAli],
      }),
    ).toBeSuccessfulCommand();

    // Both eligible characters (cost 2) come back; cost-4 character and the
    // action stay in the discard.
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(aladdinPrinceAli)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(healingGlow)).toBe("discard");
  });

  it("returns fewer than 2 when the controller chooses so ('up to 2')", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [neverGonnaLetYouCry],
      inkwell: neverGonnaLetYouCry.cost,
      discard: [simbaProtectiveCub, aladdinPrinceAli, thirdCheapCharacter],
      deck: [],
    });

    expect(testEngine.asPlayerOne().playCard(neverGonnaLetYouCry)).toBeSuccessfulCommand();

    // Three eligible characters exceed the cap of 2, so the engine asks for a
    // selection; choose only one.
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [simbaProtectiveCub],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(aladdinPrinceAli)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(thirdCheapCharacter)).toBe("discard");
  });

  it("returns nothing when the discard holds no eligible character cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [neverGonnaLetYouCry],
      inkwell: neverGonnaLetYouCry.cost,
      discard: [arielOnHumanLegs, healingGlow],
      deck: [],
    });

    expect(testEngine.asPlayerOne().playCard(neverGonnaLetYouCry)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(healingGlow)).toBe("discard");
  });

  it("can be sung for free with Sing Together 5", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [neverGonnaLetYouCry],
      inkwell: 0,
      play: [cinderellaGentleAndKind, arielSpectacularSinger],
      discard: [simbaProtectiveCub, aladdinPrinceAli],
      deck: [],
    });

    expect(
      testEngine
        .asPlayerOne()
        .playSongTogether(neverGonnaLetYouCry, [cinderellaGentleAndKind, arielSpectacularSinger]),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(cinderellaGentleAndKind)).toBe(true);
    expect(testEngine.asPlayerOne().isExerted(arielSpectacularSinger)).toBe(true);

    // The song's effect still resolves: both eligible characters return.
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [simbaProtectiveCub, aladdinPrinceAli],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(aladdinPrinceAli)).toBe("hand");
  });

  it("costs 5 ink to play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [neverGonnaLetYouCry],
      inkwell: neverGonnaLetYouCry.cost - 1,
      deck: [],
    });

    expect(testEngine.asPlayerOne().playCard(neverGonnaLetYouCry)).toMatchObject({
      success: false,
    });
    expect(testEngine.asPlayerOne().getCardZone(neverGonnaLetYouCry)).toBe("hand");
  });
  it("can return zero eligible cards", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [neverGonnaLetYouCry],
      inkwell: 5,
      discard: [simbaProtectiveCub],
      deck: 3,
    });
    expect(engine.asPlayerOne().playCard(neverGonnaLetYouCry)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().resolveNextPending({ targets: [] })).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("discard");
    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("rejects more than two cards and illegal cost, type, zone or owner", () => {
    const costly = createMockCharacter({ id: "nglyc-three-cost", name: "Three Cost", cost: 3 });
    const opposing = createMockCharacter({ id: "nglyc-opponent", name: "Opponent", cost: 2 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [neverGonnaLetYouCry],
        inkwell: 5,
        play: [arielSpectacularSinger],
        discard: [simbaProtectiveCub, aladdinPrinceAli, thirdCheapCharacter, costly, healingGlow],
        deck: 3,
      },
      { discard: [opposing], deck: 3 },
    );
    expect(engine.asPlayerOne().playCard(neverGonnaLetYouCry)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolveNextPending({
        targets: [simbaProtectiveCub, aladdinPrinceAli, thirdCheapCharacter],
      }),
    ).not.toBeSuccessfulCommand();
    for (const target of [costly, healingGlow, arielSpectacularSinger, opposing])
      expect(
        engine.asPlayerOne().resolveNextPending({ targets: [target] }),
      ).not.toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolveNextPending({ targets: [thirdCheapCharacter] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(thirdCheapCharacter)).toBe("hand");
  });

  it("requires the printed Sing Together total, accepting exactly 5 and rejecting 4", () => {
    for (const total of [4, 5]) {
      const singerA = createMockCharacter({
        id: `boundary-a-${total}`,
        name: "Boundary A",
        cost: total - 1,
      });
      const singerB = createMockCharacter({
        id: `boundary-b-${total}`,
        name: "Boundary B",
        cost: 1,
      });
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [neverGonnaLetYouCry],
        play: [singerA, singerB],
        deck: [],
      });
      const result = engine.asPlayerOne().playSongTogether(neverGonnaLetYouCry, [singerA, singerB]);
      if (total === 5) expect(result).toBeSuccessfulCommand();
      else {
        expect(result).not.toBeSuccessfulCommand();
        expect(engine.isExerted(singerA)).toBe(false);
        expect(engine.isExerted(singerB)).toBe(false);
      }
    }
  });
  it("player two sings and chooses one own card without returning the unchosen card", () => {
    const singer = createMockCharacter({ id: "nglyc-p2-singer", name: "Singer", cost: 5 });
    const ownCheap = createMockCharacter({ id: "nglyc-p2-cheap", name: "Own Cheap", cost: 1 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { discard: [thirdCheapCharacter], deck: 6 },
      {
        hand: [neverGonnaLetYouCry],
        play: [singer],
        discard: [ownCheap, aladdinPrinceAli],
        inkwell: 2,
        deck: 6,
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().playSongTogether(neverGonnaLetYouCry, [singer]),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(singer)).toBe(true);
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(
      game.asPlayerOne().resolveNextPending({ targets: [ownCheap] }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolveNextPending({ targets: [thirdCheapCharacter] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().resolveNextPending({ targets: [ownCheap] })).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(ownCheap)).toBe("hand");
    expect(game.asPlayerTwo().getCardZone(aladdinPrinceAli)).toBe("discard");
    expect(game.asPlayerOne().getCardZone(thirdCheapCharacter)).toBe("discard");
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(
      game
        .asServer()
        .getMoveLogHistory()
        .find((log) => log.moveType === "resolveEffect")?.public,
    ).toContainEqual({
      key: "lorcana.outcome.cardReturnedToHand",
      values: {
        playerId: PLAYER_TWO,
        cardId: game.findCardInstanceId(ownCheap, "hand", PLAYER_TWO),
      },
    });
  });
});

it("Player Two completes with no eligible own cards and publishes no fabricated return", () => {
  const costly = createMockCharacter({ id: "nglyc-p2-no-eligible", name: "Too Costly", cost: 3 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { discard: [simbaProtectiveCub], deck: 6 },
    { hand: [neverGonnaLetYouCry], discard: [costly, healingGlow], inkwell: 5, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(neverGonnaLetYouCry)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().getCardZone(costly)).toBe("discard");
  expect(game.asPlayerTwo().getCardZone(healingGlow)).toBe("discard");
  expect(game.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("discard");
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  expect(game.asPlayerTwo().hasGameEnded()).toBe(false);
  expect(
    game
      .asServer()
      .getMoveLogHistory()
      .flatMap((log) => log.public)
      .filter((message) => message.key === "lorcana.outcome.cardReturnedToHand"),
  ).toHaveLength(0);
});
