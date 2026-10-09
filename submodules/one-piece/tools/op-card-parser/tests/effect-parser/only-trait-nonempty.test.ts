import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/index.ts";

describe("only-trait Character conditions (official FAQ Q1084)", () => {
  test.each([
    'you only have Characters with a type including "GERMA"',
    'you only have "GERMA" type Characters',
    "the only Characters on your field are {GERMA} type Characters",
  ])("%s requires at least one Character and excludes other traits", (clause) => {
    const block = buildCardEffects(`[On Play] If ${clause}, draw 1 card.`)?.effects?.[0];
    expect(block?.conditions).toEqual([
      {
        condition: "compound",
        operator: "and",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 1,
          },
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "eq",
            value: 0,
            filters: [
              {
                filter: "trait",
                value: "GERMA",
                match: clause.includes("including") ? "includes" : "exact",
                negate: true,
              },
            ],
          },
        ],
      },
    ]);
    expect(block?.actions).toEqual([{ action: "draw", player: "self", amount: 1 }]);
  });

  test("an explicit empty Character area condition still permits zero", () => {
    const block = buildCardEffects("[On Play] If you have 0 Characters, draw 1 card.")
      ?.effects?.[0];
    expect(block?.conditions).toEqual([
      { condition: "zoneCount", player: "self", zone: "character", comparison: "eq", value: 0 },
    ]);
  });
});
