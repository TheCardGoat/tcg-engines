import { describe, it, expect } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, minnieMouseAlwaysClassy } from "@tcg/lorcana-cards/cards/001";

describe("Challenge Animation Packet", () => {
  it("emits lorcana.challenge packet when a character challenges another character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mickeyMouseTrueFriend],
      },
      {
        play: [{ card: minnieMouseAlwaysClassy, exerted: true }],
        deck: 1,
      },
    );

    testEngine.asPlayerOne().challenge(mickeyMouseTrueFriend, minnieMouseAlwaysClassy);
    const packet = testEngine.asLorcanaPlayerOne().getLastPacketUpdate();
    const animations = packet?.animations ?? [];

    const challengeAnimation = animations.find((a) => a.kind === "lorcana.challenge");
    expect(challengeAnimation).toBeDefined();
    expect(challengeAnimation?.payload).toEqual(
      expect.objectContaining({
        actorSide: "playerOne",
        defenderKind: "character",
      }),
    );

    const payload = challengeAnimation?.payload as Record<string, unknown>;
    expect(typeof payload.attackerId).toBe("string");
    expect(typeof payload.defenderId).toBe("string");
    expect(typeof payload.attackerDamageDealt).toBe("number");
    expect(typeof payload.defenderDamageDealt).toBe("number");
    expect(typeof payload.attackerWouldBeBanished).toBe("boolean");
    expect(typeof payload.defenderWouldBeBanished).toBe("boolean");

    expect(payload.attackerDamageDealt).toBeGreaterThanOrEqual(0);
    expect(payload.defenderDamageDealt).toBeGreaterThanOrEqual(0);
  });

  it("reports correct damage values from challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mickeyMouseTrueFriend],
      },
      {
        play: [{ card: minnieMouseAlwaysClassy, exerted: true }],
        deck: 1,
      },
    );

    testEngine.asPlayerOne().challenge(mickeyMouseTrueFriend, minnieMouseAlwaysClassy);
    const packet = testEngine.asLorcanaPlayerOne().getLastPacketUpdate();
    const challengeAnimation = packet?.animations.find((a) => a.kind === "lorcana.challenge");
    const payload = challengeAnimation?.payload as Record<string, unknown>;

    expect(payload.attackerDamageDealt).toBe(mickeyMouseTrueFriend.strength);
    expect(payload.defenderDamageDealt).toBe(minnieMouseAlwaysClassy.strength);
  });

  it("reports banishment when defender would be banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mickeyMouseTrueFriend],
      },
      {
        play: [{ card: minnieMouseAlwaysClassy, exerted: true }],
        deck: 1,
      },
    );

    testEngine.asPlayerOne().challenge(mickeyMouseTrueFriend, minnieMouseAlwaysClassy);
    const packet = testEngine.asLorcanaPlayerOne().getLastPacketUpdate();
    const challengeAnimation = packet?.animations.find((a) => a.kind === "lorcana.challenge");
    const payload = challengeAnimation?.payload as Record<string, unknown>;

    const minnieWillpower = minnieMouseAlwaysClassy.willpower;
    const mickeyStrength = mickeyMouseTrueFriend.strength;
    const defenderShouldBeBanished = mickeyStrength >= minnieWillpower;
    expect(payload.defenderWouldBeBanished).toBe(defenderShouldBeBanished);
  });
});
