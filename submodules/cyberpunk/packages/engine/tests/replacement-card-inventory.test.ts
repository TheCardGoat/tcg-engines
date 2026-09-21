import { describe, expect, it } from "vite-plus/test";
import { structuredCards } from "@tcg/cyberpunk-cards";

const TEXTUAL_REPLACEMENT_OR_PREVENTION = [
  "alt-cunningham-mother-of-daemons",
  "augmented-negotiators",
  "bonnie-and-clyde",
  "corpo-security",
  "deadman-transmitter",
  "goro-takemura-hands-unclean",
  "gunpoint-diplomacy",
  "jackie-welles-mama-s-favorite",
  "kerry-eurodyne-axe-attitude-audience",
  "la-llorona-ghost-of-the-past",
  "mandibular-upgrade",
  "mox-inciters",
  "pyramid-song",
  "riot-shield",
  "rita-wheeler-no-stupid-questions",
  "royce-don-t-call-me-simon",
  "secondhand-bombus",
  "the-heist",
  "towerfall",
] as const;

const BLOCKER_SOURCES = [
  "augmented-negotiators",
  "corpo-security",
  "goro-takemura-hands-unclean",
  "goro-takemura-vengeful-bodyguard",
  "la-llorona-ghost-of-the-past",
  "lizzy-wizzy-delicate-weapon",
  "mandibular-upgrade",
  "meredith-stout-stone-cold-corpo",
  "mox-inciters",
  "riot-shield",
  "rita-wheeler-no-stupid-questions",
  "secondhand-bombus",
] as const;

describe("replacement-effect card inventory", () => {
  it("fails closed when a new 'would' or 'instead' card enters the structured catalog", () => {
    expect(canonicalIds((card) => /\b(?:would|instead)\b/i.test(card.rulesText ?? ""))).toEqual(
      [...TEXTUAL_REPLACEMENT_OR_PREVENTION].sort(),
    );
  });

  it("accounts for every card that owns or grants the Blocker game-mechanic replacement", () => {
    expect(
      canonicalIds(
        (card) =>
          card.keywords?.includes("blocker") === true ||
          card.abilities.some((ability) => JSON.stringify(ability).includes('"rule":"blocker"')),
      ),
    ).toEqual([...BLOCKER_SOURCES].sort());
  });

  it("accounts for every printed-cost replacement", () => {
    expect(canonicalIds((card) => card.costModifier?.reducer === "replace")).toEqual([
      "nocturne-op55-n1",
      "we-gotta-live-together",
    ]);
  });
});

function canonicalIds(predicate: (card: (typeof structuredCards)[number]) => boolean): string[] {
  return [
    ...new Set(structuredCards.filter(predicate).map((card) => card.canonicalId ?? card.slug)),
  ].sort();
}
