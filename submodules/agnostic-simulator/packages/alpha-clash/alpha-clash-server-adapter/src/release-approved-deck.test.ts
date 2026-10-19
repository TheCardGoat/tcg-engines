import { expect, it } from "vitest";
import { alphaClashServerAdapter as adapter } from "./adapter";
import { alphaClashReleaseDecks } from "./release-policy";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

// Uses the real audit manifest, policy, preset lookup and public lifecycle.
it.each([
  "clarity-hyper-aggro",
  "season3-undefendable-clarity",
  "season3-fexar-clarity",
  "absence-makati",
  "season3-xiii-war",
  "season3-silou-clarity",
  "season3-sloppy-valen",
  "season3-silou-death",
])("publishes and starts audited deck %s through the real public gate", async (deckId) => {
  expect(alphaClashReleaseDecks().find((deck) => deck.id === deckId)?.issues).toEqual([]);
  expect(adapter.practiceDecks!.ids).toContain(deckId);
  const deck = adapter.practiceDecks!.getDeck(`${deckId}@42`)!;
  expect(adapter.validateDeckForFormat("constructed", deck).valid).toBe(true);
  const cardsMaps = adapter.buildCardInstances(
    ["alice", "bob"].map((owner) => ({
      owner,
      deck: deck.map(({ quantity, ...entry }) => ({ ...entry, qty: quantity })),
    })),
  );
  const engine = await adapter.createServerEngine!({
    gameSlug: "alpha-clash",
    player1Id: "alice",
    player2Id: "bob",
    firstTurnPlayerId: "bob",
    seed: "approved",
    cardsMaps,
  });
  expect(engine).toBeInstanceOf(AlphaClashServerEngine);
  if (!(engine instanceof AlphaClashServerEngine)) throw new Error("Wrong engine");
  expect(engine.state.activePlayer).toBe("player-two");
  expect(
    Object.values(engine.state.cards).filter(
      (card) => card.owner === "player-one" && card.zone === "hand",
    ),
  ).toHaveLength(8);
});

it("also checks the second player's deck", async () => {
  const deck = adapter.practiceDecks!.getDeck("clarity-hyper-aggro")!;
  const cardsMaps = adapter.buildCardInstances(
    ["alice", "bob"].map((owner) => ({
      owner,
      deck: (owner === "bob" ? deck.slice(0, -1) : deck).map(({ quantity, ...entry }) => ({
        ...entry,
        qty: quantity,
      })),
    })),
  );
  await expect(
    adapter.createServerEngine!({
      gameSlug: "alpha-clash",
      player1Id: "alice",
      player2Id: "bob",
      cardsMaps,
    }),
  ).rejects.toThrow(/admission for bob/);
});
