import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { weCouldBeImmortals } from "../actions/162-we-could-be-immortals";
import { naveensUkulele } from "./031-naveens-ukulele";

// A cost-1 character: singing threshold = 1, cannot sing the cost-4 song unaided.
const singer = createMockCharacter({
  id: "naveens-ukulele-singer",
  name: "Singer",
  cost: 1,
  strength: 1,
  willpower: 2,
});

describe("Naveen's Ukulele", () => {
  it("MAKE IT SING 1: raises chosen character's singing threshold by 3 this turn, enabling them to sing songs they otherwise could not", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [naveensUkulele, singer],
      hand: [weCouldBeImmortals],
    });

    // Without ukulele the singer (cost 1) cannot sing a cost-4 song.
    expect(
      testEngine.asPlayerOne().singSong(weCouldBeImmortals, singer),
    ).not.toBeSuccessfulCommand();

    // Activate Naveen's Ukulele: pay 1 ink, banish the item, choose the singer.
    expect(
      testEngine.asPlayerOne().activateAbility(naveensUkulele, {
        targets: [singer],
      }),
    ).toBeSuccessfulCommand();

    // Item is banished.
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ discard: 1 });

    // Singer now counts as cost 4 for singing (1 + 3) — can sing the cost-4 song.
    expect(testEngine.asPlayerOne().singSong(weCouldBeImmortals, singer)).toBeSuccessfulCommand();
  });

  it("MAKE IT SING 1: the bonus expires at end of turn and the character cannot sing high-cost songs next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        play: [naveensUkulele, singer],
        hand: [weCouldBeImmortals],
      },
      { deck: 2 },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(naveensUkulele, {
        targets: [singer],
      }),
    ).toBeSuccessfulCommand();

    // Pass through both players' turns to reach the next turn for player one.
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Singer is back to threshold 1 — cannot sing the cost-4 song.
    expect(
      testEngine.asPlayerOne().singSong(weCouldBeImmortals, singer),
    ).not.toBeSuccessfulCommand();
  });
});
