import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { sulleyProtectiveMonster } from "./128-sulley-protective-monster";

const exertedInk = createMockCharacter({
  id: "sulley-protective-exerted-ink",
  name: "Exerted Ink",
  cost: 1,
});

describe("Sulley - Protective Monster", () => {
  it("may exert all cards in your inkwell when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sulleyProtectiveMonster],
      inkwell: 3,
      deck: 3,
    });

    expect(testEngine.asPlayerOne().playCard(sulleyProtectiveMonster)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(sulleyProtectiveMonster, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    const state = testEngine.getAuthoritativeState();
    for (const cardId of testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)) {
      expect(state.ctx.zones.private.cardMeta[cardId]?.state).toBe("exerted");
    }
  });

  it("logs Fearsome Glare as a grouped inkwell exert outcome", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sulleyProtectiveMonster],
      inkwell: 5,
      deck: 5,
    });

    expect(testEngine.asPlayerOne().playCard(sulleyProtectiveMonster)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(sulleyProtectiveMonster, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    const resolveBagLog = [...testEngine.getServerEngine().getRuntime().getMoveLogHistory()]
      .reverse()
      .find((log) => log.moveType === "resolveBag");
    expect(resolveBagLog?.public).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "lorcana.outcome.inkwellCardsExerted",
          values: { playerId: PLAYER_ONE, amount: 2 },
        }),
      ]),
    );
    expect(resolveBagLog?.public).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ key: "lorcana.outcome.cardExerted" })]),
    );
  });

  it("gains Rush while all cards in your inkwell are exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [sulleyProtectiveMonster],
      inkwell: [{ card: exertedInk, exerted: true }],
    });

    expect(testEngine.asPlayerOne().hasKeyword(sulleyProtectiveMonster, "Rush")).toBe(true);
  });
});
