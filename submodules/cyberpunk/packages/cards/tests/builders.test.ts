import { describe, expect, it } from "vite-plus/test";

import {
  AbilityBuilder,
  condition,
  effect,
  getStructuredCardBySlug,
  target,
} from "../src/index.ts";

describe("target factory", () => {
  it("creates each TargetDSL variant with the right discriminator", () => {
    expect(target.self()).toEqual({ selector: "self" });
    expect(target.host()).toEqual({ selector: "host" });
    expect(target.bound("g1")).toEqual({ selector: "bound", id: "g1" });
    expect(target.context("triggerCard")).toEqual({ selector: "context", key: "triggerCard" });
    expect(target.gig({ controller: "friendly" })).toEqual({
      selector: "gig",
      controller: "friendly",
      amount: 1,
    });
  });

  it("card() spreads filter fields and stamps the selector", () => {
    const t = target.card({
      controller: "friendly",
      cardTypes: ["unit"],
      colors: ["blue"],
      selection: { mode: "choose", min: 1, max: 1 },
    });
    expect(t).toEqual({
      selector: "card",
      controller: "friendly",
      cardTypes: ["unit"],
      colors: ["blue"],
      selection: { mode: "choose", min: 1, max: 1 },
    });
  });

  it("card() with no filter returns just the selector", () => {
    expect(target.card()).toEqual({ selector: "card" });
  });

  it('gig() allows explicit "all" for copy that references every gig', () => {
    expect(target.gig({ controller: "friendly", amount: "all" })).toEqual({
      selector: "gig",
      controller: "friendly",
      amount: "all",
    });
  });
});

describe("condition factory", () => {
  it("stamps the discriminator on every variant", () => {
    expect(condition.streetCred({ controller: "friendly", comparison: "gte", value: 7 })).toEqual({
      condition: "streetCred",
      controller: "friendly",
      comparison: "gte",
      value: 7,
    });
    expect(condition.attacking({ target: target.self() })).toEqual({
      condition: "attacking",
      target: { selector: "self" },
    });
    expect(
      condition.targetValue({
        target: target.bound("g"),
        property: "gigValue",
        comparison: "eq",
        value: "max",
      }),
    ).toEqual({
      condition: "targetValue",
      target: { selector: "bound", id: "g" },
      property: "gigValue",
      comparison: "eq",
      value: "max",
    });
  });
});

describe("effect factory", () => {
  it("stamps the discriminator and preserves all fields", () => {
    expect(effect.modifyPower({ target: target.self(), value: 1, duration: "continuous" })).toEqual(
      {
        effect: "modifyPower",
        target: { selector: "self" },
        value: 1,
        duration: "continuous",
      },
    );

    expect(
      effect.draw({
        player: "friendly",
        amount: 2,
        conditions: [condition.streetCred({ controller: "friendly", comparison: "gte", value: 5 })],
      }),
    ).toEqual({
      effect: "draw",
      player: "friendly",
      amount: 2,
      conditions: [
        { condition: "streetCred", controller: "friendly", comparison: "gte", value: 5 },
      ],
    });

    expect(
      effect.grantRule({ target: target.self(), rule: "cantAttack", duration: "continuous" }),
    ).toEqual({
      effect: "grantRule",
      target: { selector: "self" },
      rule: "cantAttack",
      duration: "continuous",
    });
  });
});

