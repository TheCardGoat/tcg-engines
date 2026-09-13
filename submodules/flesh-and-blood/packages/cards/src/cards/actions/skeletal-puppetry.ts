import { grantKeyword, plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/skeletal-puppetry.generated.ts";
import { goAgain } from "../shared/keywords.ts";

const nextAllyAttack = { next: { typeBox: { subtypes: ["Ally"] } } } as const;

export const skeletalPuppetry = definePitchFamily(fabPitchFamilies["skeletal-puppetry"], {
  parameters: {
    red: { powerBonus: 3 },
    yellow: { powerBonus: 2 },
    blue: { powerBonus: 1 },
  },
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    discardAllyRatherThanPay: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "alternative-cost",
        cost: {
          class: "effect",
          type: "discard",
          count: 1,
          filter: { typeBox: { subtypes: ["Ally"] } },
        },
        optional: true,
      },
    },
    nextAllyAttackGetsPlusPowerAndGoAgain: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          plusPower(powerBonus, { appliesTo: nextAllyAttack }),
          grantKeyword(goAgain, { appliesTo: nextAllyAttack }),
        ],
      },
    },
  }),
});

export const {
  red: skeletalPuppetryRed,
  yellow: skeletalPuppetryYellow,
  blue: skeletalPuppetryBlue,
} = skeletalPuppetry.cards;
