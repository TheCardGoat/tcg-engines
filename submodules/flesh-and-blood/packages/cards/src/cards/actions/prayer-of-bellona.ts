import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/prayer-of-bellona.generated.ts";

export const prayerOfBellona = definePitchFamily(fabPitchFamilies["prayer-of-bellona"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackTurnGets2Power: {
      kind: "resolution",
      effect: {
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
              subtypes: ["Attack"],
            },
          },
        },
      },
      label: {
        name: "charge",
      },
    },
    revealTopDeckYellowPutHandThenChargeHerosSoul: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                color: ["yellow"],
              },
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "move-card",
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                  to: {
                    zone: "hand",
                  },
                },
                {
                  type: "charge",
                  target: {
                    selector: "controller",
                  },
                },
              ],
            },
          },
        ],
      },
      label: {
        name: "charge",
      },
    },
  }),
});

export const { yellow: prayerOfBellonaYellow } = prayerOfBellona.cards;
