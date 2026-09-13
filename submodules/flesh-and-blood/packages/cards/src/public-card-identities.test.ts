import { describe, expect, it } from "vitest";

import {
  allFleshAndBloodCards,
  fleshAndBloodPublicCardIdentities,
  getFleshAndBloodCard,
} from "./catalog.ts";

describe("FAB public card identities", () => {
  it("covers the global catalog exactly once without joined split names", () => {
    expect(fleshAndBloodPublicCardIdentities).toHaveLength(allFleshAndBloodCards.length);
    expect(
      new Set(fleshAndBloodPublicCardIdentities.map((identity) => identity.canonicalId)).size,
    ).toBe(fleshAndBloodPublicCardIdentities.length);
    expect(
      fleshAndBloodPublicCardIdentities.some((identity) =>
        identity.names.some((name) => name.includes(" // ")),
      ),
    ).toBe(false);
  });

  it("publishes each split-card face as an individual name", () => {
    const regrowthShock = fleshAndBloodPublicCardIdentities.find(
      (identity) => identity.canonicalId === "k8CgTdPKWcmLb78HKgHjk",
    );
    expect(regrowthShock?.names).toEqual(["Regrowth", "Shock"]);
  });

  it("publishes one physical DFC identity with both face names and no standalone back", () => {
    const stirThePot = fleshAndBloodPublicCardIdentities.find(
      (identity) => identity.canonicalId === "pjpcnH9bKnGR6KFCFGz6Q",
    );
    expect(stirThePot?.names).toEqual(["Stir the Pot", "Inner Chi"]);
    expect(getFleshAndBloodCard("FRTnBzBCRC7TbNhdKLWqW")?.name).toBe("Inner Chi");
    expect(allFleshAndBloodCards.some((card) => card.name === "Inner Chi")).toBe(false);
  });

  it("keeps independently printed cards that are also used as a DFC back", () => {
    expect(getFleshAndBloodCard("nkCCKCB8ftPdMCHHWHWtk")?.name).toBe("Scabskin Leathers");
    expect(allFleshAndBloodCards.some((card) => card.name === "Scabskin Leathers")).toBe(true);
    expect(
      fleshAndBloodPublicCardIdentities.find(
        (identity) => identity.canonicalId === "nkCCKCB8ftPdMCHHWHWtk",
      )?.names,
    ).toEqual(["Scabskin Leathers"]);
  });

  it("publishes hero and Living Legend eligibility for rules-level name restrictions", () => {
    const bravoShowstopper = fleshAndBloodPublicCardIdentities.find((identity) =>
      identity.names.includes("Bravo, Showstopper"),
    );
    const snatch = fleshAndBloodPublicCardIdentities.find((identity) =>
      identity.names.includes("Snatch"),
    );

    expect(bravoShowstopper).toMatchObject({
      isHero: true,
      legalInLivingLegend: true,
    });
    expect(snatch).not.toHaveProperty("isHero");
    expect(snatch).not.toHaveProperty("legalInLivingLegend");
  });
});
