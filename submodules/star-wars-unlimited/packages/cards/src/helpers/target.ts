import type {
  SwuArena,
  SwuAspect,
  SwuCardType,
  SwuComparison,
  SwuController,
  SwuKeyword,
  SwuTarget,
  SwuTrait,
  SwuZone,
} from "@tcg/star-wars-unlimited-types";

interface CardTargetInput {
  readonly controller?: SwuController;
  readonly zones?: readonly SwuZone[];
  readonly ids?: readonly string[];
  readonly cardTypes?: readonly SwuCardType[];
  readonly aspects?: readonly SwuAspect[];
  readonly arena?: SwuArena;
  readonly traits?: readonly SwuTrait[];
  readonly withoutTraits?: readonly SwuTrait[];
  readonly keywords?: readonly SwuKeyword[];
  readonly unique?: boolean;
  readonly exhausted?: boolean;
  readonly damaged?: boolean;
  readonly excludeSelf?: boolean;
  readonly cost?: SwuComparison;
  readonly power?: SwuComparison;
  readonly hp?: SwuComparison;
  readonly limit?: number;
}

export const target = {
  attachedUnit(): SwuTarget {
    return { type: "attachedUnit" };
  },
  base(controller: SwuController = "any"): SwuTarget {
    return { type: "base", controller };
  },
  card(input: CardTargetInput = {}): SwuTarget {
    return { type: "card", ...input };
  },
  choice(id: string): SwuTarget {
    return { type: "choice", id };
  },
  player(controller: SwuController = "any"): SwuTarget {
    return { type: "player", controller };
  },
  self(): SwuTarget {
    return { type: "self" };
  },
  unit(input: Omit<CardTargetInput, "cardTypes"> = {}): SwuTarget {
    return { type: "card", ...input, cardTypes: ["unit"] };
  },
};
