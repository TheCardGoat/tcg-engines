import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blood-runs-deep.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const bloodRunsDeep = definePitchFamily(fabPitchFamilies["blood-runs-deep"], {
  keywords: [goAgain],
  abilities: () => ({
    costsLessPlayEachDraconicChainLinkControl: {
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
    whenAttacksHeroEachDaggerControlDeals1Damage: {
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
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "deal-damage",
              damageType: "generic",
              amount: 1,
              target: {
                selector: "attack-target",
              },
              source: {
                selector: "object",
                declared: "at-resolution",
                zones: ["combat-chain", "weapon", "permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Dagger"],
                  },
                },
                count: {
                  type: "all",
                },
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-numeric",
                binding: "damage-dealt-this-way",
                comparison: { op: "gt", value: 0 },
              },
              then: {
                type: "set-status",
                status: "hit",
                target: {
                  selector: "binding",
                  binding: "it",
                },
              },
            },
            {
              type: "destroy",
              target: {
                selector: "binding",
                binding: "them",
              },
            },
          ],
        },
      },
    },
  }),
});
export const { red: bloodRunsDeepRed } = bloodRunsDeep.cards;
