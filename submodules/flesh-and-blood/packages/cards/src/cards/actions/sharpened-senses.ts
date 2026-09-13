import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sharpened-senses.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const sharpenedSenses = definePitchFamily(fabPitchFamilies["sharpened-senses"], {
  keywords: [goAgain],
  abilities: () => ({
    weaponAttacksGetNumber1PowerTheirPowerGreaterThanTwiceTheirBase: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
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
              count: {
                type: "all",
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
                hasStatus: "power-greater-than-twice-base",
              },
              count: {
                type: "all",
              },
            },
          },
        ],
      },
    },
    atBeginningEndPhaseDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  }),
});

export const { yellow: sharpenedSensesYellow } = sharpenedSenses.cards;
