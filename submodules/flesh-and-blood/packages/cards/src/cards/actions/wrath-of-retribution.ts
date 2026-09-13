import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/wrath-of-retribution.generated.ts";
import { goAgain, legendary } from "../shared/keywords.ts";

export const wrathOfRetribution = definePitchFamily(fabPitchFamilies["wrath-of-retribution"], {
  keywords: [legendary, goAgain],
  abilities: () => ({
    costsResourceLessPlayForEachDraconicChainLinkControl: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: {
          type: "count",
          what: "chain-links",
          player: "controller",
          filter: {
            typeBox: {
              supertypes: ["Draconic"],
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
    whenAttacksDaggersControlGetNumber1PowerCostResourceLessActivateCombat: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["weapon", "permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Dagger"],
                  },
                },
                count: {
                  type: "all",
                },
              },
              duration: "this-combat-chain",
            },
            {
              type: "modify-activation-cost",
              op: "subtract",
              amount: 1,
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["weapon", "permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Dagger"],
                  },
                },
                count: {
                  type: "all",
                },
              },
              duration: "this-combat-chain",
            },
          ],
        },
      },
    },
  }),
});

export const { red: wrathOfRetributionRed } = wrathOfRetribution.cards;
