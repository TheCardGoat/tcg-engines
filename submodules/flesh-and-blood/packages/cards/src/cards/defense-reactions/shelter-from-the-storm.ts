import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/shelter-from-the-storm.generated.ts";

export const shelterFromTheStorm = definePitchFamily(fabPitchFamilies["shelter-from-the-storm"], {
  abilities: () => ({
    preventDamageByDiscarding: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 1,
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
        times: 3,
      },
    },
  }),
});

export const { red: shelterFromTheStormRed } = shelterFromTheStorm.cards;
