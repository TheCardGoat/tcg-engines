import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/prismatic-leyline.generated.ts";

export const prismaticLeyline = definePitchFamily(fabPitchFamilies["prismatic-leyline"], {
  keywords: [goAgain],
  abilities: () => ({
    nextRedAttackTurnGets1PowerNextYellowGets2PowerNextBlueGets3Power: {
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
                color: ["red"],
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
            },
          },
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
                color: ["yellow"],
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
            },
          },
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                color: ["blue"],
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
            },
          },
        ],
      },
    },
  }),
});

export const { yellow: prismaticLeylineYellow } = prismaticLeyline.cards;
