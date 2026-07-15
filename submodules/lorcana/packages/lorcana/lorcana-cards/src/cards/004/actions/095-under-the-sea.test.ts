import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import {
  arielOnHumanLegs,
  minnieMouseBelovedPrincess,
  moanaChosenByTheOcean,
  simbaProtectiveCub,
  simbaReturnedKing,
} from "../../001";
import { underTheSea } from "./095-under-the-sea";

describe("Under the Sea", () => {
  it("has the Sing Together keyword ability authored explicitly", () => {
    expect(underTheSea.abilities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          keyword: "SingTogether",
          type: "keyword",
          value: 8,
        }),
      ]),
    );
  });

  it("puts all opposing characters with 2 strength or less on the bottom without target selection", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [underTheSea],
        inkwell: underTheSea.cost,
      },
      {
        play: [simbaProtectiveCub, minnieMouseBelovedPrincess, arielOnHumanLegs],
      },
    );

    expect(testEngine.asPlayerOne().playCard(underTheSea).success).toBe(true);
    expect(testEngine.asServer().getState().G.pendingEffects).toHaveLength(0);

    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("deck");
    expect(testEngine.asPlayerTwo().getCardZone(minnieMouseBelovedPrincess)).toBe("deck");
    expect(testEngine.asPlayerTwo().getCardZone(arielOnHumanLegs)).toBe("play");
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_TWO).slice(0, 2)).toEqual([
      simbaProtectiveCub.id,
      minnieMouseBelovedPrincess.id,
    ]);

    const playLog = [...testEngine.getServerEngine().getRuntime().getMoveLogHistory()]
      .reverse()
      .find((log) => log.moveType === "playCard");
    expect(playLog).toMatchObject({
      moveType: "playCard",
      public: expect.arrayContaining([
        expect.objectContaining({
          key: "lorcana.outcome.cardsPutOnBottom",
          values: expect.objectContaining({
            cardIds: expect.arrayContaining([
              testEngine.findCardInstanceId(simbaProtectiveCub, "deck", "p2"),
              testEngine.findCardInstanceId(minnieMouseBelovedPrincess, "deck", "p2"),
            ]),
          }),
        }),
      ]),
    });
  });

  it("can be played via Sing Together 8 by exerting characters with total cost >= 8", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [underTheSea],
        play: [moanaChosenByTheOcean, simbaReturnedKing],
      },
      {
        play: [simbaProtectiveCub, minnieMouseBelovedPrincess],
      },
    );

    const result = testEngine
      .asPlayerOne()
      .playSongTogether(underTheSea, [moanaChosenByTheOcean, simbaReturnedKing]);
    expect(result).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(moanaChosenByTheOcean)).toBe(true);
    expect(testEngine.asPlayerOne().isExerted(simbaReturnedKing)).toBe(true);

    expect(testEngine.asServer().getState().G.pendingEffects).toHaveLength(0);

    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("deck");
    expect(testEngine.asPlayerTwo().getCardZone(minnieMouseBelovedPrincess)).toBe("deck");
  });
});
