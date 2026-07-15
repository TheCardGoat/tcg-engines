import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { healingGlow, simbaProtectiveCub, tinkerBellPeterPansAlly } from "../../001";
import { invitedToTheBall } from "./029-invited-to-the-ball";

describe("Invited to the Ball", () => {
  it("puts revealed character cards into your hand and bottoms the rest in order", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [invitedToTheBall],
      inkwell: invitedToTheBall.cost,
      deck: [healingGlow, simbaProtectiveCub],
    });

    expect(
      testEngine.asPlayerOne().playCard(invitedToTheBall, {
        destinations: [
          {
            zone: "hand",
            cards: [simbaProtectiveCub],
          },
          {
            zone: "deck-bottom",
            cards: [healingGlow],
          },
        ],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([healingGlow.id]);
  });

  it("can bottom both revealed cards when neither is a character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [invitedToTheBall],
      inkwell: invitedToTheBall.cost,
      deck: [healingGlow, tinkerBellPeterPansAlly],
    });

    expect(
      testEngine.asPlayerOne().playCard(invitedToTheBall, {
        destinations: [
          {
            zone: "deck-bottom",
            cards: [tinkerBellPeterPansAlly, healingGlow],
          },
        ],
      }).success,
    ).toBe(true);

    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      healingGlow.id,
      tinkerBellPeterPansAlly.id,
    ]);
  });
});
