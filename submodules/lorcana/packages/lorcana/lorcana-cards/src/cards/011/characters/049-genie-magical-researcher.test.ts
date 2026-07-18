import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { genieMagicalResearcher } from "./049-genie-magical-researcher";

const underCard = createMockCharacter({
  id: "genie-magical-researcher-under-card",
  name: "Under Card",
  cost: 1,
});

describe("Genie - Magical Researcher", () => {
  it("can activate Boost 1 and put the top card of the deck under him", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [genieMagicalResearcher],
      deck: [underCard],
      inkwell: 1,
    });
    const player = testEngine.asPlayerOne();
    const genieId = testEngine.findCardInstanceId(genieMagicalResearcher, "play", PLAYER_ONE);

    expect(
      player.getAvailableMoves().find((move) => move.moveId === "activateAbility")
        ?.selectableCardIds,
    ).toContain(genieId);
    expect(player.getMoveOptions("activateAbility", genieId)).toContainEqual({
      kind: "ability",
      abilityIndex: 0,
      abilityLabel: "Boost 1",
    });

    expect(
      player.activateAbility(genieMagicalResearcher, { ability: "Boost" }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getCardsUnder(genieMagicalResearcher)).toHaveLength(1);
    expect(testEngine.asPlayerOne().getCardLore(genieMagicalResearcher)).toBe(
      genieMagicalResearcher.lore + 1,
    );
  });

  it("quests for base lore when there are no cards under him", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: genieMagicalResearcher, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().getCardLore(genieMagicalResearcher)).toBe(
      genieMagicalResearcher.lore,
    );
    expect(testEngine.asPlayerOne().quest(genieMagicalResearcher)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(genieMagicalResearcher.lore);
  });

  it("gets +1 lore for each card under him", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: genieMagicalResearcher, isDrying: false, cardsUnder: [underCard, underCard] }],
    });

    expect(testEngine.asPlayerOne().getCardLore(genieMagicalResearcher)).toBe(
      genieMagicalResearcher.lore + 2,
    );
    expect(testEngine.asPlayerOne().quest(genieMagicalResearcher)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(genieMagicalResearcher.lore + 2);
  });
});
