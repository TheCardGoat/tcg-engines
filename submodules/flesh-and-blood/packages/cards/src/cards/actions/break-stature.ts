import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/break-stature.generated.ts";

import { crushAbility } from "@tcg/flesh-and-blood-types";

export const breakStature = definePitchFamily(fabPitchFamilies["break-stature"], {
  abilities: () => ({
    crushDestroyAndRestrictAuraToken: crushAbility({
      effect: {
        type: "sequence",
        steps: [
          {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "attack-target",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  metatypes: ["Token"],
                  subtypes: ["Aura"],
                },
              },
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "rule-modification",
            mode: "restrict",
            action: "create",
            subject: {
              selector: "attack-target",
            },
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
              hasStatus: "named-card",
            },
            duration: "until-end-of-their-next-turn",
          },
        ],
      },
    }),
  }),
});
export const { yellow: breakStatureYellow } = breakStature.cards;
