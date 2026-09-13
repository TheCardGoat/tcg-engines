import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/display-of-craftsmanship.generated.ts";

export const displayOfCraftsmanship = definePitchFamily(
  fabPitchFamilies["display-of-craftsmanship"],
  {
    parameters: pitchMap({ red: 4, yellow: 3, blue: 2 }),
    abilities: (amount) => ({
      weaponBoost: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: { type: "has-status", status: "sharpened" },
            then: {
              type: "add-counter",
              counter: {
                kind: "numeric",
                value: 1,
                property: "power",
              },
              count: 1,
              target: {
                selector: "binding",
                binding: "it",
              },
            },
          },
        ],
      },
    }),
  },
);

export const {
  red: displayOfCraftsmanshipRed,
  yellow: displayOfCraftsmanshipYellow,
  blue: displayOfCraftsmanshipBlue,
} = displayOfCraftsmanship.cards;
