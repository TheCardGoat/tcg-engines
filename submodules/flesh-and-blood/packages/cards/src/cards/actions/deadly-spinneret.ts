import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/deadly-spinneret.generated.ts";
import { stealth } from "../shared/keywords.ts";
export const deadlySpinneret = definePitchFamily(fabPitchFamilies["deadly-spinneret"], {
  keywords: [stealth],
  abilities: () => ({
    equipDaggers: {
      kind: "activated",
      abilityType: "instant",
      functionalZones: ["hand"],
      cost: { class: "effect", type: "discard-self" },
      effect: {
        type: "create-token",
        token: "graphene-chelicera",
        controller: "controller",
        count: 2,
        equipTo: "empty-weapon-zone",
      },
    },
  }),
});
export const { red: deadlySpinneretRed } = deadlySpinneret.cards;
