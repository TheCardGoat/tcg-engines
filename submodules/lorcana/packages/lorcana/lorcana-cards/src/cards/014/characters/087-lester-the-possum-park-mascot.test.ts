import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { aladdinPrinceAli } from "../../001/characters/069-aladdin-prince-ali";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { lesterThePossumParkMascot } from "./087-lester-the-possum-park-mascot";

const challenger = createMockCharacter({
  id: "lester-challenger",
  name: "Challenger",
  cost: 3,
  strength: 3,
  willpower: 4,
});

const cringeTarget = createMockCharacter({
  id: "lester-cringe-target",
  name: "Cringe Target",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Lester the Possum - Park Mascot", () => {
  it("Beat It, Doofus! makes each opponent lose 2 lore when challenged and banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: lesterThePossumParkMascot, exerted: true }],
        deck: 6,
        lore: 5,
      },
      {
        play: [{ card: challenger, isDrying: false }],
        deck: 6,
        lore: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(challenger, lesterThePossumParkMascot),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(lesterThePossumParkMascot)).toBe("discard");

    // The controller resolves the banish trigger.
    expect(testEngine.asPlayerOne().resolveOnlyBag()).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_TWO)).toBe(3);
  });

  it("survives a challenge below banish threshold and no lore is lost", () => {
    const weakChallenger = createMockCharacter({
      id: "lester-weak-challenger",
      name: "Weak Challenger",
      cost: 2,
      strength: 2,
      willpower: 4,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: lesterThePossumParkMascot, exerted: true }],
        deck: 6,
        lore: 5,
      },
      {
        play: [{ card: weakChallenger, isDrying: false }],
        deck: 6,
        lore: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(weakChallenger, lesterThePossumParkMascot),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(lesterThePossumParkMascot)).toBe("play");
    expect(testEngine.getLore(PLAYER_TWO)).toBe(5);
  });

  it("Maximum Cringe gives a chosen opposing character Reckless until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [lesterThePossumParkMascot],
        inkwell: 6,
        deck: 6,
      },
      {
        play: [{ card: cringeTarget, isDrying: false }],
        deck: 6,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(lesterThePossumParkMascot, {
        ability: "Maximum Cringe",
        targets: [cringeTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.hasKeyword(cringeTarget, "Reckless")).toBe(true);

    // Exert Lester so the Reckless character is able to challenge him.
    expect(testEngine.asPlayerOne().quest(lesterThePossumParkMascot)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.hasKeyword(cringeTarget, "Reckless")).toBe(true);

    expect(
      testEngine.asPlayerTwo().challenge(cringeTarget, lesterThePossumParkMascot),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.hasKeyword(cringeTarget, "Reckless")).toBe(false);
  });

  it("Maximum Cringe cannot be activated without 6 ready ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [lesterThePossumParkMascot],
        inkwell: 5,
        deck: 6,
      },
      {
        play: [{ card: cringeTarget, isDrying: false }],
        deck: 6,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(lesterThePossumParkMascot, {
        ability: "Maximum Cringe",
        targets: [cringeTarget],
      }),
    ).not.toBeSuccessfulCommand();
    expect(testEngine.hasKeyword(cringeTarget, "Reckless")).toBe(false);
  });
});

