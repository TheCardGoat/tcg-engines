import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  createMockItem,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { gantuExperiencedEnforcer } from "./199-gantu-experienced-enforcer";

const singer = createMockCharacter({
  id: "gantu-enforcer-singer",
  name: "Singer Character",
  cost: 3,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const song = createMockSong({
  id: "gantu-enforcer-song",
  name: "Test Song",
  cost: 3,
  text: "A Test Song",
});

const action = createMockAction({
  id: "gantu-enforcer-action",
  name: "Test Action",
  cost: 2,
  text: "A Test Action",
});

const item = createMockItem({
  id: "gantu-enforcer-item",
  name: "Test Item",
  cost: 2,
});

const character = createMockCharacter({
  id: "gantu-enforcer-char",
  name: "Test Character",
  cost: 3,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Gantu - Experienced Enforcer", () => {
  describe("CLOSE ALL CHANNELS", () => {
    it("applies cant-sing restriction to characters after Gantu is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [singer],
          hand: [gantuExperiencedEnforcer],
          inkwell: gantuExperiencedEnforcer.cost,
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().playCard(gantuExperiencedEnforcer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasTemporaryRestriction(singer, "cant-sing")).toBe(true);
    });

    it("sing restriction expires at start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [singer],
          hand: [gantuExperiencedEnforcer],
          inkwell: gantuExperiencedEnforcer.cost,
          deck: 5,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().playCard(gantuExperiencedEnforcer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasTemporaryRestriction(singer, "cant-sing")).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasTemporaryRestriction(singer, "cant-sing")).toBe(false);
    });
  });

  describe("DON'T GET ANY IDEAS", () => {
    it("increases cost of actions by 2 for the active player", () => {
      const withGantu = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [gantuExperiencedEnforcer],
        hand: [action],
        inkwell: action.cost, // exact cost — not enough when increased by 2
      });
      const withoutGantu = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [action],
        inkwell: action.cost,
      });

      // Without Gantu: can play action at base cost
      expect(withoutGantu.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
      // With Gantu: can't play action because it costs 2 more
      expect(withGantu.asPlayerOne().playCard(action).success).toBe(false);
    });

    it("increases cost of items by 2 for the active player", () => {
      const withGantu = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [gantuExperiencedEnforcer],
        hand: [item],
        inkwell: item.cost,
      });
      const withoutGantu = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [item],
        inkwell: item.cost,
      });

      expect(withoutGantu.asPlayerOne().playCard(item)).toBeSuccessfulCommand();
      expect(withGantu.asPlayerOne().playCard(item).success).toBe(false);
    });

    it("does NOT increase cost of characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [gantuExperiencedEnforcer],
        hand: [character],
        inkwell: character.cost, // exact base cost is enough
      });

      expect(testEngine.asPlayerOne().playCard(character)).toBeSuccessfulCommand();
    });

    it("does NOT apply to singing songs", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [gantuExperiencedEnforcer, singer],
        hand: [song],
        // No inkwell needed — singing doesn't cost ink
      });

      // Singer can still sing the song (bypasses cost increase for actions/items)
      expect(testEngine.asPlayerOne().singSong(song, singer)).toBeSuccessfulCommand();
    });

    it("increases cost for opponent too", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [gantuExperiencedEnforcer], deck: 1 },
        { hand: [action], inkwell: action.cost, deck: 1 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      // Opponent has exact base cost but Gantu increases by 2 — should fail
      expect(testEngine.asPlayerTwo().playCard(action).success).toBe(false);
    });

    it("regression: cost increase applies to both players for actions and items", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [gantuExperiencedEnforcer],
          hand: [action],
          inkwell: action.cost + 2, // exact increased cost
          deck: 1,
        },
        {
          hand: [item],
          inkwell: item.cost + 2, // exact increased cost
          deck: 1,
        },
      );

      // P1 can play action at increased cost (base + 2)
      expect(testEngine.asPlayerOne().playCard(action)).toBeSuccessfulCommand();

      // P2 can play item at increased cost (base + 2)
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().playCard(item)).toBeSuccessfulCommand();
    });

    it("stacks when two copies are in play", () => {
      const gantu2 = createMockCharacter({
        id: "gantu-experienced-enforcer-2",
        name: "Gantu",
        version: "Experienced Enforcer",
        cost: 4,
        strength: 2,
        willpower: 4,
        lore: 1,
        abilities: gantuExperiencedEnforcer.abilities,
      } as never);

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [gantuExperiencedEnforcer, gantu2],
        hand: [action],
        inkwell: action.cost + 2, // enough for one Gantu but not two
      });

      expect(testEngine.asPlayerOne().playCard(action).success).toBe(false);
    });
  });
});
