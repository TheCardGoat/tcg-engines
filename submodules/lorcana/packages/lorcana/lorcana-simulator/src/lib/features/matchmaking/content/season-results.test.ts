import { describe, expect, it } from "vitest";
import { getSeasonResults } from "./season-results.js";

describe("getSeasonResults", () => {
  it("returns the ordered Wilds Unknown podiums", () => {
    const results = getSeasonResults("wilds-unknown");

    expect(results?.formats.map((format) => format.formatName)).toEqual([
      "Infinity",
      "Core Constructed",
    ]);
    expect(results?.formats[0]?.standings.map((standing) => standing.playerName)).toEqual([
      "Trusty Ham Hands",
      "urbaro",
      "Arashinbo",
    ]);
    expect(results?.formats[1]?.standings.map((standing) => standing.playerName)).toEqual([
      "Donald Duck In The Moment",
      "Maldah",
      "Trusty Ham Hands",
    ]);
    expect(Object.keys(results?.formats[0]?.standings[0] ?? {}).sort()).toEqual([
      "place",
      "playerName",
      "tier",
    ]);
  });

  it("does not attach results to other seasons", () => {
    expect(getSeasonResults("attack-of-the-vine")).toBeNull();
  });
});
