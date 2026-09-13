import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/forked-lightning.generated.ts";

export const forkedLightning = definePitchFamily(fabPitchFamilies["forked-lightning"], {
  abilities: () => ({
    deal2ArcaneDamageTwoTargetHeroesMayTarget: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            damageType: "arcane",
            amount: 2,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["hero"],
              count: 2,
            },
          },
          {
            type: "rule-modification",
            mode: "allow",
            action: "attack-target",
            target: "any-opposing-hero",
            duration: "this-turn",
            filter: {
              hasStatus: "same-hero-twice",
            },
          },
        ],
      },
    },
  }),
});
export const { red: forkedLightningRed } = forkedLightning.cards;
