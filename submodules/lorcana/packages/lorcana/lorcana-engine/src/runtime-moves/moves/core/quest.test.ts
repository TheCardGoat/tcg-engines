import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "#core";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockSong,
} from "../../../testing";

describe("quest", () => {
  it("returns CARD_DRYING for characters played this turn", () => {
    const quester = createMockCharacter({
      id: "drying-quester",
      name: "Drying Quester",
      cost: 2,
      lore: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [quester],
      inkwell: quester.cost,
    });

    expect(engine.asPlayerOne().playCard(quester).success).toBe(true);

    const result = engine.asPlayerOne().quest(quester) as CommandFailure;

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("CARD_DRYING");
  });

  it("quests all eligible characters with one move", () => {
    const readyQuester = createMockCharacter({
      id: "ready-quester",
      name: "Ready Quester",
      cost: 2,
      lore: 2,
    });
    const recklessQuester = createMockCharacter({
      id: "reckless-quester",
      name: "Reckless Quester",
      cost: 2,
      lore: 5,
      abilities: [{ id: "reckless", type: "keyword", keyword: "Reckless", text: "Reckless" }],
    });
    const dryingQuester = createMockCharacter({
      id: "drying-quester-bulk",
      name: "Drying Quester",
      cost: 2,
      lore: 3,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [readyQuester, recklessQuester],
      hand: [dryingQuester],
      inkwell: dryingQuester.cost,
    });

    expect(engine.asPlayerOne().playCard(dryingQuester).success).toBe(true);

    const result = engine.asPlayerOne().questWithAll();

    expect(result.success).toBe(true);
    expect(engine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
    const playCards = engine.asServer().getCardsInZone("play", PLAYER_ONE).cards;
    expect(playCards.find((card) => card.fullName === "Ready Quester")?.exerted).toBe(true);
    expect(playCards.find((card) => card.fullName === "Reckless Quester")?.exerted).toBe(false);
    expect(playCards.find((card) => card.fullName === "Drying Quester")?.drying).toBe(true);

    const questEntry = engine
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .find((log) => log.moveType === "questWithAll");
    expect(questEntry).toMatchObject({
      moveType: "questWithAll",
      playerId: PLAYER_ONE,
      public: [
        {
          key: "lorcana.move.questWithAll",
          values: {
            playerId: PLAYER_ONE,
            loreGained: 2,
          },
        },
      ],
    });
  });

  it("returns NO_ELIGIBLE_QUESTERS when no characters can quest", () => {
    const recklessQuester = createMockCharacter({
      id: "only-reckless-quester",
      name: "Only Reckless Quester",
      cost: 2,
      lore: 1,
      abilities: [{ id: "reckless", type: "keyword", keyword: "Reckless", text: "Reckless" }],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [recklessQuester],
    });

    const result = engine.asPlayerOne().questWithAll() as CommandFailure;

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("NO_ELIGIBLE_QUESTERS");
  });

  it("treats negative lore as 0 for questing while preserving the raw lore value", () => {
    const gloomyQuester = createMockCharacter({
      id: "gloomy-quester",
      name: "Gloomy Quester",
      cost: 2,
      strength: 2,
      willpower: 3,
      lore: 1,
      abilities: [
        {
          id: "gloomy-quester-1",
          type: "static",
          text: "This character gets -2 lore.",
          effect: {
            type: "modify-stat",
            stat: "lore",
            modifier: -2,
            target: "SELF",
          },
        },
      ],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: gloomyQuester, isDrying: false }],
    });

    expect(engine.asPlayerOne().getCardLore(gloomyQuester)).toBe(-1);
    expect(engine.asPlayerOne().quest(gloomyQuester).success).toBe(true);
    expect(engine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

    const questEntry = engine
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .find((log) => log.moveType === "quest");
    expect(questEntry).toMatchObject({
      moveType: "quest",
      playerId: PLAYER_ONE,
      public: [
        {
          key: "lorcana.move.quest",
          values: {
            playerId: PLAYER_ONE,
            loreGained: 0,
          },
        },
      ],
    });
  });

  it.skip("resolves temporary lore-loss abilities granted for questing", () => {
    const quester = createMockCharacter({
      id: "quester",
      name: "Quester",
      cost: 2,
      lore: 1,
    });
    const stealEffect = createMockSong({
      id: "steal-effect",
      name: "Steal Effect",
      cost: 1,
      text: "Whenever one of your characters quests this turn, each opponent loses 1 lore.",
      abilities: [
        {
          type: "action",
          text: "Whenever one of your characters quests this turn, each opponent loses 1 lore.",
          effect: {
            type: "grant-ability",
            target: "YOUR_CHARACTERS",
            duration: "this-turn",
            ability: {
              type: "lose-lore-when-questing",
              amount: 1,
              target: "EACH_OPPONENT",
            },
          },
        },
      ],
    });

    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [stealEffect],
        inkwell: stealEffect.cost,
        play: [quester],
      },
      {
        deck: 1,
      },
    );

    engine.asPlayerOne().manualSetLore(PLAYER_TWO, 3);

    expect(engine.asPlayerOne().playCard(stealEffect).success).toBe(true);
    expect(engine.asPlayerOne().quest(quester).success).toBe(true);

    expect(engine.asPlayerOne().getLore("player_one")).toBe(1);
    expect(engine.asPlayerOne().getLore(PLAYER_TWO)).toBe(2);
  });
});
