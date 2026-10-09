import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { portAuthorityCenterHub } from "../locations/034-port-authority-center-hub";
import { chiefBogoPoliceCommissioner } from "./183-chief-bogo-police-commissioner";

const foreignLocation = createMockLocation({
  id: "bogo-foreign-location",
  name: "Foreign Location",
  cost: 2,
  willpower: 5,
});

const opposingCharacter = createMockCharacter({
  id: "bogo-opposing-character",
  name: "Opposing Character",
  cost: 3,
  strength: 2,
  willpower: 4,
});

describe("Chief Bogo - Police Commissioner", () => {
  it("player two's restriction lasts through player one's turn but does not stop questing", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: opposingCharacter, isDrying: false }], deck: 4 },
      { play: [chiefBogoPoliceCommissioner], inkwell: 6, deck: 4 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().activateAbility(chiefBogoPoliceCommissioner, {
        ability: "Stop Right There",
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(chiefBogoPoliceCommissioner)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().hasTemporaryRestriction(opposingCharacter, "cant-challenge")).toBe(true);
    expect(
      g.asPlayerOne().challenge(opposingCharacter, chiefBogoPoliceCommissioner),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().isExerted(opposingCharacter)).toBe(false);
    expect(g.asPlayerOne().quest(opposingCharacter)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().hasTemporaryRestriction(opposingCharacter, "cant-challenge")).toBe(
      false,
    );
  });

  it("paid entry costs seven and dries before questing three on the next turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [chiefBogoPoliceCommissioner], inkwell: 7, deck: 4 },
      { deck: 4 },
    );
    expect(g.asPlayerOne().playCard(chiefBogoPoliceCommissioner)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk("player_one")).toBe(0);
    expect(g.asPlayerOne().quest(chiefBogoPoliceCommissioner)).not.toBeSuccessfulCommand();
    expect(g.getLore("player_one")).toBe(0);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(chiefBogoPoliceCommissioner)).toBeSuccessfulCommand();
    expect(g.getLore("player_one")).toBe(3);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });

  it("unpaid entry rejects without consuming ink and Bogo can instead be inked", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [chiefBogoPoliceCommissioner],
      inkwell: 6,
      deck: 3,
    });
    expect(g.asPlayerOne().playCard(chiefBogoPoliceCommissioner)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(chiefBogoPoliceCommissioner)).toBe("hand");
    expect(g.asServer().getAvailableInk("player_one")).toBe(6);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(
      g.asPlayerOne().putIntoInkwell("player_one", chiefBogoPoliceCommissioner),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(chiefBogoPoliceCommissioner)).toBe("inkwell");
    expect(g.asServer().getAvailableInk("player_one")).toBe(7);
  });

  it("cannot restrict a friendly or hand character and preserves ink for a valid retry", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [chiefBogoPoliceCommissioner], inkwell: 6, deck: 3 },
      { play: [opposingCharacter], hand: [opposingCharacter], deck: 3 },
    );
    const inHand = g.findCardInstanceId(opposingCharacter, "hand", "player_two");
    const inPlay = g.findCardInstanceId(opposingCharacter, "play", "player_two");
    for (const target of [chiefBogoPoliceCommissioner, inHand]) {
      expect(
        g.asPlayerOne().activateAbility(chiefBogoPoliceCommissioner, {
          ability: "Stop Right There",
          targets: [target],
        }),
      ).not.toBeSuccessfulCommand();
      expect(g.asServer().getAvailableInk("player_one")).toBe(6);
      expect(
        g.asPlayerOne().hasTemporaryRestriction(chiefBogoPoliceCommissioner, "cant-challenge"),
      ).toBe(false);
    }
    expect(
      g.asPlayerOne().activateAbility(chiefBogoPoliceCommissioner, {
        ability: "Stop Right There",
        targets: [inPlay],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk("player_one")).toBe(0);
    expect(g.asPlayerTwo().hasTemporaryRestriction(inPlay, "cant-challenge")).toBe(true);
  });

  it("can activate while drying or exerted because its cost does not exert Bogo", () => {
    for (const exerted of [false, true]) {
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: chiefBogoPoliceCommissioner, isDrying: true, exerted }],
          inkwell: 6,
          deck: 3,
        },
        { play: [opposingCharacter], deck: 3 },
      );
      expect(
        g.asPlayerOne().activateAbility(chiefBogoPoliceCommissioner, {
          ability: "Stop Right There",
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();
      expect(g.asServer().getAvailableInk("player_one")).toBe(0);
      expect(g.asPlayerOne().isExerted(chiefBogoPoliceCommissioner)).toBe(exerted);
      expect(g.asPlayerTwo().hasTemporaryRestriction(opposingCharacter, "cant-challenge")).toBe(
        true,
      );
    }
  });

  it("quest gains three with no eligible location and leaves no unresolved choice", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [chiefBogoPoliceCommissioner, foreignLocation], deck: 3 },
      { play: [portAuthorityCenterHub], deck: 3 },
    );
    expect(g.asPlayerOne().quest(chiefBogoPoliceCommissioner)).toBeSuccessfulCommand();
    expect(g.getLore("player_one")).toBe(3);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne()).not.toBeAtLocation({
      card: chiefBogoPoliceCommissioner,
      location: foreignLocation,
    });
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  });

  it("player two quests and moves to their own Hyperia City location for free", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [portAuthorityCenterHub], deck: 3 },
      { play: [chiefBogoPoliceCommissioner, portAuthorityCenterHub], inkwell: 1, deck: 3 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(chiefBogoPoliceCommissioner)).toBeSuccessfulCommand();
    const ownHub = g.findCardInstanceId(portAuthorityCenterHub, "play", "player_two");
    expect(
      g.asPlayerTwo().resolvePendingByCard(chiefBogoPoliceCommissioner, {
        resolveOptional: true,
        targets: [ownHub],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo()).toBeAtLocation({ card: chiefBogoPoliceCommissioner, location: ownHub });
    // Port Authority contributes two start-turn lore and one lore on arrival.
    expect(g.getLore("player_two")).toBe(portAuthorityCenterHub.lore + 3 + 1);
    expect(g.getInkDrops("player_two")).toBe(1);
    expect(g.asServer().getAvailableInk("player_two")).toBe(1);
  });

  // Comprehensive Rules 4.7.1: characters can move only to their controller's locations.
  it("rejects a foreign location and permits a Hyperia City retry without paying ink", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [chiefBogoPoliceCommissioner, portAuthorityCenterHub, foreignLocation],
      inkwell: 2,
      deck: 3,
    });
    expect(g.asPlayerOne().quest(chiefBogoPoliceCommissioner)).toBeSuccessfulCommand();
    expect(g.getLore("player_one")).toBe(3);
    expect(
      g.asPlayerOne().resolvePendingByCard(chiefBogoPoliceCommissioner, {
        resolveOptional: true,
        targets: [foreignLocation],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne()).not.toBeAtLocation({
      card: chiefBogoPoliceCommissioner,
      location: foreignLocation,
    });
    expect(
      g.asPlayerOne().resolvePendingByCard(chiefBogoPoliceCommissioner, {
        resolveOptional: true,
        targets: [portAuthorityCenterHub],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toBeAtLocation({
      card: chiefBogoPoliceCommissioner,
      location: portAuthorityCenterHub,
    });
    expect(g.asServer().getAvailableInk("player_one")).toBe(2);
  });

  it("rejects an opposing Hyperia City location and permits a friendly retry", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [chiefBogoPoliceCommissioner, portAuthorityCenterHub], deck: 3 },
      { play: [portAuthorityCenterHub], deck: 3 },
    );
    const enemyHub = g.findCardInstanceId(portAuthorityCenterHub, "play", "player_two");
    const ownHub = g.findCardInstanceId(portAuthorityCenterHub, "play", "player_one");
    expect(g.asPlayerOne().quest(chiefBogoPoliceCommissioner)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(chiefBogoPoliceCommissioner, {
        resolveOptional: true,
        targets: [enemyHub],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(chiefBogoPoliceCommissioner, {
        resolveOptional: true,
        targets: [ownHub],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toBeAtLocation({ card: chiefBogoPoliceCommissioner, location: ownHub });
  });

  it("Stop Right There pays six per use without exerting Bogo and can be repeated", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [chiefBogoPoliceCommissioner], inkwell: 12, deck: 3 },
      { play: [opposingCharacter], deck: 3 },
    );
    for (const remaining of [6, 0]) {
      expect(
        g.asPlayerOne().activateAbility(chiefBogoPoliceCommissioner, {
          ability: "Stop Right There",
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();
      expect(g.asServer().getAvailableInk("player_one")).toBe(remaining);
      expect(g.asPlayerOne().isExerted(chiefBogoPoliceCommissioner)).toBe(false);
    }
    expect(
      g.asPlayerOne().activateAbility(chiefBogoPoliceCommissioner, {
        ability: "Stop Right There",
        targets: [opposingCharacter],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk("player_one")).toBe(0);
  });

  it("I Know These Streets moves him to a Hyperia City location when he quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [chiefBogoPoliceCommissioner, portAuthorityCenterHub, foreignLocation],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().quest(chiefBogoPoliceCommissioner)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(chiefBogoPoliceCommissioner, {
        resolveOptional: true,
        targets: [portAuthorityCenterHub],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: chiefBogoPoliceCommissioner,
      location: portAuthorityCenterHub,
    });
  });

  it("I Know These Streets can be declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [chiefBogoPoliceCommissioner, portAuthorityCenterHub],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().quest(chiefBogoPoliceCommissioner)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(chiefBogoPoliceCommissioner, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).not.toBeAtLocation({
      card: chiefBogoPoliceCommissioner,
      location: portAuthorityCenterHub,
    });
  });

  it("Stop Right There stops the chosen opposing character from challenging until your next turn", () => {
    const windowDefender = createMockCharacter({
      id: "bogo-window-defender",
      name: "Window Defender",
      cost: 2,
      strength: 1,
      willpower: 4,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [chiefBogoPoliceCommissioner, { card: windowDefender, exerted: true }],
        inkwell: chiefBogoPoliceCommissioner.cost,
        deck: 5,
      },
      {
        play: [{ card: opposingCharacter, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(chiefBogoPoliceCommissioner, {
        ability: "Stop Right There",
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().hasTemporaryRestriction(opposingCharacter, "cant-challenge"),
    ).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(opposingCharacter, windowDefender),
    ).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(windowDefender)).toBe("play");

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Player One's next turn started — the restriction expired.
    expect(
      testEngine.asPlayerTwo().hasTemporaryRestriction(opposingCharacter, "cant-challenge"),
    ).toBe(false);

    // Player One quests his defender so it is exerted on Player Two's turn.
    expect(testEngine.asPlayerOne().quest(windowDefender)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().challenge(opposingCharacter, windowDefender),
    ).toBeSuccessfulCommand();
  });
});
