import { expect, it, vi } from "vitest";
import type { DeckCard } from "@tcg/shared/game-adapter";
import { HUNTERS_DECK, STORM_DECK } from "@tcg/alpha-clash-engine/testing";
import { alphaClashServerAdapter as adapter } from "./adapter";
import { alphaClashCreateServerEngine } from "./alpha-clash-engine-lifecycle";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

// Construction and seating regressions are independent of release approval.
// release-admission.test.ts exercises the real policy through public entry points.
vi.mock("./release-policy", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./release-policy")>()),
  alphaClashReleaseDeckIssue: () => undefined,
}));

const main: DeckCard[] = [
  { cardId: "ac-ac4-060", quantity: 1, sectionId: "contender" },
  ...HUNTERS_DECK.map((c) => ({ cardId: c.id, quantity: 1, sectionId: "main" })),
];
const side: DeckCard[] = STORM_DECK.slice(0, 15).map((c) => ({
  cardId: c.id,
  quantity: 1,
  sectionId: "sideboard",
}));
const validate = (deck: DeckCard[]) => adapter.validateDeckForFormat("constructed", deck);

it("admits 50 main cards plus 15 sideboard cards without counting the sideboard as main", () => {
  expect(validate([...main, ...side]).valid).toBe(true);
  expect(validate([...main.slice(0, -1), ...side]).valid).toBe(false);
});

it("reports a sideboard-size violation for 16 sideboard cards", () => {
  const deck = [...main, { cardId: STORM_DECK[0]!.id, quantity: 16, sectionId: "sideboard" }];
  const result = validate(deck);
  expect(result.valid).toBe(false);
  expect(result.rules.some((r) => !r.passed && /Sideboard/.test(r.message))).toBe(true);
});

it("enforces copies across both areas and rejects a sideboard Contender", () => {
  expect(
    validate([...main, { cardId: HUNTERS_DECK[0]!.id, quantity: 1, sectionId: "sideboard" }]).valid,
  ).toBe(false);
  expect(
    validate([...main, { cardId: "ac-st-001", quantity: 1, sectionId: "sideboard" }]).valid,
  ).toBe(false);
});

it.each([
  "ac-ac1-120",
  "ac-ac1-021",
  "ac-ac1-066",
  "ac-ac1-039",
  "ac-ac1-093",
  "ac-ks-ac1-039",
  "ac-ks-ac1-066",
])("rejects banned %s in either area", (cardId) => {
  for (const deck of [
    [...main.slice(0, -1), { cardId, quantity: 1, sectionId: "main" }],
    [...main, { cardId, quantity: 1, sectionId: "sideboard" }],
  ]) {
    const result = validate(deck);
    expect(result.valid).toBe(false);
    expect(result.rules.some((r) => !r.passed && /banned/i.test(r.message))).toBe(true);
  }
});

async function create(deck: DeckCard[], firstPlayerChooserId?: string, firstTurnPlayerId?: string) {
  const cardsMaps = adapter.buildCardInstances(
    ["alice", "bob"].map((owner) => ({
      owner,
      deck: deck.map((entry) => ({
        cardId: entry.cardId,
        qty: entry.quantity,
        sectionId: entry.sectionId,
      })),
    })),
  );
  const engine = await alphaClashCreateServerEngine({
    gameSlug: "alpha-clash",
    player1Id: "alice",
    player2Id: "bob",
    cardsMaps,
    seed: "admission",
    firstPlayerChooserId,
    firstTurnPlayerId,
  });
  if (!(engine instanceof AlphaClashServerEngine)) throw new Error("Wrong engine type");
  return engine;
}

it("starts with the selected player when the chooser elects to go second", async () => {
  const engine = await create(main, "alice", "bob");
  expect(engine.state.activePlayer).toBe("player-two");
});

it("keeps the chooser fallback for callers without a selected first player", async () => {
  expect((await create(main, "bob")).state.activePlayer).toBe("player-two");
});

it("rejects a selected starting player outside the match", async () => {
  await expect(create(main, "alice", "stranger")).rejects.toThrow(/starting player/);
});

it("does not deal sideboard cards into the game, including mixed legacy section tags", async () => {
  for (const deck of [main, main.map(({ sectionId: _section, ...entry }) => entry)]) {
    const engine = await create([...deck, ...side]);
    expect(Object.values(engine.state.cards).filter((c) => c.owner === "player-one")).toHaveLength(
      51,
    );
    expect(
      Object.values(engine.state.cards).some((c) => side.some((s) => s.cardId === c.definitionId)),
    ).toBe(false);
  }
});

// Hosted acknowledgments must survive loss of the worker before a later flush.
it("requires snapshot and commit receipt persistence before replying", () => {
  expect(adapter.persistBeforeReply).toBe(true);
});