it("does not lose lore when Lester is the attacker and is banished", () => {
  const defender = createMockCharacter({
    id: "lester-defender",
    name: "Defender",
    cost: 3,
    strength: 3,
    willpower: 4,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [lesterThePossumParkMascot], lore: 5, deck: 6 },
    { play: [{ card: defender, exerted: true }], lore: 5, deck: 6 },
  );
  expect(game.asPlayerOne().challenge(lesterThePossumParkMascot, defender)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(lesterThePossumParkMascot)).toBe("discard");
  expect(game.asPlayerOne().getBagCount()).toBe(0);
  expect(game.getLore(PLAYER_TWO)).toBe(5);
});
it("does not trigger on banishment outside a challenge", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [lesterThePossumParkMascot], lore: 5, deck: 6 },
    { hand: [dragonFire], inkwell: 5, lore: 5, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().playCard(dragonFire, { targets: [lesterThePossumParkMascot] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(lesterThePossumParkMascot)).toBe("discard");
  expect(game.asPlayerOne().getBagCount()).toBe(0);
  expect(game.getLore(PLAYER_TWO)).toBe(5);
});
for (const lore of [0, 1]) {
  it("clamps the opponent's " + lore + " lore to zero and preserves your lore", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: lesterThePossumParkMascot, exerted: true }], lore: 5, deck: 6 },
      { play: [challenger], lore, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().challenge(challenger, lesterThePossumParkMascot),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().resolveOnlyBag()).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(5);
    expect(game.getLore(PLAYER_TWO)).toBe(0);
  });
}
it("rejects own, Ward and multiple opposing targets before paying", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [lesterThePossumParkMascot, cringeTarget], inkwell: 6, deck: 6 },
    { play: [aladdinPrinceAli, challenger, cringeTarget], deck: 6 },
  );
  const own = game.findCardInstanceId(cringeTarget, "play", PLAYER_ONE);
  const enemy = game.findCardInstanceId(cringeTarget, "play", PLAYER_TWO);
  for (const targets of [[own], [aladdinPrinceAli], [enemy, challenger]]) {
    expect(
      game
        .asPlayerOne()
        .activateAbility(lesterThePossumParkMascot, { ability: "Maximum Cringe", targets }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(6);
    expect(game.hasKeyword(cringeTarget, "Reckless")).toBe(false);
  }
});
it("has no exert cost and may activate twice using saved drops, including while drying", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [{ card: lesterThePossumParkMascot, isDrying: true }],
      inkwell: 6,
      inkDrops: 6,
      deck: 6,
    },
    { play: [challenger, cringeTarget], deck: 6 },
  );
  expect(
    game.asPlayerOne().activateAbility(lesterThePossumParkMascot, {
      ability: "Maximum Cringe",
      targets: [challenger],
    }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().isExerted(lesterThePossumParkMascot)).toBe(false);
  expect(
    game.asPlayerOne().activateAbility(lesterThePossumParkMascot, {
      ability: "Maximum Cringe",
      targets: [cringeTarget],
      inkDrops: 6,
    }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.hasKeyword(challenger, "Reckless")).toBe(true);
  expect(game.hasKeyword(cringeTarget, "Reckless")).toBe(true);
});
it("Reckless blocks quests and passing with a legal challenge but permits passing without a target", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [lesterThePossumParkMascot], inkwell: 6, deck: 6 },
    { play: [cringeTarget], deck: 6 },
  );
  expect(
    game.asPlayerOne().activateAbility(lesterThePossumParkMascot, {
      ability: "Maximum Cringe",
      targets: [cringeTarget],
    }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(lesterThePossumParkMascot)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(cringeTarget)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().challenge(cringeTarget, lesterThePossumParkMascot),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.hasKeyword(cringeTarget, "Reckless")).toBe(false);
  expect(game.getLore(PLAYER_ONE)).toBe(2);
});

it("the granted keyword persists after Lester leaves and expires on your next turn", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [lesterThePossumParkMascot], hand: [dragonFire], inkwell: 11, deck: 6 },
    { play: [cringeTarget], deck: 6 },
  );
  expect(
    game.asPlayerOne().activateAbility(lesterThePossumParkMascot, {
      ability: "Maximum Cringe",
      targets: [cringeTarget],
    }),
  ).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().playCard(dragonFire, { targets: [lesterThePossumParkMascot] }),
  ).toBeSuccessfulCommand();
  expect(game.hasKeyword(cringeTarget, "Reckless")).toBe(true);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(cringeTarget)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.hasKeyword(cringeTarget, "Reckless")).toBe(false);
});

