import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { launchpadTrustySidekick } from "./177-launchpad-trusty-sidekick";
import { darkwingDuckDrakeMallard } from "./145-darkwing-duck-drake-mallard";

const handCard = createMockCharacter({
  id: "launchpad-test-hand-card",
  name: "Hand Card",
  cost: 1,
});

describe("Launchpad - Trusty Sidekick", () => {
  it("has an activated ability defined for WHAT DID YOU NEED?", () => {
    const ability = launchpadTrustySidekick.abilities?.[0];
    expect(ability).toBeDefined();
    expect(ability?.type).toBe("activated");
  });

  it("activated ability has exert cost", () => {
    const ability = launchpadTrustySidekick.abilities?.[0];
    const cost = (ability as unknown as Record<string, unknown>)?.cost as
      | Record<string, unknown>
      | undefined;
    expect(cost?.exert).toBe(true);
  });

  it("activated ability has sequence effect with draw then conditional discard", () => {
    const ability = launchpadTrustySidekick.abilities?.[0];
    const effect = (ability as unknown as Record<string, unknown>)?.effect as Record<
      string,
      unknown
    >;
    expect(effect?.type).toBe("sequence");

    const steps = (effect?.steps as Array<{ type: string }>) ?? [];
    expect(steps).toHaveLength(2);
    expect(steps[0]?.type).toBe("draw");
    // Second step is a conditional that wraps the discard
    expect(steps[1]?.type).toBe("conditional");
  });

  it("can be placed in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [launchpadTrustySidekick],
    });

    expect(testEngine.asPlayerOne().getCardZone(launchpadTrustySidekick)).toBe("play");
  });

  describe("WHAT DID YOU NEED? gameplay", () => {
    it("exerts Launchpad when activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [launchpadTrustySidekick],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().isExerted(launchpadTrustySidekick)).toBe(false);

      expect(
        testEngine.asPlayerOne().activateAbility(launchpadTrustySidekick),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(launchpadTrustySidekick)).toBe(true);
    });

    it("draws a card on activation (hand increases before discard resolves)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [launchpadTrustySidekick],
        hand: [handCard],
        deck: 5,
      });

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

      expect(
        testEngine.asPlayerOne().activateAbility(launchpadTrustySidekick),
      ).toBeSuccessfulCommand();

      // After activation, drew 1 card (discard is pending)
      const handAfterDraw = testEngine.asPlayerOne().getZonesCardCount().hand;
      expect(handAfterDraw).toBe(handBefore + 1);
    });

    it("draws then discards when no Darkwing Duck is in play (net zero hand change)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [launchpadTrustySidekick],
        hand: [handCard],
        deck: 5,
      });

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

      expect(
        testEngine.asPlayerOne().activateAbility(launchpadTrustySidekick),
      ).toBeSuccessfulCommand();

      // Should have a pending discard-choice effect
      const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
      expect(pendingEffects).toHaveLength(1);
      expect(pendingEffects[0]).toEqual(expect.objectContaining({ type: "discard-choice" }));

      // Resolve the discard by choosing the handCard
      const handCardInstanceId = testEngine.findCardInstanceId(handCard, "hand", "player_one");
      const discardEffect = pendingEffects[0]!;
      expect(
        testEngine.asPlayerOne().resolveEffect(discardEffect.id, { targets: [handCardInstanceId] }),
      ).toBeSuccessfulCommand();

      // Drew 1 and discarded 1 = net zero
      const handAfter = testEngine.asPlayerOne().getZonesCardCount().hand;
      expect(handAfter).toBe(handBefore);
    });

    it("only draws (no discard) when Darkwing Duck is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [launchpadTrustySidekick, darkwingDuckDrakeMallard],
        deck: 5,
      });

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

      expect(
        testEngine.asPlayerOne().activateAbility(launchpadTrustySidekick),
      ).toBeSuccessfulCommand();

      // Should NOT have a pending discard effect (Darkwing Duck prevents it)
      const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
      expect(pendingEffects).toHaveLength(0);

      // Drew 1 and no discard = net +1
      const handAfter = testEngine.asPlayerOne().getZonesCardCount().hand;
      expect(handAfter).toBe(handBefore + 1);
    });
  });
});
