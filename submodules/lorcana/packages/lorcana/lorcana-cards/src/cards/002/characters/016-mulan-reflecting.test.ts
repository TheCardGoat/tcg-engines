import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mulanReflecting } from "./016-mulan-reflecting";
import { bibbidiBobbidiBoo } from "../../002/actions/096-bibbidi-bobbidi-boo";
import { gastonBaritoneBully } from "./008-gaston-baritone-bully";

describe("Mulan - Reflecting", () => {
  it("HONOR TO THE ANCESTORS - When quests, reveals top card. If song, play for free.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: mulanReflecting }],
      deck: [
        { card: bibbidiBobbidiBoo }, // Top card is song
      ],
    });

    const mulanId = testEngine.findCardInstanceId(mulanReflecting, "play");
    const songId = testEngine.findCardInstanceId(bibbidiBobbidiBoo, "deck");

    // Quest with Mulan
    testEngine.asPlayerOne().quest(mulanId);

    // Resolve the triggered ability bag
    testEngine.asPlayerOne().resolvePendingByCard(mulanReflecting);

    // Resolve the scry — choose to play the song for free
    testEngine.asPlayerOne().resolveNextPending({
      destinations: [{ zone: "play", cards: [songId] }],
    });

    // Bibbidi Bobbidi Boo needs a target to bounce to hand
    let pendingChoice = testEngine.asPlayerOne().getPendingChoice();
    if (pendingChoice) {
      testEngine.asPlayerOne().resolveNextPending({ targets: [mulanId] });
    }

    // Mulan should be back in hand, and Song should no longer be in deck.
    const songZone = testEngine.asServer().getState().ctx.zones.private.cardIndex[songId]?.zoneKey;
    expect(songZone?.startsWith("deck")).toBe(false);

    const mulanZone = testEngine.asServer().getState().ctx.zones.private.cardIndex[
      mulanId
    ]?.zoneKey;
    expect(mulanZone?.startsWith("hand")).toBe(true);
  });

  it("HONOR TO THE ANCESTORS - When quests, reveals top card. If NOT song, put on top.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: mulanReflecting }],
      deck: [
        { card: gastonBaritoneBully }, // Top card is character
      ],
    });

    const mulanId = testEngine.findCardInstanceId(mulanReflecting, "play");
    const gastonId = testEngine.findCardInstanceId(gastonBaritoneBully, "deck");

    // Quest with Mulan
    testEngine.asPlayerOne().quest(mulanId);

    // Resolve triggers
    testEngine.asPlayerOne().resolvePendingByCard(mulanReflecting);

    // Non-song doesn't match the play filter — resolve scry with no selection
    testEngine.asPlayerOne().resolveNextPending({ destinations: [] });

    const gastonZone = testEngine.asServer().getState().ctx.zones.private.cardIndex[
      gastonId
    ]?.zoneKey;
    expect(gastonZone?.startsWith("deck")).toBe(true);
  });
});
