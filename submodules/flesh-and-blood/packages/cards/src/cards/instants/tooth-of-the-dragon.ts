import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/tooth-of-the-dragon.generated.ts";

export const toothOfTheDragon = definePitchFamily(fabPitchFamilies["tooth-of-the-dragon"], {
  abilities: () => ({
    nextDraconicAttackTurnGets3: {
      kind: "resolution",
      effect: {
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
            typeBox: {
              supertypes: ["Draconic"],
            },
          },
        },
      },
    },
  }),
});

export const { red: toothOfTheDragonRed } = toothOfTheDragon.cards;
