import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getCard, officialCardImageUrl } from "@tcg/alpha-clash-cards";
import type { DeckCard } from "@tcg/shared/game-adapter";
import { alphaClashServerAdapter as adapter } from "./adapter";
import { resolveAlphaClashLabDeck, containsUnparsed } from "./practice-decks";
import {
  alphaClashCardReleaseIssue,
  alphaClashReleaseDeckIssue,
  alphaClashReleaseDecks,
} from "./release-policy";
import reviewed from "./release-card-audits.json" with { type: "json" };

const lab = resolveAlphaClashLabDeck("clarity-hyper-aggro");
const entries: DeckCard[] = [
  { cardId: lab.contenderId, quantity: 1, sectionId: "contender" },
  ...lab.deckIds.map((cardId) => ({ cardId, quantity: 1, sectionId: "main" })),
];
// Synthetic approval is used only to exercise pure matching, never the public gate.
const approved = [{ id: "clarity-hyper-aggro", ...lab, issues: [] }];
const maps = (deck: readonly DeckCard[]) =>
  adapter.buildCardInstances(
    ["alice", "bob"].map((owner) => ({
      owner,
      deck: deck.map(({ quantity, ...entry }) => ({ ...entry, qty: quantity })),
    })),
  );

describe("explicit card audit evidence", () => {
  it("keeps behavior audits current, independently enforces artwork, and links regressions", () => {
    expect(reviewed.rulesVersion).toBe("8.0");
    expect(new Set(reviewed.cards.map((card) => card.cardId)).size).toBe(reviewed.cards.length);
    for (const audit of reviewed.cards) {
      expect(alphaClashCardReleaseIssue(audit.cardId), audit.cardId).toBe(
        officialCardImageUrl(audit.cardId)
          ? undefined
          : `${getCard(audit.cardId).name} has no published simulator artwork mapping.`,
      );
      for (const test of audit.regressions) {
        expect(
          existsSync(
            new URL(`../../../../../alpha-clash/packages/engine/src/spec/${test}`, import.meta.url),
          ),
          test,
        ).toBe(true);
      }
    }
  });

  it.each([
    "ac-ac4-001",
    "ac-ac5-012",
    "ac-ac5-133",
    "ac-ac7-072",
    "ac-ac7-205",
    "ac-ac8-181",
    "ac-cp-004",
  ])("admits behavior-audited card %s after its artwork publication", (id) => {
    expect(reviewed.cards.some((audit) => audit.cardId === id)).toBe(true);
    expect(officialCardImageUrl(id)).toBeDefined();
    expect(alphaClashCardReleaseIssue(id)).toBeUndefined();
  });

  it("still withholds Kilimanjaro for Endless Cycle construction after artwork publication", () => {
    expect(
      alphaClashReleaseDecks().find((deck) => deck.id === "season3-avalogaming-kilimanjaro")
        ?.issues,
    ).toEqual([
      'The Contender does not satisfy the deck-building restriction of "Endless Cycle" (100.2g).',
    ]);
  });

  it("does not infer approval from the absence of unparsed effects", () => {
    const card = getCard(lab.contenderId);
    expect(containsUnparsed(card)).toBe(false);
    expect(alphaClashCardReleaseIssue(card.id, [])).toContain("not passed");
  });

  it("invalidates stale behavior or printed definitions and missing regression evidence", () => {
    const audit = reviewed.cards[0]!;
    expect(
      alphaClashCardReleaseIssue(audit.cardId, [{ ...audit, reviewedDefinition: {} }]),
    ).toContain("changed since");
    expect(alphaClashCardReleaseIssue(audit.cardId, [{ ...audit, regressions: [] }])).toContain(
      "not passed",
    );
    expect(alphaClashCardReleaseIssue("unknown")).toContain("Unknown card");
  });

  it("still applies native construction when all cards have hypothetical approval", () => {
    const invalid = resolveAlphaClashLabDeck("season3-avalogaming-kilimanjaro");
    const audits = [...new Set([invalid.contenderId, ...invalid.deckIds])].map((cardId) => ({
      cardId,
      reviewedDefinition: getCard(cardId),
      regressions: ["synthetic.test.ts"],
    }));
    expect(
      alphaClashReleaseDecks(audits)
        .find((deck) => deck.id === "season3-avalogaming-kilimanjaro")
        ?.issues.join(" "),
    ).toMatch(/Endless Cycle|Affinity/);
  });
});

