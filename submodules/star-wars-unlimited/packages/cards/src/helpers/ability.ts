import type {
  SwuAbility,
  SwuAbilityLimit,
  SwuCondition,
  SwuCost,
  SwuEffect,
  SwuKeyword,
  SwuTarget,
  SwuTrigger,
} from "@tcg/star-wars-unlimited-types";

interface AbilityInput {
  readonly text: string;
  readonly effects?: readonly SwuEffect[];
  readonly target?: SwuTarget;
  readonly costs?: readonly SwuCost[];
  readonly conditions?: readonly SwuCondition[];
  readonly optional?: boolean;
  readonly limit?: SwuAbilityLimit;
}

function makeAbility(
  kind: SwuAbility["kind"],
  input: AbilityInput,
  extras: { readonly trigger?: SwuTrigger; readonly keyword?: SwuKeyword } = {},
): SwuAbility {
  return {
    kind,
    text: input.text,
    effects: input.effects ?? [],
    ...(input.target ? { target: input.target } : {}),
    ...(input.costs ? { costs: input.costs } : {}),
    ...(input.conditions ? { conditions: input.conditions } : {}),
    ...(input.optional === undefined ? {} : { optional: input.optional }),
    ...(input.limit ? { limit: input.limit } : {}),
    ...(extras.trigger ? { trigger: extras.trigger } : {}),
    ...(extras.keyword ? { keyword: extras.keyword } : {}),
  };
}

export const ability = {
  action(input: AbilityInput): SwuAbility {
    return makeAbility("action", input, { trigger: { event: "action" } });
  },
  constant(input: AbilityInput): SwuAbility {
    return makeAbility("constant", input);
  },
  keyword(keyword: SwuKeyword, text: string): SwuAbility {
    return makeAbility("keyword", { text }, { keyword });
  },
  onAttack(input: AbilityInput): SwuAbility {
    return makeAbility("triggered", input, { trigger: { event: "attack" } });
  },
  replacement(input: AbilityInput & { readonly replaces?: SwuTrigger }): SwuAbility {
    return makeAbility("replacement", input, {
      trigger: input.replaces ?? { event: "replacement" },
    });
  },
  triggered(trigger: SwuTrigger, input: AbilityInput): SwuAbility {
    return makeAbility("triggered", input, { trigger });
  },
  whenPlayed(input: AbilityInput): SwuAbility {
    return makeAbility("triggered", input, { trigger: { event: "played" } });
  },
};
