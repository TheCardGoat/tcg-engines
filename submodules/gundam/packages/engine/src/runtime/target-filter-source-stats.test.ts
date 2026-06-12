/**
 * AttributeFilter source-stat sentinels — `{ value: { ref: "source", stat } }`
 * resolves the comparison RHS from the effect source's own stat rather than
 * a printed literal. Covers card text like "enemy Unit whose Lv. is equal
 * to or lower than this Unit" (Marida Cruz, Haman Karn).
 *
 * For pilot-resident effects, "this Unit" refers to the paired unit per
 * rule 3-3-9-1; the engine reads via `ctx.selfIdentityCardId`, which is
 * rebound by `buildTargetResolutionContext`.
 */

import { describe, it, expect } from "vite-plus/test";
import type { PlayerId } from "../types/branded.ts";
import { evaluateTargetFilter } from "./target-dsl.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  buildTargetResolutionContext,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "../index.ts";

describe("AttributeFilter source-stat sentinels", () => {
  it("level lte { ref: source, stat: level } matches candidates at or below the source's level", () => {
    const source = createMockUnit({ name: "Source", ap: 2, hp: 3, level: 3, cost: 2 });
    const low = createMockUnit({ name: "Low", ap: 2, hp: 3, level: 2, cost: 2 });
    const equal = createMockUnit({ name: "Equal", ap: 2, hp: 3, level: 3, cost: 2 });
    const high = createMockUnit({ name: "High", ap: 2, hp: 3, level: 4, cost: 2 });

    const engine = GundamTestEngine.create({ play: [source] }, { play: [low, equal, high] });
    const runtime = engine.getRuntime();
    const framework = runtime.getFrameworkReadAPI();
    const sourceId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, source.cardNumber)!;
    const lowId = runtime.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, low.cardNumber)!;
    const equalId = runtime.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, equal.cardNumber)!;
    const highId = runtime.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, high.cardNumber)!;

    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework, {
      sourceCardId: sourceId,
    });

    const candidates = framework.zones
      .getCards({ zone: "battleArea", playerId: PLAYER_TWO })
      .map((id) => framework.cards.get(id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);

    const matched = evaluateTargetFilter(
      {
        owner: "opponent",
        cardType: "unit",
        attributeFilters: [
          {
            attribute: "level",
            comparison: "lte",
            value: { ref: "source", stat: "level" },
          },
        ],
      },
      candidates,
      ctx,
    );

    expect(matched).toContain(lowId);
    expect(matched).toContain(equalId);
    expect(matched).not.toContain(highId);
  });

  it("negative: nothing matches when no candidate's stat satisfies the sentinel", () => {
    const source = createMockUnit({ name: "Source", ap: 2, hp: 3, level: 1, cost: 2 });
    const e1 = createMockUnit({ name: "E1", ap: 2, hp: 3, level: 5, cost: 2 });
    const e2 = createMockUnit({ name: "E2", ap: 2, hp: 3, level: 6, cost: 2 });

    const engine = GundamTestEngine.create({ play: [source] }, { play: [e1, e2] });
    const runtime = engine.getRuntime();
    const framework = runtime.getFrameworkReadAPI();
    const sourceId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, source.cardNumber)!;

    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework, {
      sourceCardId: sourceId,
    });
    const candidates = framework.zones
      .getCards({ zone: "battleArea", playerId: PLAYER_TWO })
      .map((id) => framework.cards.get(id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);

    // "Lv. less than this Unit's Lv." — source Lv. 1, no enemy qualifies.
    const matched = evaluateTargetFilter(
      {
        owner: "opponent",
        cardType: "unit",
        attributeFilters: [
          {
            attribute: "level",
            comparison: "lt",
            value: { ref: "source", stat: "level" },
          },
        ],
      },
      candidates,
      ctx,
    );
    expect(matched).toEqual([]);
  });

  it("pilot source rebinds to paired unit (rule 3-3-9-1): Lv. read from paired unit, not pilot", () => {
    // Unit at Lv. 5; pilot at Lv. 2. "This Unit's Lv." on pilot text must
    // resolve to 5 (the paired unit), not 2 (the pilot itself).
    const unit = createMockUnit({
      name: "PairedUnit",
      ap: 2,
      hp: 3,
      level: 5,
      cost: 2,
      linkCondition: "[Any Pilot]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const pilot = createMockPilot({ name: "Any Pilot", level: 2, cost: 1 });

    const low = createMockUnit({ name: "Low", ap: 2, hp: 3, level: 3, cost: 2 });
    const high = createMockUnit({ name: "High", ap: 2, hp: 3, level: 6, cost: 2 });

    const engine = GundamTestEngine.create(
      { hand: [unit, pilot], resourceArea: activeResources(5) },
      { play: [low, high] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(pilot, unit));

    const runtime = engine.getRuntime();
    const framework = runtime.getFrameworkReadAPI();
    const pilotId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, pilot.cardNumber)!;
    const lowId = runtime.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, low.cardNumber)!;
    const highId = runtime.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, high.cardNumber)!;

    // Source = pilot → ctx.selfIdentityCardId rebinds to paired unit (Lv. 5).
    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework, {
      sourceCardId: pilotId,
    });

    const candidates = framework.zones
      .getCards({ zone: "battleArea", playerId: PLAYER_TWO })
      .map((id) => framework.cards.get(id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);

    const matched = evaluateTargetFilter(
      {
        owner: "opponent",
        cardType: "unit",
        attributeFilters: [
          {
            attribute: "level",
            comparison: "lte",
            value: { ref: "source", stat: "level" },
          },
        ],
      },
      candidates,
      ctx,
    );
    // low (Lv. 3) ≤ 5 ✓; high (Lv. 6) > 5 ✗. If the sentinel had read the
    // pilot's own Lv. 2, neither candidate would match.
    expect(matched).toContain(lowId);
    expect(matched).not.toContain(highId);
  });

  it("composes with other attribute filters (ANDed)", () => {
    const source = createMockUnit({ name: "Source", ap: 4, hp: 3, level: 4, cost: 2 });
    const match = createMockUnit({
      name: "Match",
      ap: 2,
      hp: 3,
      level: 3,
      cost: 2,
      traits: ["zeon"],
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const wrongTrait = createMockUnit({
      name: "WrongTrait",
      ap: 2,
      hp: 3,
      level: 3,
      cost: 2,
      traits: ["earth federation"],
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const wrongLv = createMockUnit({
      name: "WrongLv",
      ap: 2,
      hp: 3,
      level: 5,
      cost: 2,
      traits: ["zeon"],
    } as unknown as Parameters<typeof createMockUnit>[0]);

    const engine = GundamTestEngine.create(
      { play: [source] },
      { play: [match, wrongTrait, wrongLv] },
    );
    const runtime = engine.getRuntime();
    const framework = runtime.getFrameworkReadAPI();
    const sourceId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, source.cardNumber)!;
    const matchId = runtime.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, match.cardNumber)!;
    const wrongTraitId = runtime.getInstanceIdByDefinition(
      PLAYER_TWO as PlayerId,
      wrongTrait.cardNumber,
    )!;
    const wrongLvId = runtime.getInstanceIdByDefinition(
      PLAYER_TWO as PlayerId,
      wrongLv.cardNumber,
    )!;

    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework, {
      sourceCardId: sourceId,
    });

    const candidates = framework.zones
      .getCards({ zone: "battleArea", playerId: PLAYER_TWO })
      .map((id) => framework.cards.get(id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);

    const matched = evaluateTargetFilter(
      {
        owner: "opponent",
        cardType: "unit",
        attributeFilters: [
          { attribute: "trait", comparison: "includes", value: "zeon" },
          {
            attribute: "level",
            comparison: "lte",
            value: { ref: "source", stat: "level" },
          },
        ],
      },
      candidates,
      ctx,
    );
    expect(matched).toContain(matchId);
    expect(matched).not.toContain(wrongTraitId);
    expect(matched).not.toContain(wrongLvId);
  });

  it("ap source-stat sentinel: candidates whose AP is strictly less than source's AP", () => {
    const source = createMockUnit({ name: "Source", ap: 4, hp: 3, level: 3, cost: 2 });
    const below = createMockUnit({ name: "Below", ap: 2, hp: 3, level: 3, cost: 2 });
    const equal = createMockUnit({ name: "Equal", ap: 4, hp: 3, level: 3, cost: 2 });

    const engine = GundamTestEngine.create({ play: [source] }, { play: [below, equal] });
    const runtime = engine.getRuntime();
    const framework = runtime.getFrameworkReadAPI();
    const sourceId = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, source.cardNumber)!;
    const belowId = runtime.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, below.cardNumber)!;
    const equalId = runtime.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, equal.cardNumber)!;

    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework, {
      sourceCardId: sourceId,
    });

    const candidates = framework.zones
      .getCards({ zone: "battleArea", playerId: PLAYER_TWO })
      .map((id) => framework.cards.get(id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);

    const matched = evaluateTargetFilter(
      {
        owner: "opponent",
        cardType: "unit",
        attributeFilters: [
          {
            attribute: "ap",
            comparison: "lt",
            value: { ref: "source", stat: "ap" },
          },
        ],
      },
      candidates,
      ctx,
    );
    expect(matched).toContain(belowId);
    expect(matched).not.toContain(equalId);
  });
});
