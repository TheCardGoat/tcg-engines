import { expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "../../../../testing";

const topCard = createMockCharacter({ id: "scry-log-top", name: "Revealed Character", cost: 1 });
for (const revealAll of [true, false]) {
  it(`${revealAll ? "public reveal" : "private look"} followed by a revealed hand destination logs one public reveal`, () => {
    const source = createMockAction({
      id: `scry-log-${revealAll}`,
      name: "Reveal Search",
      cost: 1,
      abilities: [
        {
          type: "action",
          effect: {
            type: "scry",
            amount: 1,
            revealAll,
            destinations: [
              { zone: "hand", min: 0, max: 1, reveal: true },
              { zone: "deck-bottom", remainder: true },
            ],
          },
        },
      ],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [source],
      inkwell: 1,
      deck: [topCard],
    });
    const top = game.findCardInstanceId(topCard, "deck", "player_one")!;
    const reveals = () =>
      game
        .getServerEngine()
        .getRuntime()
        .getMoveLogHistory()
        .flatMap((entry) => entry.public)
        .filter((m) => m.key === "lorcana.effect.resolve.revealTopCard");
    expect(game.asPlayerOne().playCard(source)).toBeSuccessfulCommand();
    expect(reveals()).toHaveLength(revealAll ? 1 : 0);
    expect(
      game.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [top] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(reveals()).toHaveLength(1);
    expect(JSON.stringify(reveals())).toContain(top);
    expect(game.asPlayerOne().getCardZone(top)).toBe("hand");
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });
}
