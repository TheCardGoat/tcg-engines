import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  activeResources,
  createMockBase,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "../../index.ts";

describe("event-card modifier actions", () => {
  it("grants a keyword only to the friendly Clan Unit carried by the link event", () => {
    const observerEffect: CardEffect = {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
        conditions: [
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "clan" }],
            },
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeywordEventCard",
            keyword: "Breach",
            keywordValue: 3,
            duration: "thisTurn",
            sourceFilter: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "clan" }],
            },
          },
        },
      ],
      sourceText: "When a friendly (Clan) Unit links, it gains <Breach 3> during this turn.",
    };
    const observer = createMockBase({ effects: [observerEffect] });
    const linked = createMockUnit({
      name: "Linked Clan Unit",
      traits: ["clan"],
      linkCondition: "[Link Pilot]",
    });
    const bystander = createMockUnit({
      name: "Bystander Clan Unit",
      traits: ["clan"],
      linkCondition: "[Other Pilot]",
    });
    const pilot = createMockPilot({ name: "Link Pilot", level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [linked, bystander],
      baseSection: [observer],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [linkedId, bystanderId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(pilot, linkedId!));

    expect(p1.getVisibleCard(linkedId!)?.keywords).toContain("Breach");
    expect(p1.getVisibleCard(bystanderId!)?.keywords).not.toContain("Breach");
  });
});
