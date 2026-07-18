import { describe, expect, it } from "vitest";
import { getHistoricSeason, listHistoricSeasons } from "./historic-seasons.js";

describe("getHistoricSeason", () => {
  it("keeps the completed Wilds Unknown season page available", () => {
    expect(getHistoricSeason("wilds-unknown")).toMatchObject({
      name: "Wilds Unknown",
      slug: "wilds-unknown",
      isActive: false,
      contentJson: {
        prizeStructure: [{ format: "Best of 1" }, { format: "Best of 3" }],
      },
    });
  });

  it("does not replace API-backed seasons", () => {
    expect(getHistoricSeason("attack-of-the-vine")).toBeNull();
  });

  it("lists completed seasons for season navigation", () => {
    expect(listHistoricSeasons().map((season) => season.slug)).toEqual(["wilds-unknown"]);
  });
});
