import { describe, expect, it } from "vite-plus/test";
import { ShieldAlertIcon } from "lucide-react";

import { getCardTags, TAG_TONE_CLASSES, type TagTone } from "../card/card-tags.ts";
import type { GameCardData } from "../types.ts";

function makeCard(overrides: Partial<GameCardData> = {}): GameCardData {
  return {
    id: "inst-001",
    name: "Test Unit",
    cardType: "unit",
    ...overrides,
  };
}

describe("getCardTags", () => {
  it("returns empty array for card with no tags", () => {
    const tags = getCardTags(makeCard());
    expect(tags).toEqual([]);
  });

  it("returns keyword tags from card.keywords", () => {
    const tags = getCardTags(
      makeCard({
        keywords: [{ keyword: "Blocker" }],
      }),
    );
    expect(tags).toHaveLength(1);
    expect(tags[0].id).toBe("kw-Blocker");
    expect(tags[0].icon).toBe(ShieldAlertIcon);
    expect(tags[0].tone).toBe("info");
  });

  it("returns keyword tags with value", () => {
    const tags = getCardTags(
      makeCard({
        keywords: [{ keyword: "Repair", value: 2 }],
      }),
    );
    expect(tags).toHaveLength(1);
    expect(tags[0].id).toBe("kw-Repair");
  });

  it("returns granted keyword tags with success tone", () => {
    const tags = getCardTags(
      makeCard({
        keywords: [{ keyword: "Blocker" }],
        grantedKeywords: ["FirstStrike"],
      }),
    );
    expect(tags).toHaveLength(2);
    expect(tags[0].id).toBe("kw-Blocker");
    expect(tags[1].id).toBe("granted-FirstStrike");
    expect(tags[1].tone).toBe("success");
  });

  it("deduplicates granted keywords already in card.keywords", () => {
    const tags = getCardTags(
      makeCard({
        keywords: [{ keyword: "Blocker" }],
        grantedKeywords: ["Blocker"],
      }),
    );
    expect(tags).toHaveLength(1);
    expect(tags[0].id).toBe("kw-Blocker");
  });

  it("does not emit a standalone 'deployed' chip (overlay replaces it)", () => {
    // The full-card diagonal-stripe overlay in CardFace conveys the
    // deploy-summoning-sick state visually; chip removed to avoid
    // double-encoding. A dedicated `cant-attack` chip is emitted instead
    // (see #7) when `cantAttack` is true.
    const tags = getCardTags(makeCard({ deployedThisTurn: true }));
    expect(tags.find((t) => t.id === "deployed")).toBeUndefined();
  });

  it("returns active effects tag with count", () => {
    const tags = getCardTags(
      makeCard({
        activeEffects: [
          { sourceId: "a", kind: "stat-modifier", description: "AP +2", duration: "this-turn" },
        ],
      }),
    );
    expect(tags).toHaveLength(1);
    expect(tags[0].id).toBe("effects");
    expect(tags[0].label).toBe("1");
    expect(tags[0].tooltip).toBe("AP +2");
  });

  it("renders keyword-grant active effects as the granted keyword", () => {
    const tags = getCardTags(
      makeCard({
        activeEffects: [
          {
            sourceId: "command",
            kind: "keyword-grant",
            keyword: "FirstStrike",
            description: "Grant: FirstStrike",
            duration: "this-turn",
          },
        ],
      }),
    );
    expect(tags).toHaveLength(1);
    expect(tags[0].id).toBe("effect-FirstStrike");
    expect(tags[0].label).toBe("FIRST STRIKE");
    expect(tags[0].tooltip).toBe("This Unit deals battle damage before the opponent.");
  });

  it("does not duplicate keyword-grant active effects already surfaced in grantedKeywords", () => {
    const tags = getCardTags(
      makeCard({
        grantedKeywords: ["FirstStrike"],
        activeEffects: [
          {
            sourceId: "command",
            kind: "keyword-grant",
            keyword: "FirstStrike",
            description: "Grant: FirstStrike",
          },
        ],
      }),
    );
    expect(tags.map((tag) => tag.id)).toEqual(["granted-FirstStrike"]);
  });

  it("returns exerted tag", () => {
    const tags = getCardTags(makeCard({ exerted: true }));
    expect(tags).toHaveLength(1);
    expect(tags[0].id).toBe("rested");
    expect(tags[0].tone).toBe("warning");
  });

  it("returns link tag when linkRequirement is set", () => {
    const tags = getCardTags(makeCard({ linkRequirement: "Pilot" }));
    expect(tags).toHaveLength(1);
    expect(tags[0].id).toBe("link");
    expect(tags[0].tone).toBe("info");
  });

  it("returns damage tag when damage > 0", () => {
    const tags = getCardTags(makeCard({ damage: 3 }));
    expect(tags).toHaveLength(1);
    expect(tags[0].id).toBe("damage");
    expect(tags[0].label).toBe("3");
    expect(tags[0].tone).toBe("danger");
  });

  it("does not return damage tag when damage is 0", () => {
    const tags = getCardTags(makeCard({ damage: 0 }));
    expect(tags.find((t) => t.id === "damage")).toBeUndefined();
  });

  it("returns cant-attack chip with deployed-tooltip when a non-Link unit was just played", () => {
    const tags = getCardTags(
      makeCard({ cantAttack: true, deployedThisTurn: true, isLinkUnit: false }),
    );
    const chip = tags.find((t) => t.id === "cant-attack");
    expect(chip).toBeDefined();
    expect(chip?.tone).toBe("danger");
    expect(chip?.tooltip).toContain("Newly deployed");
  });

  it("returns cant-attack chip with generic-tooltip when the restriction is effect-driven", () => {
    const tags = getCardTags(makeCard({ cantAttack: true, deployedThisTurn: false }));
    const chip = tags.find((t) => t.id === "cant-attack");
    expect(chip).toBeDefined();
    expect(chip?.tooltip).toBe("Cannot attack this turn.");
  });

  it("returns cant-block chip when cantBlock is true", () => {
    const tags = getCardTags(makeCard({ cantBlock: true }));
    const chip = tags.find((t) => t.id === "cant-block");
    expect(chip).toBeDefined();
    expect(chip?.tone).toBe("warning");
  });

  it("returns multiple tag types combined", () => {
    const tags = getCardTags(
      makeCard({
        keywords: [{ keyword: "Blocker" }],
        grantedKeywords: ["Repair"],
        deployedThisTurn: true,
        exerted: true,
        damage: 2,
        activeEffects: [{ sourceId: "x", kind: "stat-modifier", description: "AP +1" }],
      }),
    );
    const ids = tags.map((t) => t.id);
    expect(ids).toContain("kw-Blocker");
    expect(ids).toContain("granted-Repair");
    expect(ids).toContain("effects");
    expect(ids).toContain("rested");
    expect(ids).toContain("damage");
    // 'deployed' chip was removed in favor of the full-card overlay.
    expect(ids).not.toContain("deployed");
  });
});

describe("TAG_TONE_CLASSES", () => {
  it("has classes for all tone values", () => {
    const tones: TagTone[] = ["default", "info", "success", "warning", "danger"];
    for (const tone of tones) {
      expect(TAG_TONE_CLASSES[tone]).toBeTruthy();
    }
  });
});
