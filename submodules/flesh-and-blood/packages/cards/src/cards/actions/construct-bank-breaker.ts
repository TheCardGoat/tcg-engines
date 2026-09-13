import { type FabResolutionAbility, type FabTarget } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

import { definePitchFamily } from "../../authoring/pitch-family.ts";
import type { RulesOnlyAbility } from "../../authoring/card.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/construct-bank-breaker.generated.ts";

const wrenchTarget: FabTarget = {
  selector: "object",
  // Printed "If you have a wrench weapon equipped, transform it…" is not
  // "target" (CR 1.8.5 / 1.8.5c). Subjects are determined at generation.
  declared: "at-resolution",
  player: "controller",
  zones: ["weapon"],
  filter: {
    typeBox: {
      types: ["Weapon"],
      subtypes: ["Wrench"],
    },
  },
  count: 1,
};

const constructBankBreakerResolution = {
  kind: "resolution",
  layerKeywords: [goAgain],
  effect: {
    type: "transform-into-resolving-card",
    target: wrenchTarget,
    additionalTargets: [
      {
        selector: "object",
        declared: "at-resolution",
        player: "controller",
        zones: ["permanent"],
        filter: {
          name: "Hyper Driver",
        },
        count: 3,
      },
    ],
    onIncomplete: "negate-resolving-card",
  },
  label: {
    name: "transform",
  },
} satisfies RulesOnlyAbility<FabResolutionAbility>;

export const constructBankBreaker = definePitchFamily(fabPitchFamilies["construct-bank-breaker"], {
  keywords: [goAgain],
  abilities: () => ({
    transformComponents: constructBankBreakerResolution,
  }),
});
export const { yellow: constructBankBreakerYellow } = constructBankBreaker.cards;
