import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/chain-lightning.generated.ts";

export const chainLightning = definePitchFamily(fabPitchFamilies["chain-lightning"], {
  abilities: () => ({
    mayPlayNextWizardNonAttackActionTurnAs: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          fromZones: ["hand"],
          source: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            count: 1,
            filter: {
              typeBox: {
                types: ["Action"],
              },
              and: [
                {
                  typeBox: {
                    supertypes: ["Wizard"],
                  },
                },
                {
                  typeBox: {
                    excludeSubtypes: ["Attack"],
                  },
                },
              ],
            },
          },
          appliesTo: {
            next: {
              typeBox: {
                types: ["Action"],
              },
              and: [
                {
                  typeBox: {
                    supertypes: ["Wizard"],
                  },
                },
                {
                  typeBox: {
                    excludeSubtypes: ["Attack"],
                  },
                },
              ],
            },
          },
          duration: "this-turn",
          asType: "instant",
        },
      },
    },
    ifHavePlayedAnotherWizardNonAttackActionTurn: {
      kind: "resolution",
      condition: {
        type: "played-this",
        per: "turn",
        filter: {
          typeBox: { supertypes: ["Wizard"], types: ["Action"], excludeSubtypes: ["Attack"] },
        },
        comparison: { op: "gte", value: 2 },
      },
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 3,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["hero"],
          count: {
            type: "all",
          },
        },
      },
    },
  }),
});
export const { yellow: chainLightningYellow } = chainLightning.cards;
