/**
 * Tests for timing header parsing: timing keywords, costs, once-per-turn,
 * pilot qualifiers, and effect type classification.
 */
import { describe, expect, test } from "vite-plus/test";
import { parseEffect } from "../../scripts/parseEffect.ts";

describe("header – timing keywords", () => {
  test("Deploy timing produces Triggered effect", () => {
    const [effect] = parseEffect("【Deploy】 Draw 1.");
    expect(effect.activation.timing).toEqual(["deploy"]);
    expect(effect.type).toBe("triggered");
  });

  test("Burst timing produces Triggered effect", () => {
    const [effect] = parseEffect("【Burst】 Draw 1.");
    expect(effect.activation.timing).toEqual(["burst"]);
    expect(effect.type).toBe("triggered");
  });

  test("Attack timing produces Triggered effect", () => {
    const [effect] = parseEffect("【Attack】 Draw 1.");
    expect(effect.activation.timing).toEqual(["attack"]);
    expect(effect.type).toBe("triggered");
  });

  test("Destroyed timing produces Triggered effect", () => {
    const [effect] = parseEffect("【Destroyed】 Draw 1.");
    expect(effect.activation.timing).toEqual(["destroyed"]);
    expect(effect.type).toBe("triggered");
  });

  test("WhenPaired timing produces Triggered effect", () => {
    const [effect] = parseEffect("【When Paired】 Draw 1.");
    expect(effect.activation.timing).toEqual(["whenPaired"]);
    expect(effect.type).toBe("triggered");
  });

  test("WhenLinked timing produces Triggered effect", () => {
    const [effect] = parseEffect("【When Linked】 Draw 1.");
    expect(effect.activation.timing).toEqual(["whenLinked"]);
    expect(effect.type).toBe("triggered");
  });

  test("DuringLink timing produces Constant effect", () => {
    const [effect] = parseEffect("【During Link】 It gets AP+1 this turn.");
    expect(effect.activation.timing).toBeUndefined();
    expect(effect.activation.conditions).toEqual([{ type: "duringLink" }]);
    expect(effect.type).toBe("constant");
  });

  test("DuringPair timing produces Constant effect", () => {
    const [effect] = parseEffect("【During Pair】 It gets AP+1 this turn.");
    expect(effect.activation.timing).toBeUndefined();
    expect(effect.activation.conditions).toEqual([{ type: "duringPair" }]);
    expect(effect.type).toBe("constant");
  });

  test("Main timing produces Command effect", () => {
    const [effect] = parseEffect("【Main】②：Draw 1.");
    expect(effect.activation.timing).toEqual(["main"]);
    expect(effect.type).toBe("command");
  });

  test("Action timing produces Command effect", () => {
    const [effect] = parseEffect("【Action】②：Draw 1.");
    expect(effect.activation.timing).toEqual(["action"]);
    expect(effect.type).toBe("command");
  });

  test("Main slash Action produces Command with both timings", () => {
    const [effect] = parseEffect("【Main】/【Action】：Draw 1.");
    expect(effect.activation.timing).toEqual(["main", "action"]);
    expect(effect.type).toBe("command");
  });

  test("Activate·Main timing produces Activated effect", () => {
    const [effect] = parseEffect("【Activate·Main】Rest this Base：Draw 1.");
    expect(effect.activation.timing).toEqual(["activate:main"]);
    expect(effect.type).toBe("activated");
  });

  test("Activate·Action timing produces Activated effect", () => {
    const [effect] = parseEffect("【Activate·Action】③：Draw 1.");
    expect(effect.activation.timing).toEqual(["activate:action"]);
    expect(effect.type).toBe("activated");
  });
});

describe("header – costs", () => {
  test("② produces payResources: 2", () => {
    const [effect] = parseEffect("【Main】②：Draw 1.");
    expect(effect.cost).toEqual({ payResources: 2 });
  });

  test("③ produces payResources: 3", () => {
    const [effect] = parseEffect("【Main】③：Draw 1.");
    expect(effect.cost).toEqual({ payResources: 3 });
  });

  test("⑤ produces payResources: 5", () => {
    const [effect] = parseEffect("【Activate·Main】⑤：Draw 1.");
    expect(effect.cost?.payResources).toBe(5);
  });

  test("Rest this Base produces restSelf: true", () => {
    const [effect] = parseEffect("【Activate·Main】Rest this Base：Draw 1.");
    expect(effect.cost).toEqual({ restSelf: true });
  });

  test("Rest this Card produces restSelf: true", () => {
    const [effect] = parseEffect("【Activate·Action】Rest this Card：Draw 1.");
    expect(effect.cost).toEqual({ restSelf: true });
  });

  test("no cost marker leaves cost undefined", () => {
    const [effect] = parseEffect("【Deploy】 Draw 1.");
    expect(effect.cost).toBeUndefined();
  });
});

