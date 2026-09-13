import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/devotion-never-dies.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const devotionNeverDies = definePitchFamily(fabPitchFamilies["devotion-never-dies"], {
  keywords: [goAgain],
  abilities: () => ({
    whenHitsIfDraconicAttackWasLastAttackCombat: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
        state: {
          type: "last-attack-this-combat-chain",
          filter: {
            typeBox: {
              supertypes: ["Draconic"],
              subtypes: ["Attack"],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "if-you-do",
          effect: {
            type: "banish",
            target: {
              selector: "self",
            },
            outputBinding: "it",
          },
          then: {
            type: "optional",
            effect: {
              type: "play-card",
              fromZones: ["banished"],
              source: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-turn",
            },
          },
        },
      },
    },
  }),
});
export const { red: devotionNeverDiesRed } = devotionNeverDies.cards;
