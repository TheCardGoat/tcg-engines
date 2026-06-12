import { describe, expect, it } from "vite-plus/test";

import type { EffectAction } from "@tcg/gundam-types";

import { classifyDirectiveIntent } from "./directive-intent.ts";

/**
 * Pinned classifier behaviour for `defaultResolveEffect`. These cases
 * cover the major action shapes the bot will see in practice: card
 * draw, damage, recovery, mill, deploy, stat modifiers. Adding a new
 * `EffectAction` variant in `@tcg/gundam-types` will fail compilation
 * in `directive-intent.ts` (`assertNever`) before it falls through to
 * `"neutral"` here.
 */
describe("classifyDirectiveIntent: always-accept", () => {
  it.each([
    ["draw", { action: "draw", count: 1 }],
    ["addSelfToHand", { action: "addSelfToHand" }],
    ["returnPairedPilotToHand", { action: "returnPairedPilotToHand" }],
    ["addShieldToHand", { action: "addShieldToHand", count: 1 }],
    ["deploySelf", { action: "deploySelf" }],
    ["activateTiming", { action: "activateTiming", timing: "main" }],
  ] as const satisfies readonly (readonly [string, EffectAction])[])(
    "%s → accept",
    (_name, action) => {
      expect(classifyDirectiveIntent(action)).toBe("accept");
    },
  );
});

describe("classifyDirectiveIntent: always-decline", () => {
  it("discard from own hand → decline", () => {
    expect(classifyDirectiveIntent({ action: "discard", count: 1 })).toBe("decline");
  });

  it("millDeck owner=self → decline", () => {
    expect(classifyDirectiveIntent({ action: "millDeck", count: 3, owner: "self" })).toBe(
      "decline",
    );
  });

  it("millDeck owner=opponent → accept", () => {
    expect(classifyDirectiveIntent({ action: "millDeck", count: 3, owner: "opponent" })).toBe(
      "accept",
    );
  });
});

describe("classifyDirectiveIntent: owner-dependent", () => {
  it("dealDamage to opponent → accept", () => {
    expect(
      classifyDirectiveIntent({
        action: "dealDamage",
        amount: 1,
        target: { owner: "opponent" },
      }),
    ).toBe("accept");
  });

  it("dealDamage to self → decline", () => {
    expect(
      classifyDirectiveIntent({
        action: "dealDamage",
        amount: 1,
        target: { owner: "self" },
      }),
    ).toBe("decline");
  });

  it("dealDamage to friendly → decline", () => {
    expect(
      classifyDirectiveIntent({
        action: "dealDamage",
        amount: 1,
        target: { owner: "friendly" },
      }),
    ).toBe("decline");
  });

  it("destroy opponent unit → accept", () => {
    expect(classifyDirectiveIntent({ action: "destroy", target: { owner: "opponent" } })).toBe(
      "accept",
    );
  });

  it("destroy own unit → decline", () => {
    expect(classifyDirectiveIntent({ action: "destroy", target: { owner: "self" } })).toBe(
      "decline",
    );
  });

  it("recoverHP self → accept", () => {
    expect(
      classifyDirectiveIntent({
        action: "recoverHP",
        amount: 1,
        target: { owner: "self" },
      }),
    ).toBe("accept");
  });

  it("setActive friendly → accept (extra attack)", () => {
    expect(classifyDirectiveIntent({ action: "setActive", target: { owner: "friendly" } })).toBe(
      "accept",
    );
  });

  it("setActive opponent → decline (free counter-attack)", () => {
    expect(classifyDirectiveIntent({ action: "setActive", target: { owner: "opponent" } })).toBe(
      "decline",
    );
  });
});

describe("classifyDirectiveIntent: stat modifier sign × owner", () => {
  it("+stat on friendly → accept", () => {
    expect(
      classifyDirectiveIntent({
        action: "statModifier",
        stat: "ap",
        amount: 2,
        duration: "thisTurn",
        target: { owner: "friendly" },
      }),
    ).toBe("accept");
  });

  it("-stat on friendly → decline", () => {
    expect(
      classifyDirectiveIntent({
        action: "statModifier",
        stat: "ap",
        amount: -2,
        duration: "thisTurn",
        target: { owner: "friendly" },
      }),
    ).toBe("decline");
  });

  it("-stat on opponent → accept", () => {
    expect(
      classifyDirectiveIntent({
        action: "statModifier",
        stat: "ap",
        amount: -2,
        duration: "thisTurn",
        target: { owner: "opponent" },
      }),
    ).toBe("accept");
  });
});
