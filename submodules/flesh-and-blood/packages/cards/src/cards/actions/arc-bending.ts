import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/arc-bending.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const arcBending = definePitchFamily(fabPitchFamilies["arc-bending"], {
  abilities: () => ({
    whenAttacksIfLightningElementalAttackWouldDealDamage: {
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
          type: "replacement",
          replacementKind: "standard",
          replaces: {
            name: "damage",
            filter: {
              and: [
                {
                  typeBox: {
                    subtypes: ["Attack"],
                  },
                },
                {
                  or: [
                    {
                      typeBox: {
                        supertypes: ["Lightning"],
                      },
                    },
                    {
                      typeBox: {
                        supertypes: ["Elemental"],
                      },
                    },
                  ],
                },
              ],
            },
          },
          modification: {
            type: "modify-numeric",
            property: "count",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          duration: "this-combat-chain",
        },
      },
    },
    ifLightningWasPitchedPlayGetsGoAgain: {
      kind: "resolution",
      condition: {
        type: "binding-numeric",
        binding: "pitched-this-way-lightning-card",
        comparison: { op: "eq", value: 1 },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
      label: {
        name: "lightning-bond",
      },
    },
  }),
});
export const { red: arcBendingRed } = arcBending.cards;
