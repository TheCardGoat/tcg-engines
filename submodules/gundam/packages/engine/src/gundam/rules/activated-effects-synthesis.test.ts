/**
 * PR 2 of the useSupport → activateAbility consolidation.
 *
 * Covers the engine helper `getActivatedEffects` and the target
 * validation added to `activateAbility.validate`. The `<Support>`-as-
 * activated-ability behaviour is covered end-to-end in
 * `use-support.test.ts` (which now exercises the migrated path via the
 * `p.useSupport()` proxy helper).
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import type { PlayerId } from "../../types/branded.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectFailure,
  createMockUnit,
} from "../../index.ts";
import { getActivatedEffects, isSupportActivatedEffect } from "./derived-state.ts";

describe("getActivatedEffects — printed + keyword synthesis", () => {
  const printedAbility: CardEffect = {
    type: "activated",
    activation: { timing: ["activate:main"] },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: "【Activate･Main】Draw 1.",
  };

  it("returns only printed effects when the card has no keyword abilities", () => {
    const unit = createMockUnit({ effects: [printedAbility] });
    const engine = GundamTestEngine.create({ play: [unit] }, {});
    const runtime = engine.getRuntime();
    const id = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, unit.cardNumber)!;

    const effects = getActivatedEffects(id, engine.getG(), runtime.getFrameworkReadAPI().cards);
    expect(effects).toHaveLength(1);
    expect(effects[0]?.sourceText).toBe("【Activate･Main】Draw 1.");
    expect(effects.some(isSupportActivatedEffect)).toBe(false);
  });

  it("appends a synthetic <Support N> activated ability when the keyword is present", () => {
    const unit = createMockUnit({
      effects: [printedAbility],
      keywordEffects: [{ keyword: "Support", value: 2 }],
    });
    const engine = GundamTestEngine.create({ play: [unit] }, {});
    const runtime = engine.getRuntime();
    const id = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, unit.cardNumber)!;

    const effects = getActivatedEffects(id, engine.getG(), runtime.getFrameworkReadAPI().cards);
    expect(effects).toHaveLength(2);
    // Printed first, synthetic appended at the tail (stable index for
    // activateAbility callers).
    expect(effects[0]?.sourceText).toBe("【Activate･Main】Draw 1.");
    expect(effects[1]?.sourceText).toBe("<Support 2>");
    expect(isSupportActivatedEffect(effects[1]!)).toBe(true);
  });

  it("uses the card's current keyword value (pilot/meta/continuous grants stack)", () => {
    const unit = createMockUnit({
      keywordEffects: [{ keyword: "Support", value: 1 }],
    });
    const engine = GundamTestEngine.create({ play: [unit] }, {});
    const runtime = engine.getRuntime();
    const id = runtime.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, unit.cardNumber)!;

    // Meta-granted Support bumps the aggregate value by +1 (see
    // getKeywordValue stacking — rule 13-1-3-2).
    const meta = engine.getState().ctx.zones.private.cardMeta[id] ?? {};
    engine.getState().ctx.zones.private.cardMeta[id] = {
      ...meta,
      grantedKeywords: [...((meta.grantedKeywords as string[]) ?? []), "Support"],
    };

    const effects = getActivatedEffects(id, engine.getG(), runtime.getFrameworkReadAPI().cards);
    expect(effects[0]?.sourceText).toBe("<Support 2>");
  });
});

describe("activateAbility — target validation (rule 10-3-3)", () => {
  it("rejects duplicate targets with DUPLICATE_TARGETS", () => {
    const printedTwoTargets: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      cost: { restSelf: true },
      directives: [
        {
          action: {
            action: "rest",
            target: { owner: "opponent", cardType: "unit", count: 2 },
          },
        },
      ],
      sourceText: "【Activate･Main】Rest 2 enemy units.",
    };
    const actor = createMockUnit({ effects: [printedTwoTargets] });
    const enemyA = createMockUnit();
    const enemyB = createMockUnit();

    const engine = GundamTestEngine.create({ play: [actor] }, { play: [enemyA, enemyB] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const actorId = p1.getCardsInZone("battleArea")[0]!;
    const enemyAId = p2.getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.activateAbility(actorId, 0, { targets: [enemyAId, enemyAId] }),
      "DUPLICATE_TARGETS",
    );
  });

  it("rejects illegal target IDs with ILLEGAL_TARGET", () => {
    const supporter = createMockUnit({
      keywordEffects: [{ keyword: "Support", value: 1 }],
    });
    const engine = GundamTestEngine.create({ play: [supporter] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const supporterId = p1.getCardsInZone("battleArea")[0]!;

    // Self-targeting Support is illegal per excludeSource on the
    // synthetic filter.
    expectFailure(p1.activateAbility(supporterId, 0, { targets: [supporterId] }), "ILLEGAL_TARGET");
  });

  it("rejects wrong target counts with WRONG_TARGET_COUNT", () => {
    const supporter = createMockUnit({
      keywordEffects: [{ keyword: "Support", value: 1 }],
    });
    const a = createMockUnit();
    const b = createMockUnit();
    const engine = GundamTestEngine.create({ play: [supporter, a, b] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [supporterId, aId, bId] = p1.getCardsInZone("battleArea");

    // Support asks for count:1 but caller supplies 2.
    expectFailure(
      p1.activateAbility(supporterId!, 0, { targets: [aId!, bId!] }),
      "WRONG_TARGET_COUNT",
    );
  });

  it("rejects non-empty targets for an ability that takes no targets with UNEXPECTED_TARGETS", () => {
    const drawTwoNoTargets: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      directives: [{ action: { action: "draw", count: 2 } }],
      sourceText: "【Activate･Main】Draw 2.",
    };
    const actor = createMockUnit({ effects: [drawTwoNoTargets] });
    const other = createMockUnit();
    const engine = GundamTestEngine.create({ play: [actor, other], deck: 5 }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [actorId, otherId] = p1.getCardsInZone("battleArea");

    // Draw takes no target. Supplying a target would let the executor
    // silently reinterpret the action's semantics.
    expectFailure(p1.activateAbility(actorId!, 0, { targets: [otherId!] }), "UNEXPECTED_TARGETS");
  });
});

describe("Support synthetic filter — zone gating (rule 13-1-3)", () => {
  it("does not buff a friendly Unit card sitting in hand", () => {
    const supporter = createMockUnit({
      keywordEffects: [{ keyword: "Support", value: 2 }],
    });
    const inHand = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create({ play: [supporter], hand: [inHand] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const supporterId = p1.getCardsInZone("battleArea")[0]!;
    const handId = p1.getCardsInZone("hand")[0]!;

    // The synthetic Support filter now pins zone: "battleArea", so a
    // friendly Unit in hand is not a legal target.
    expectFailure(p1.activateAbility(supporterId, 0, { targets: [handId] }), "ILLEGAL_TARGET");
  });
});
