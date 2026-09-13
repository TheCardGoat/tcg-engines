import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/v-of-the-vanguard.generated.ts";

export const vOfTheVanguard = definePitchFamily(fabPitchFamilies["v-of-the-vanguard"], {
  keywords: [
    {
      name: "specialization",
      hero: "Boltyn",
    },
  ],
  abilities: () => ({
    asAdditionalCostPlayVVanguardChargeHeroSSoulAnyNumber: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "charge",
          repeat: true,
        },
        optional: true,
      },
      label: {
        name: "charge",
      },
    },
    attacksOnCombatChainGainNumber1PowerForEachLightChargedWay: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "count",
          what: "charged-this-way",
          filter: {
            typeBox: {
              supertypes: ["Light"],
            },
          },
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
          count: {
            type: "all",
          },
        },
        duration: "this-combat-chain",
      },
      label: {
        name: "charge",
      },
    },
  }),
});

export const { yellow: vOfTheVanguardYellow } = vOfTheVanguard.cards;
