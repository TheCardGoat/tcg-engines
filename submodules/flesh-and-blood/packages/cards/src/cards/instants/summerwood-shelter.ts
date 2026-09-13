import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/summerwood-shelter.generated.ts";

export const summerwoodShelter = definePitchFamily(fabPitchFamilies["summerwood-shelter"], {
  parameters: pitchMap({ red: 4, yellow: 3, blue: 2 }),
  abilities: (amount) => ({
    shelter: {
      type: "modify-numeric",
      property: "defense",
      op: "add",
      amount,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: {
          typeBox: {
            types: ["Action"],
          },
          or: [
            {
              typeBox: {
                supertypes: ["Earth"],
              },
            },
            {
              typeBox: {
                supertypes: ["Elemental"],
              },
            },
          ],
          defending: true,
        },
        count: 1,
      },
      duration: "this-turn",
      outputBinding: "it",
    },
  }),
});

export const {
  red: summerwoodShelterRed,
  yellow: summerwoodShelterYellow,
  blue: summerwoodShelterBlue,
} = summerwoodShelter.cards;
