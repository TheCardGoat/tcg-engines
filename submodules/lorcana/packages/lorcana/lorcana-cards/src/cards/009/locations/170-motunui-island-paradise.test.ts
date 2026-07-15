import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { motunuiIslandParadise } from "./170-motunui-island-paradise";

const motunuiResident = createMockCharacter({
  id: "set9-motunui-resident",
  name: "Motunui Resident",
  cost: 2,
  strength: 1,
  willpower: 2,
});

const motunuiAttacker = createMockCharacter({
  id: "set9-motunui-attacker",
  name: "Motunui Attacker",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Motunui - Island Paradise", () => {
  it("can put a banished character from here into your inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          motunuiIslandParadise,
          { card: motunuiResident, atLocation: motunuiIslandParadise, exerted: true },
        ],
      },
      {
        play: [motunuiAttacker],
      },
    );
    const residentId = testEngine.findCardInstanceId(motunuiResident, "play", "player_one");

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(motunuiAttacker, motunuiResident),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().getCardZone(motunuiResident)).toBe("discard");

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(motunuiIslandParadise),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(motunuiResident)).toBe("inkwell");
    expect(
      testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[residentId]?.publicFaceState,
    ).toBe("faceDown");
    expect(testEngine.asServer().getCard(residentId)?.exerted).toBe(true);
  });
});
