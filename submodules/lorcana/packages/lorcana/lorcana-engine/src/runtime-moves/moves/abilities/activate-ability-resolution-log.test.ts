import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockLocation,
} from "../../../testing";

describe("activated ability target-resolution logs", () => {
  it("names the ability during a chosen discard continuation", () => {
    const target = createMockCharacter({
      id: "named-discard-target",
      name: "Discard Target",
      cost: 1,
    });
    const source = createMockCharacter({
      id: "named-discard-source",
      name: "Discard Source",
      cost: 1,
      abilities: [
        {
          type: "activated",
          name: "Venue Choice",
          cost: { ink: 1 },
          effect: { type: "discard", amount: 1, target: "CONTROLLER", from: "hand", chosen: true },
        },
      ],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [source],
      hand: [target, source],
      inkwell: 1,
    });
    const player = game.asPlayerOne();
    expect(player.activateAbility(source)).toBeSuccessfulCommand();
    expect(player.respondWith(target)).toBeSuccessfulCommand();
    expect(player.getCardZone(target)).toBe("discard");
    expect(
      game
        .asServer()
        .getMoveLogHistory()
        .flatMap((log) => log.public),
    ).toContainEqual({
      key: "lorcana.effect.resolve.discardChoice.named",
      values: {
        playerId: PLAYER_ONE,
        sourceCardId: game.findCardInstanceId(source, "play", "player_one"),
        abilityName: "Venue Choice",
        targets: [game.findCardInstanceId(target, "discard", "player_one")],
      },
    });
  });

  it("names the automatically chosen location after optional free play", () => {
    const location = createMockLocation({
      id: "optional-free-location",
      name: "Free Location",
      cost: 4,
    });
    const source = createMockCharacter({
      id: "optional-free-source",
      name: "Free Play Source",
      cost: 1,
      abilities: [
        {
          type: "activated",
          name: "Free Venue",
          cost: { ink: 1 },
          effect: {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "play-card",
              from: "discard",
              cost: "free",
              cardType: "location",
              filter: { name: "Free Location" },
            },
          },
        },
      ],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [source],
      discard: [location],
      inkwell: 1,
    });
    const player = game.asPlayerOne();
    expect(player.activateAbility(source)).toBeSuccessfulCommand();
    expect(player.resolvePendingByCard(source, { resolveOptional: true })).toBeSuccessfulCommand();
    expect(player.getCardZone(location)).toBe("play");
    expect(
      game
        .asServer()
        .getMoveLogHistory()
        .flatMap((log) => log.public),
    ).toContainEqual({
      key: "lorcana.effect.resolve.optionalSelection.freePlay.named",
      values: {
        playerId: PLAYER_ONE,
        sourceCardId: game.findCardInstanceId(source, "play", "player_one"),
        abilityName: "Free Venue",
        targets: [game.findCardInstanceId(location, "play", "player_one")],
      },
    });
  });

  it("names a triggered optional declined directly from the bag", () => {
    const source = createMockCharacter({
      id: "optional-bag-log-source",
      name: "Optional Bag Source",
      cost: 1,
      abilities: [
        {
          type: "triggered",
          name: "Optional Quest Reward",
          trigger: { event: "quest", on: "SELF", timing: "whenever" },
          effect: {
            type: "optional",
            chooser: "CONTROLLER",
            effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" },
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({ play: [source], deck: 3 });
    expect(g.asPlayerOne().quest(source)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(source, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(
      g
        .asServer()
        .getMoveLogHistory()
        .flatMap((log) => log.public),
    ).toContainEqual({
      key: "lorcana.effect.resolve.optionalSelection.rejected.named",
      values: {
        playerId: PLAYER_ONE,
        sourceCardId: g.findCardInstanceId(source, "play", "player_one"),
        abilityName: "Optional Quest Reward",
      },
    });
  });

  for (const accepted of [true, false]) {
    it(`names optional resolution when accepted is ${accepted}`, () => {
      const source = createMockCharacter({
        id: "optional-log-source",
        name: "Optional Source",
        cost: 1,
        abilities: [
          {
            type: "activated",
            name: "Optional Reward",
            cost: { ink: 1 },
            effect: {
              type: "optional",
              chooser: "CONTROLLER",
              effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" },
            },
          },
        ],
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [source],
        inkwell: 1,
        deck: 3,
      });
      expect(
        g.asPlayerOne().activateAbility(source, { ability: "Optional Reward" }),
      ).toBeSuccessfulCommand();
      expect(
        g.asPlayerOne().resolvePendingByCard(source, { resolveOptional: accepted }),
      ).toBeSuccessfulCommand();
      expect(g.getLore("player_one")).toBe(accepted ? 1 : 0);
      expect(
        g
          .asServer()
          .getMoveLogHistory()
          .flatMap((log) => log.public),
      ).toContainEqual({
        key: accepted
          ? "lorcana.effect.resolve.optionalSelection.accepted.named"
          : "lorcana.effect.resolve.optionalSelection.rejected.named",
        values: {
          playerId: PLAYER_ONE,
          sourceCardId: g.findCardInstanceId(source, "play", "player_one"),
          abilityName: "Optional Reward",
        },
      });
    });
  }

  it("retains the printed ability name after a deferred target choice", () => {
    const source = createMockCharacter({
      id: "named-restriction-source",
      name: "Restriction Source",
      cost: 7,
      abilities: [
        {
          type: "triggered",
          name: "Quest Ability",
          trigger: { event: "quest", on: "SELF", timing: "whenever" },
          effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" },
        },
        {
          type: "activated",
          name: "Stop Right There",
          cost: { ink: 6 },
          effect: {
            type: "restriction",
            restriction: "cant-challenge",
            duration: "until-start-of-next-turn",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        },
      ],
    });
    const target = createMockCharacter({ id: "named-restriction-target", name: "Target", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [source], inkwell: 6, deck: 3 },
      { play: [target], deck: 3 },
    );
    expect(
      g.asPlayerOne().activateAbility(source, { ability: "Stop Right There" }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(1);
    expect(
      g.asPlayerOne().resolvePendingByCard(source, { targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().hasTemporaryRestriction(target, "cant-challenge")).toBe(true);
    const messages = g
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .flatMap((log) => log.public);
    expect(messages).toContainEqual({
      key: "lorcana.effect.resolve.targetSelection.named",
      values: {
        playerId: PLAYER_ONE,
        sourceCardId: g.findCardInstanceId(source, "play", "player_one"),
        abilityName: "Stop Right There",
        targets: [g.findCardInstanceId(target, "play", "player_two")],
        effectType: "restriction",
      },
    });
  });
});
