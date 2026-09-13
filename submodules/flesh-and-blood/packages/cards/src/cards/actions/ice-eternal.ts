import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ice-eternal.generated.ts";

export const iceEternal = definePitchFamily(fabPitchFamilies["ice-eternal"], {
  keywords: [
    {
      name: "specialization",
      hero: "Iyslander",
    },
    fusion("Ice"),
  ],
  abilities: () => ({
    createXFrostbiteTokensTargetHerosThenIceEternalFusedDealArcaneDamageEqualNumberFrostbites: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "create-token",
            token: "frostbite",
            controller: "any",
            count: {
              type: "x",
            },
          },
          {
            type: "conditional",
            condition: {
              type: "has-status",
              status: "fused",
            },
            then: {
              type: "deal-damage",
              damageType: "arcane",
              amount: {
                type: "count",
                what: "cards-in-zone",
                zone: "permanent",
                player: "target-controller",
                filter: {
                  name: "Frostbite",
                  typeBox: {
                    metatypes: ["Token"],
                  },
                },
              },
              target: {
                selector: "any-hero",
              },
            },
          },
        ],
      },
    },
  }),
});

export const { blue: iceEternalBlue } = iceEternal.cards;