describe("AbilityBuilder", () => {
  it("keyword() requires .keyword() and produces the canonical shape", () => {
    expect(() => AbilityBuilder.keyword().text("BLOCKER").build()).toThrow();

    const a = AbilityBuilder.keyword()
      .keyword("blocker")
      .text("BLOCKER (...)")
      .source(target.self())
      .build();
    expect(a).toEqual({
      kind: "keyword",
      text: "BLOCKER (...)",
      keyword: "blocker",
      source: { selector: "self" },
      effects: [],
    });
  });

  it("static() produces a static ability with no extra fields", () => {
    const a = AbilityBuilder.static()
      .text("This unit can't attack.")
      .effect(
        effect.grantRule({ target: target.self(), rule: "cantAttack", duration: "continuous" }),
      )
      .build();
    expect(a).toEqual({
      kind: "static",
      text: "This unit can't attack.",
      effects: [
        {
          effect: "grantRule",
          target: { selector: "self" },
          rule: "cantAttack",
          duration: "continuous",
        },
      ],
    });
  });

  it("triggered() requires a trigger and supports event triggers, limits, bindings, multi-effects", () => {
    expect(() => AbilityBuilder.triggered().text("x").build()).toThrow();

    const a = AbilityBuilder.triggered()
      .text("desc")
      .onCardPlayed({
        player: "friendly",
        target: target.card({ controller: "friendly", cardTypes: ["unit"] }),
      })
      .limit("firstTimeEachTurn")
      .bind("g", target.gig({ controller: "friendly" }))
      .effect(
        effect.modifyGig({
          target: target.bound("g"),
          operation: "increase",
          value: 2,
          optional: true,
        }),
      )
      .effect(effect.draw({ player: "friendly", amount: 1 }))
      .build();

    expect(a).toEqual({
      kind: "triggered",
      text: "desc",
      trigger: {
        trigger: "event",
        event: {
          event: "cardPlayed",
          player: "friendly",
          target: { selector: "card", controller: "friendly", cardTypes: ["unit"] },
        },
      },
      limits: ["firstTimeEachTurn"],
      bindings: [{ id: "g", target: { selector: "gig", controller: "friendly", amount: 1 } }],
      effects: [
        {
          effect: "modifyGig",
          target: { selector: "bound", id: "g" },
          operation: "increase",
          value: 2,
          optional: true,
        },
        { effect: "draw", player: "friendly", amount: 1 },
      ],
    });
  });

  it("simple triggers like onPlay() set the right shape", () => {
    const a = AbilityBuilder.triggered()
      .text("PLAY ...")
      .onPlay()
      .source(target.host())
      .effect(
        effect.grantRule({
          target: target.host(),
          rule: "canAttackOnPlayedTurnAgainstUnits",
          duration: "turn",
        }),
      )
      .build();
    expect(a.trigger).toEqual({ trigger: "play" });
    expect(a.source).toEqual({ selector: "host" });
  });
});

describe("migrated cards produce the expected shape", () => {
  it("corpo-security has [blocker keyword, cantAttack static]", () => {
    const card = getStructuredCardBySlug("corpo-security");
    expect(card?.abilities).toEqual([
      {
        kind: "keyword",
        text: "BLOCKER (When a rival unit attacks, you may spend this unit to redirect the attack to it.)",
        keyword: "blocker",
        source: { selector: "self" },
        effects: [],
      },
      {
        kind: "static",
        text: "This unit can't attack.",
        effects: [
          {
            effect: "grantRule",
            target: { selector: "self" },
            rule: "cantAttack",
            duration: "continuous",
          },
        ],
      },
    ]);
  });

  it("saburo-arasaka-stubborn-patriach has the +1 power-when-attacking static", () => {
    const card = getStructuredCardBySlug("saburo-arasaka-stubborn-patriach");
    const arasakaUnits = {
      selector: "card",
      controller: "friendly",
      zones: ["field"],
      cardTypes: ["unit"],
      classifications: ["Arasaka"],
    };
    expect(card?.abilities).toEqual([
      {
        kind: "static",
        text: "Your Arasaka units have +1 power when attacking.",
        effects: [
          {
            effect: "modifyPower",
            target: arasakaUnits,
            value: 1,
            duration: "continuous",
            conditions: [{ condition: "attacking", target: arasakaUnits }],
          },
        ],
      },
    ]);
  });

  it("jackie-welles-pour-one-out-for-me has the cardPlayed-triggered binding ability", () => {
    const card = getStructuredCardBySlug("jackie-welles-pour-one-out-for-me");
    expect(card?.abilities).toEqual([
      {
        kind: "triggered",
        text: "The first time you play a blue unit or blue gear each turn, you may increase a friendly gig by 2. Then, if it's at max value, draw a card.",
        source: { selector: "self" },
        trigger: {
          trigger: "event",
          event: {
            event: "cardPlayed",
            player: "friendly",
            target: {
              selector: "card",
              controller: "friendly",
              cardTypes: ["unit", "gear"],
              colors: ["blue"],
            },
          },
        },
        limits: ["firstTimeEachTurn"],
        bindings: [
          { id: "selectedGig", target: { selector: "gig", controller: "friendly", amount: 1 } },
        ],
        effects: [
          {
            effect: "modifyGig",
            target: { selector: "bound", id: "selectedGig" },
            operation: "increase",
            value: 2,
            optional: true,
          },
          {
            effect: "draw",
            player: "friendly",
            amount: 1,
            conditions: [
              {
                condition: "targetValue",
                target: { selector: "bound", id: "selectedGig" },
                property: "gigValue",
                comparison: "eq",
                value: "max",
              },
            ],
          },
        ],
      },
    ]);
  });
});
