import { expect, it, vi } from "vitest";
import { getCard } from "@tcg/alpha-clash-cards";
import { alphaClashCardReleaseIssue, alphaClashReleaseDecks } from "./release-policy";

// Keep missing-artwork coverage even when every current canonical face is published.
// Only the artwork lookup is unavailable; use the real card and behavior audits.
vi.mock("@tcg/alpha-clash-cards", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tcg/alpha-clash-cards")>()),
  officialCardImageUrl: () => undefined,
}));

it("withholds audited cards and curated decks when artwork mappings are unavailable", () => {
  const card = getCard("ac-ac5-133");
  const issue = `${card.name} has no published simulator artwork mapping.`;
  expect(alphaClashCardReleaseIssue(card.id)).toBe(issue);
  const deck = alphaClashReleaseDecks().find((entry) => entry.id === "season3-xiii-war");
  expect(deck?.issues).toContain(issue);
});
