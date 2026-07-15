import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { rapunzelGiftedArtist } from "./019-rapunzel-gifted-artist";
import { gastonBaritoneBully } from "./008-gaston-baritone-bully";
import { magicGoldenFlower } from "../../001/items/169-magic-golden-flower";
import { healingGlow } from "../../001/actions/028-healing-glow";

describe("Rapunzel - Gifted Artist", () => {
  it("LET YOUR POWER SHINE - does NOT draw a card when the opponent removes damage from one of your characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [rapunzelGiftedArtist, { card: gastonBaritoneBully, damage: 2 }],
        deck: 5,
      },
      {
        hand: [healingGlow],
        inkwell: healingGlow.cost,
        deck: 5,
      },
    );

    const handSizeBefore = testEngine.getCardInstanceIdsInZone("hand", "player_one").length;

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent plays Healing Glow on player one's character
    expect(
      testEngine.asPlayerTwo().playCard(healingGlow, {
        targets: [gastonBaritoneBully],
      }),
    ).toBeSuccessfulCommand();

    // Rapunzel should NOT have triggered
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    const handSizeAfter = testEngine.getCardInstanceIdsInZone("hand", "player_one").length;
    expect(handSizeAfter).toBe(handSizeBefore);
  });

  it("LET YOUR POWER SHINE - Whenever you remove 1 or more damage from one of your characters, you may draw a card.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: rapunzelGiftedArtist },
        { card: gastonBaritoneBully, damage: 3 },
        { card: magicGoldenFlower },
      ],
      deck: Array.from({ length: 10 }).map(() => ({ card: gastonBaritoneBully })),
    });

    const rapunzelId = testEngine.findCardInstanceId(rapunzelGiftedArtist, "play");
    const gastonId = testEngine.findCardInstanceId(gastonBaritoneBully, "play");
    const flowerId = testEngine.findCardInstanceId(magicGoldenFlower, "play");

    const handSizeBefore = testEngine.getCardInstanceIdsInZone("hand", "player_one").length;

    // Use Magic Golden Flower to heal Gaston
    testEngine.asPlayerOne().activateAbility(flowerId, { abilityIndex: 0, targets: [gastonId] });

    // Ensure it was healed
    expect(testEngine.asServer().getCard(gastonId).damage).toBe(0);

    // Resolve triggers (Rapunzel's draw)
    testEngine.asPlayerOne().resolvePendingByCard(rapunzelGiftedArtist);

    // Should have drawn a card
    const handSizeAfter = testEngine.getCardInstanceIdsInZone("hand", "player_one").length;
    expect(handSizeAfter).toBe(handSizeBefore + 1);
  });
});
