import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/ol.generated.ts";

export const ol = definePitchFamily(fabPitchFamilies["ol"], {
  abilities: () => ({
    removeCounterCreateFlurryAndDraw: {
      kind: "resolution",
      effect: {
        type: "if-you-do",
        effect: {
          type: "remove-counters",
          counter: {
            kind: "numeric",
            value: 1,
            property: "power",
          },
          count: 1,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain", "weapon"],
            filter: {
              typeBox: {
                types: ["Weapon"],
              },
              hasStatus: "attacking",
            },
            count: 1,
          },
        },
        then: {
          type: "sequence",
          steps: [
            {
              type: "create-token",
              token: "flurry",
              controller: "controller",
            },
            {
              type: "draw",
              count: 1,
              player: "controller",
            },
          ],
        },
      },
    },
  }),
});

export const { blue: olBlue } = ol.cards;