describe("header – once per turn", () => {
  test("Once per Turn modifier is recorded on activation", () => {
    const [effect] = parseEffect("【Once per Turn】【Deploy】 Draw 1.");
    expect(effect.activation.restrictions).toEqual([{ type: "oncePerTurn" }]);
    expect(effect.activation.timing).toEqual(["deploy"]);
  });

  test("standalone Once per Turn with no timing bracket", () => {
    const [effect] = parseEffect("【Once per Turn】 Draw 1.");
    expect(effect.activation.restrictions).toEqual([{ type: "oncePerTurn" }]);
    expect(effect.type).toBe("triggered");
  });

  test("Once per Turn with when-clause infers trigger timing", () => {
    const [effect] = parseEffect(
      "【Once per Turn】When this Unit destroys an enemy Unit with battle damage, draw 1.",
    );
    expect(effect.type).toBe("triggered");
    expect(effect.activation.timing).toEqual(["onDestroyByBattle"]);
    expect(effect.activation.restrictions).toEqual([{ type: "oncePerTurn" }]);
  });
});

describe("header – pilot qualifiers", () => {
  test("During Pair·Red Pilot adds color qualification", () => {
    const [effect] = parseEffect("【During Pair·Red Pilot】 It gets AP+1 this turn.");
    expect(effect.activation.timing).toBeUndefined();
    expect(effect.activation.conditions).toEqual([{ type: "duringPair" }]);
    expect(effect.activation.qualification).toEqual({
      attribute: "color",
      comparison: "eq",
      value: "red",
    });
  });

  test("During Pair·Blue Pilot adds Blue color qualification", () => {
    const [effect] = parseEffect("【During Pair·Blue Pilot】 Draw 1.");
    expect(effect.activation.qualification).toEqual({
      attribute: "color",
      comparison: "eq",
      value: "blue",
    });
  });

  test("When Paired·(White Base Team) Pilot adds trait qualification", () => {
    const [effect] = parseEffect("【When Paired·(White Base Team) Pilot】 Draw 1.");
    expect(effect.activation.timing).toEqual(["whenPaired"]);
    expect(effect.activation.qualification).toEqual({
      attribute: "trait",
      comparison: "includes",
      value: "white base team",
    });
  });

  test("During Pair·Lv.3 or Lower Pilot adds level qualification", () => {
    const [effect] = parseEffect("【During Pair·Lv.3 or Lower Pilot】 It gets AP+1 this turn.");
    expect(effect.activation.qualification).toMatchObject({
      attribute: "level",
      comparison: "lte",
      value: 3,
    });
  });

  test("During Pair·Lv.5 or Higher Pilot adds level qualification", () => {
    const [effect] = parseEffect("【During Pair·Lv.5 or Higher Pilot】 It gets AP+1 this turn.");
    expect(effect.activation.qualification).toMatchObject({
      attribute: "level",
      comparison: "gte",
      value: 5,
    });
  });
});

describe("header – Pilot keyword", () => {
  test("Pilot keyword produces Command effect with pilotKeyword", () => {
    const [effect] = parseEffect("【Pilot】[Char Aznable]");
    expect(effect.type).toBe("command");
    expect(effect.activation.timing).toEqual(["main"]);
    expect(effect.pilotKeyword).toEqual({ pilotName: "Char Aznable" });
    expect(effect.directives).toHaveLength(0);
  });
});

describe("empty / trivial inputs", () => {
  test("empty string returns no effects", () => {
    expect(parseEffect("")).toEqual([]);
  });

  test("dash returns no effects", () => {
    expect(parseEffect("-")).toEqual([]);
  });

  test("undefined returns no effects", () => {
    expect(parseEffect(undefined)).toEqual([]);
  });

  test("HTML br tags are treated as newlines", () => {
    const effects = parseEffect("【Deploy】 Draw 1.<br>【Main】②：Discard 1.");
    expect(effects).toHaveLength(2);
  });
});

describe("free-standing When triggers", () => {
  test("When this Unit deals battle damage to an enemy Unit", () => {
    const [effect] = parseEffect(
      "When this Unit deals battle damage to an enemy Unit, destroy that enemy Unit.",
    );
    expect(effect.type).toBe("triggered");
    expect(effect.activation.timing).toEqual(["onBattleDamageDealtToUnit"]);
    expect(effect.directives[0]).toMatchObject({
      action: { action: "destroy", target: { owner: "opponent", cardType: "unit" } },
    });
  });

  test("When this Unit is rested by an effect", () => {
    const [effect] = parseEffect("When this Unit is rested by an effect, set it as active.");
    expect(effect.activation.timing).toEqual(["onRestedByEffect"]);
    expect(effect.directives[0]).toMatchObject({
      action: { action: "setActive", target: { owner: "self" } },
    });
  });
});