describe("exact curated contents", () => {
  it("accepts an approved deck regardless of order, aggregation or legacy section omission", () => {
    const grouped = new Map<string, number>();
    for (const entry of entries)
      grouped.set(entry.cardId, (grouped.get(entry.cardId) ?? 0) + entry.quantity);
    for (const deck of [
      entries,
      [...entries].reverse(),
      [...grouped].map(([cardId, quantity]) => ({ cardId, quantity })),
    ]) {
      expect(alphaClashReleaseDeckIssue(deck, approved)).toBeUndefined();
    }
  });

  it("rejects changes to main deck, counts, contender and sections", () => {
    for (const deck of [
      entries.slice(0, -1),
      [...entries, entries[1]!],
      [{ ...entries[0]!, cardId: "ac-st-001" }, ...entries.slice(1)],
      [
        entries[0]!,
        ...entries
          .slice(1)
          .map((entry, i) => (i === 0 ? { ...entry, cardId: "ac-ac1-003" } : entry)),
      ],
    ])
      expect(alphaClashReleaseDeckIssue(deck, approved)).toContain("exact audited");
    expect(
      alphaClashReleaseDeckIssue(
        entries.map((e) => ({ ...e, sectionId: "sideboard" })),
        approved,
      ),
    ).toContain("main deck only");
    expect(
      alphaClashReleaseDeckIssue(
        [{ ...entries[0]!, sectionId: "main" }, ...entries.slice(1)],
        approved,
      ),
    ).toContain("Contender cannot");
    expect(
      alphaClashReleaseDeckIssue(
        [entries[0]!, { ...entries[1]!, sectionId: "contender" }, ...entries.slice(2)],
        approved,
      ),
    ).toContain("must contain a Contender");
    expect(
      alphaClashReleaseDeckIssue(
        entries.map((e) => ({ ...e, sectionId: "unknown" })),
        approved,
      ),
    ).toContain("main deck only");
  });

  it.each([0, -1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER])(
    "rejects malformed quantity %s before expansion",
    (quantity) => {
      const deck = [{ ...entries[0]!, quantity }, ...entries.slice(1)];
      expect(alphaClashReleaseDeckIssue(deck, approved)).toContain("positive whole");
      expect(adapter.validateDeckForFormat("casual", deck).valid).toBe(false);
      expect(() => maps(deck)).toThrow(/positive whole/);
    },
  );

  it("rejects excessive allocation before building any instances", () => {
    expect(() => maps([{ cardId: entries[1]!.cardId, quantity: 77 }])).toThrow(/at most 76/);
  });
});

describe("public release admission (real policy, no mocks)", () => {
  const withheld = resolveAlphaClashLabDeck("season3-avalogaming-kilimanjaro");
  const withheldEntries: DeckCard[] = [
    { cardId: withheld.contenderId, quantity: 1, sectionId: "contender" },
    ...withheld.deckIds.map((cardId) => ({ cardId, quantity: 1, sectionId: "main" })),
  ];
  it.each([undefined, "casual", "constructed", "practice"])(
    "does not bypass release requirements for format %s",
    async (formatId) => {
      expect(adapter.validateDeckForFormat(formatId ?? "", withheldEntries).valid).toBe(false);
      await expect(
        adapter.createServerEngine!({
          gameSlug: "alpha-clash",
          player1Id: "alice",
          player2Id: "bob",
          seed: "release",
          formatId,
          cardsMaps: maps(withheldEntries),
        }),
      ).rejects.toThrow(/release admission.*not approved/);
    },
  );

  it("rejects arbitrary casual lists and missing catalog instances at creation", async () => {
    for (const cardsMaps of [
      maps(entries.slice(0, 10)),
      { cardInstances: {}, owners: { alice: ["missing"] } },
    ]) {
      await expect(
        adapter.createServerEngine!({
          gameSlug: "alpha-clash",
          player1Id: "alice",
          player2Id: "bob",
          cardsMaps,
        }),
      ).rejects.toThrow(/release admission/);
    }
  });

  it("rejects sideboards at the release boundary", async () => {
    const deck = [...entries, { ...entries[1]!, sectionId: "sideboard" }];
    expect(
      adapter
        .validateDeckForFormat("constructed", deck)
        .rules.find((rule) => rule.kind === "audited-curated-deck")?.message,
    ).toContain("main deck only");
    await expect(
      adapter.createServerEngine!({
        gameSlug: "alpha-clash",
        player1Id: "alice",
        player2Id: "bob",
        cardsMaps: maps(deck),
      }),
    ).rejects.toThrow(/main deck only/);
  });
});
