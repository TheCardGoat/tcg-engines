import type { FabCardDefinitionInput } from "../cards.ts";
import { quoteFabActivation } from "../procedures/activate-ability/index.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { describe, expect, it } from "vitest";
import { buildFabRulesView } from "./state-rules-view.ts";

const activationRelic: FabCardDefinitionInput = {
  canonicalId: "test:activation-relic",
  name: "Activation Relic",
  types: ["Action", "Item"],
  cost: 5,
  abilities: [
    {
      id: "test:activation-relic-a1",
      kind: "activated",
      text: "Action — 2: Gain 1 life.",
      abilityType: "action",
      cost: { class: "asset", type: "resources", amount: 2 },
      effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
    },
  ],
};

const opponentHero: FabCardDefinitionInput = {
  canonicalId: "test:activation-opponent",
  name: "Activation Opponent",
  types: ["Hero"],
};

function modifierHero(
  canonicalId: string,
  effect:
    | {
        readonly type: "modify-numeric";
        readonly property: "cost";
        readonly op: "subtract";
        readonly amount: 2;
      }
    | {
        readonly type: "modify-activation-cost";
        readonly op: "subtract";
        readonly amount: 1;
      },
): FabCardDefinitionInput {
  return {
    canonicalId,
    name: canonicalId,
    types: ["Hero"],
    abilities: [
      {
        id: `${canonicalId}-a1`,
        kind: "static",
        staticKind: "continuous",
        text: "Test modifier.",
        effect: {
          ...effect,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: { name: "Activation Relic" },
            count: { type: "all" },
          },
          duration: "while-condition",
        },
      },
    ],
  };
}

function setup(hero: FabCardDefinitionInput) {
  return FabTestEngine.start(
    { hero, arena: [activationRelic], resourcePoints: 2, deck: 4 },
    { hero: opponentHero, hand: [], deck: 4 },
    { autoPassPriority: false, autoPitch: false },
  );
}

function activationQuote(game: FabTestEngine, hero: FabCardDefinitionInput) {
  const actor = game.as(hero);
  const instanceId = actor.findCardInZone("arena", activationRelic);
  return {
    instanceId,
    quote: quoteFabActivation(game.getState(), {
      actorId: actor.id,
      instanceId,
      abilityId: "test:activation-relic-a1",
    }),
  };
}

describe("first-class activation-cost modifiers", () => {
  it("does not derive an activation discount from the card object's evaluated Cost", () => {
    const hero = modifierHero("test:card-cost-hero", {
      type: "modify-numeric",
      property: "cost",
      op: "subtract",
      amount: 2,
    });
    const game = setup(hero);
    const { instanceId, quote } = activationQuote(game, hero);
    const object = game.getState().objects[instanceId]!;

    expect(
      buildFabRulesView(game.getState()).object({
        instanceId,
        incarnation: object.incarnation,
      })?.current.numeric.cost,
    ).toBe(3);
    expect(quote).toMatchObject({ allowed: true, resourceCost: 2 });
  });

  it("applies a typed activation-cost modifier without changing the card object's Cost", () => {
    const hero = modifierHero("test:activation-cost-hero", {
      type: "modify-activation-cost",
      op: "subtract",
      amount: 1,
    });
    const game = setup(hero);
    const { instanceId, quote } = activationQuote(game, hero);
    const object = game.getState().objects[instanceId]!;

    expect(
      buildFabRulesView(game.getState()).object({
        instanceId,
        incarnation: object.incarnation,
      })?.current.numeric.cost,
    ).toBe(5);
    expect(quote).toMatchObject({ allowed: true, resourceCost: 1 });
  });
});
