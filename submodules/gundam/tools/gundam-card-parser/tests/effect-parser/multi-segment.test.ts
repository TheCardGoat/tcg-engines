/**
 * Tests for multi-segment effect text: cards with multiple 【Keyword】 blocks
 * that produce multiple CardEffect entries.
 */
import { describe, expect, test } from "vite-plus/test";
import { parseEffect } from "../../scripts/parseEffect.ts";

describe("multi-segment effects", () => {
  test("two timing blocks produce two CardEffect entries", () => {
    const effects = parseEffect("【Deploy】 Draw 1.\n【Main】②：Discard 1.");
    expect(effects).toHaveLength(2);
    expect(effects[0].activation.timing).toEqual(["deploy"]);
    expect(effects[1].activation.timing).toEqual(["main"]);
  });

  test("Burst + Main block produces Triggered then Command", () => {
    const effects = parseEffect(
      "【Burst】 Add this card to your hand.\n【Main】②：Deploy 1 Unit card from your hand.",
    );
    expect(effects).toHaveLength(2);
    expect(effects[0].type).toBe("triggered");
    expect(effects[0].activation.timing).toContain("burst");
    expect(effects[1].type).toBe("command");
  });

  test("standalone keyword followed by timing block drops the keyword and keeps the timing effect", () => {
    // <Blocker> is a printed card keyword — it belongs in card.keywordEffects,
    // not in the effects array. parseEffect must drop the standalone segment.
    const effects = parseEffect("<Blocker>\n【Deploy】 Draw 1.");
    expect(effects).toHaveLength(1);
    expect(effects[0].type).toBe("triggered");
    expect(effects[0].activation.timing).toEqual(["deploy"]);
  });

  test("While condition followed by timing block produces two effects", () => {
    const effects = parseEffect(
      "While this Unit is damaged, it gets AP+1 this turn.\n【Deploy】 Draw 1.",
    );
    expect(effects).toHaveLength(2);
    expect(effects[0].type).toBe("constant");
    expect(effects[1].type).toBe("triggered");
  });

  test("three timing blocks produce three CardEffect entries", () => {
    const effects = parseEffect("【Burst】 Draw 1.\n【Deploy】 Draw 1.\n【Main】②：Discard 1.");
    expect(effects).toHaveLength(3);
  });

  test("Activate + During Pair block produces Activated + Constant", () => {
    const effects = parseEffect(
      "【Activate·Main】Rest this Base：Draw 1.\n【During Pair】 It gets AP+1 this turn.",
    );
    expect(effects).toHaveLength(2);
    expect(effects[0].type).toBe("activated");
    expect(effects[1].type).toBe("constant");
  });

  test("HTML br tags are treated as segment separators", () => {
    const effects = parseEffect("【Deploy】 Draw 1.<br>【Main】②：Discard 1.");
    expect(effects).toHaveLength(2);
  });

  test("each effect preserves its sourceText", () => {
    const effects = parseEffect("【Deploy】 Draw 1.\n【Main】②：Discard 1.");
    expect(effects[0].sourceText).toContain("Deploy");
    expect(effects[1].sourceText).toContain("Main");
  });
});

describe("multi-step single segment", () => {
  test("Draw then Discard in one segment produces two steps", () => {
    const [effect] = parseEffect("【Deploy】 Draw 2. Discard 1.");
    expect(effect.directives).toHaveLength(2);
    expect(effect.directives[0]).toMatchObject({ action: { action: "draw", count: 2 } });
    expect(effect.directives[1]).toMatchObject({ action: { action: "discard", count: 1 } });
  });

  test("Choose + action produce the action with target applied", () => {
    const [effect] = parseEffect("【Main】②：Choose 1 enemy Unit. Rest it.");
    const restStep = effect.directives.find(
      (s) => "action" in s && (s as any).action.action === "rest",
    );
    expect(restStep).toBeDefined();
    expect(restStep).toMatchObject({
      action: { action: "rest", target: { owner: "opponent" } },
    });
  });

  test("'instead' clause merges with previous conditional into nested if/else", () => {
    const [effect] = parseEffect(
      '【Deploy】 Add 1 of your Shields to your hand. Then, if it is your turn, deploy 1 [Tallgeese]((OZ)·AP4·HP2) Unit token. If it is your turn and a card with "Corsica Base" in its card name is in your trash, deploy 2 [Leo]((OZ)·AP1·HP1) Unit tokens instead.',
    );
    expect(effect.directives).toHaveLength(2);
    expect(effect.directives[0]).toMatchObject({ action: { action: "addShieldToHand", count: 1 } });
    // Outer condition: isTurn friendly
    const outerBranch = effect.directives[1];
    expect(outerBranch).toMatchObject({
      condition: { type: "isTurn", whose: "friendly" },
    });
    // Inner condition: cardInZone with hasName
    const innerBranch = (outerBranch as { thenDirectives: unknown[] }).thenDirectives[0];
    expect(innerBranch).toMatchObject({
      condition: {
        type: "cardInZone",
        owner: "friendly",
        zone: "trash",
        hasName: "Corsica Base",
      },
    });
    // thenSteps: deploy 2 Leo tokens
    expect((innerBranch as { thenDirectives: unknown[] }).thenDirectives[0]).toMatchObject({
      action: {
        action: "deployToken",
        token: { name: "Leo", traits: ["oz"], ap: 1, hp: 1 },
        count: 2,
      },
    });
    // elseDirectives: deploy 1 Tallgeese token
    expect((innerBranch as { elseDirectives: unknown[] }).elseDirectives[0]).toMatchObject({
      action: { action: "deployToken", token: { name: "Tallgeese", traits: ["oz"], ap: 4, hp: 2 } },
    });
  });
});