it("player two resolves Lester's defender banish and clamps player one's lore", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [challenger], lore: 1, deck: 6 },
    { play: [{ card: lesterThePossumParkMascot, exerted: true }], lore: 5, deck: 6 },
  );
  expect(
    game.asPlayerOne().challenge(challenger, lesterThePossumParkMascot),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(lesterThePossumParkMascot)).toBe("discard");
  expect(game.asPlayerOne().resolveOnlyBag()).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().resolveOnlyBag()).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(0);
  expect(game.getLore(PLAYER_TWO)).toBe(5);
});

for (const owner of [PLAYER_ONE, PLAYER_TWO, "player_three"]) {
  it(`defender banish affects both opponents with Lester controlled by ${owner}`, () => {
    const attacker = owner === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
    const seats = [PLAYER_ONE, PLAYER_TWO, "player_three"];
    const opponents = seats.filter((seat) => seat !== owner);
    const fixture = (seat: string) => ({
      play:
        seat === owner
          ? [{ card: lesterThePossumParkMascot, exerted: true }]
          : seat === attacker
            ? [challenger]
            : [],
      lore: seat === owner ? 7 : seat === opponents[0] ? 5 : 1,
      deck: 6,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      fixture(PLAYER_ONE),
      fixture(PLAYER_TWO),
      {
        additionalPlayers: { player_three: fixture("player_three") },
      },
    );
    if (attacker === PLAYER_TWO) expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asLorcanaPlayer(attacker).challenge(challenger, lesterThePossumParkMascot),
    ).toBeSuccessfulCommand();
    expect(game.asLorcanaPlayer(attacker).resolveOnlyBag()).not.toBeSuccessfulCommand();
    expect(game.getLore(opponents[0]!)).toBe(5);
    expect(game.getLore(opponents[1]!)).toBe(1);
    expect(game.asLorcanaPlayer(owner).resolveOnlyBag()).toBeSuccessfulCommand();
    expect(game.getLore(owner)).toBe(7);
    expect(game.getLore(opponents[0]!)).toBe(3);
    expect(game.getLore(opponents[1]!)).toBe(0);
    expect(game.asLorcanaPlayer(owner).getCardZone(lesterThePossumParkMascot)).toBe("discard");
    expect(game.asLorcanaPlayer(owner).getBagCount()).toBe(0);
    expect(game.asLorcanaPlayer(owner).getPendingEffects()).toHaveLength(0);
  });
}

it("Player Two cannot pay Maximum Cringe with five ink and may retry with saved drops", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [cringeTarget], inkDrops: 4, deck: 6 },
    {
      play: [{ card: lesterThePossumParkMascot, isDrying: true }],
      inkwell: 5,
      inkDrops: 6,
      deck: 6,
    },
    { additionalPlayers: { player_three: { deck: 6 } } },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const activate = { ability: "Maximum Cringe", targets: [cringeTarget] };
  expect(
    game.asPlayerTwo().activateAbility(lesterThePossumParkMascot, activate),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(5);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(6);
  expect(game.hasKeyword(cringeTarget, "Reckless")).toBe(false);
  expect(
    game.asPlayerTwo().activateAbility(lesterThePossumParkMascot, { ...activate, inkDrops: 6 }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(5);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
  expect(game.hasKeyword(cringeTarget, "Reckless")).toBe(true);
  expect(game.asPlayerTwo().isExerted(lesterThePossumParkMascot)).toBe(false);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.hasKeyword(cringeTarget, "Reckless")).toBe(true);
  expect(game.asLorcanaPlayer("player_three").passTurn()).toBeSuccessfulCommand();
  expect(game.hasKeyword(cringeTarget, "Reckless")).toBe(true);
  expect(game.asPlayerOne().quest(cringeTarget)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.hasKeyword(cringeTarget, "Reckless")).toBe(false);
});
