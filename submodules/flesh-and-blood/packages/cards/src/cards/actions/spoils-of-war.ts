import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spoils-of-war.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const spoilsOfWar = definePitchFamily(fabPitchFamilies["spoils-of-war"], {
  keywords: [goAgain],
  abilities: () => ({
    nextWeaponAttackTurnGainsNumber2PowerGoAgain: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
            },
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
            },
          },
        ],
      },
    },
    wheneverWeaponControlHitsTurnCreateNumber2CopperTokens: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "every",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "copper",
            controller: "controller",
            count: 2,
          },
        },
      },
    },
  }),
});

export const { red: spoilsOfWarRed } = spoilsOfWar.cards;
