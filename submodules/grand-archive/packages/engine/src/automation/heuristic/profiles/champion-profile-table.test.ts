import { describe, expect, it } from "vitest";
import type { GrandArchiveBotStrategy } from "../../bot-strategies.ts";
import {
  createGrandArchiveChampionMatcher,
  resolveGrandArchiveChampionProfileBinding,
  type GrandArchiveChampionIdentity,
  type GrandArchiveChampionProfileBinding,
} from "./champion-profile-table.ts";

const abstain: GrandArchiveBotStrategy = () => null;
const champion: GrandArchiveChampionIdentity = {
  canonicalId: "lorraine-level-one",
  name: "Lorraine, Wandering Warrior",
  lineageName: "Lorraine",
  level: 1,
};

function binding(
  id: string,
  championMatch: GrandArchiveChampionProfileBinding["championMatch"],
): GrandArchiveChampionProfileBinding {
  return { id, label: id, description: id, strategy: abstain, championMatch };
}

describe("Grand Archive champion profile identity", () => {
  it("matches exact canonical, printed, or explicit lineage identity without fuzzy substrings", () => {
    expect(
      createGrandArchiveChampionMatcher({ canonicalIds: [champion.canonicalId] })(champion),
    ).toBe(true);
    expect(
      createGrandArchiveChampionMatcher({ names: ["lorraine, wandering warrior"] })(champion),
    ).toBe(true);
    expect(createGrandArchiveChampionMatcher({ lineageNames: ["LORRAINE"] })(champion)).toBe(true);
    expect(createGrandArchiveChampionMatcher({ names: ["Lorraine"] })(champion)).toBe(false);
  });

  it("fails empty matcher declarations and resolves ordered bindings first-match-wins", () => {
    expect(() => createGrandArchiveChampionMatcher({})).toThrow(/at least one exact identity/);
    const first = binding(
      "first",
      createGrandArchiveChampionMatcher({ lineageNames: ["Lorraine"] }),
    );
    const second = binding(
      "second",
      createGrandArchiveChampionMatcher({ canonicalIds: [champion.canonicalId] }),
    );

    expect(resolveGrandArchiveChampionProfileBinding(champion, [first, second])).toBe(first);
  });
});
