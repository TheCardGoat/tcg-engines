/**
 * TargetFilter — AttributeFilter `or` variant (trait-OR primitive).
 *
 * Covers cards that print "(X) / (Y)" or "(X) OR (Y)" trait groups — e.g.
 * "Choose 1 (Zeon) OR (Neo Zeon) Unit". The outer `attributeFilters` list
 * remains AND; nesting `{ attribute: "or", filters: [...] }` gives mixed
 * AND/OR without a top-level toggle.
 */

import { describe, it, expect } from "vite-plus/test";
import type { AttributeFilter } from "@tcg/gundam-types";
import type { PlayerId } from "../types/branded.ts";
import { evaluateTargetFilter } from "./target-dsl.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  buildTargetResolutionContext,
} from "../index.ts";

function setup(friendly: ReturnType<typeof createMockUnit>[]) {
  const engine = GundamTestEngine.create({ play: friendly }, { play: [] });
  const runtime = engine.getRuntime();
  const framework = runtime.getFrameworkReadAPI();
  const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework);
  const cards = framework.zones
    .getCards({ zone: "battleArea", playerId: PLAYER_ONE as PlayerId })
    .map((id) => framework.cards.get(id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);
  const idByNumber = (cardNumber: string) =>
    runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, cardNumber);
  return { engine, runtime, ctx, cards, idByNumber };
}

describe("AttributeFilter.or (trait-OR primitive)", () => {
  it("matches a card when EITHER nested trait predicate matches", () => {
    const zeon = createMockUnit({ name: "Zaku", traits: ["zeon"] });
    const neoZeon = createMockUnit({ name: "Sazabi", traits: ["neo zeon"] });
    const { ctx, cards, idByNumber } = setup([zeon, neoZeon]);

    const matched = evaluateTargetFilter(
      {
        owner: "friendly",
        cardType: "unit",
        attributeFilters: [
          {
            attribute: "or",
            filters: [
              { attribute: "trait", comparison: "includes", value: "zeon" },
              { attribute: "trait", comparison: "includes", value: "neo zeon" },
            ],
          },
        ],
      },
      cards,
      ctx,
    );
    expect(matched).toContain(idByNumber(zeon.cardNumber));
    expect(matched).toContain(idByNumber(neoZeon.cardNumber));
    expect(matched.length).toBe(2);
  });

  it("excludes cards matching NEITHER disjunct", () => {
    const efsf = createMockUnit({ name: "GM", traits: ["earth federation"] });
    const zeon = createMockUnit({ name: "Zaku", traits: ["zeon"] });
    const { ctx, cards, idByNumber } = setup([efsf, zeon]);

    const matched = evaluateTargetFilter(
      {
        owner: "friendly",
        cardType: "unit",
        attributeFilters: [
          {
            attribute: "or",
            filters: [
              { attribute: "trait", comparison: "includes", value: "zeon" },
              { attribute: "trait", comparison: "includes", value: "neo zeon" },
            ],
          },
        ],
      },
      cards,
      ctx,
    );
    expect(matched).toContain(idByNumber(zeon.cardNumber));
    expect(matched).not.toContain(idByNumber(efsf.cardNumber));
  });

  it("composes with sibling AND predicates — (Zeon OR Neo Zeon) AND Lv<=4", () => {
    const zakuLow = createMockUnit({ name: "Zaku-Low", traits: ["zeon"], level: 2 });
    const zakuHigh = createMockUnit({ name: "Zaku-High", traits: ["zeon"], level: 6 });
    const sazabiLow = createMockUnit({ name: "Sazabi-Low", traits: ["neo zeon"], level: 3 });
    const efsf = createMockUnit({ name: "GM", traits: ["earth federation"], level: 1 });
    const { ctx, cards, idByNumber } = setup([zakuLow, zakuHigh, sazabiLow, efsf]);

    const matched = evaluateTargetFilter(
      {
        owner: "friendly",
        cardType: "unit",
        attributeFilters: [
          {
            attribute: "or",
            filters: [
              { attribute: "trait", comparison: "includes", value: "zeon" },
              { attribute: "trait", comparison: "includes", value: "neo zeon" },
            ],
          },
          { attribute: "level", comparison: "lte", value: 4 },
        ],
      },
      cards,
      ctx,
    );
    expect(matched).toContain(idByNumber(zakuLow.cardNumber));
    expect(matched).toContain(idByNumber(sazabiLow.cardNumber));
    expect(matched).not.toContain(idByNumber(zakuHigh.cardNumber)); // fails AND (level>4)
    expect(matched).not.toContain(idByNumber(efsf.cardNumber)); // fails OR (wrong trait)
  });

  it("supports nested OR groups recursively", () => {
    const a = createMockUnit({ name: "A", traits: ["zeon"] });
    const b = createMockUnit({ name: "B", traits: ["neo zeon"] });
    const c = createMockUnit({ name: "C", traits: ["zaft"] });
    const d = createMockUnit({ name: "D", traits: ["earth federation"] });
    const { ctx, cards, idByNumber } = setup([a, b, c, d]);

    const nested: AttributeFilter = {
      attribute: "or",
      filters: [
        {
          attribute: "or",
          filters: [
            { attribute: "trait", comparison: "includes", value: "zeon" },
            { attribute: "trait", comparison: "includes", value: "neo zeon" },
          ],
        },
        { attribute: "trait", comparison: "includes", value: "zaft" },
      ],
    };

    const matched = evaluateTargetFilter(
      { owner: "friendly", cardType: "unit", attributeFilters: [nested] },
      cards,
      ctx,
    );
    expect(matched).toContain(idByNumber(a.cardNumber));
    expect(matched).toContain(idByNumber(b.cardNumber));
    expect(matched).toContain(idByNumber(c.cardNumber));
    expect(matched).not.toContain(idByNumber(d.cardNumber));
  });

  it("empty `filters` is vacuously false (no disjunct can match)", () => {
    const a = createMockUnit({ name: "A", traits: ["zeon"] });
    const { ctx, cards } = setup([a]);

    const matched = evaluateTargetFilter(
      {
        owner: "friendly",
        cardType: "unit",
        attributeFilters: [{ attribute: "or", filters: [] }],
      },
      cards,
      ctx,
    );
    expect(matched).toEqual([]);
  });
});
