import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/ball-lightning.generated.ts";

import { goAgain } from "../shared/keywords.ts";

const abilities = {
  modifyNumericCount: {
    kind: "resolution",
    effect: {
      type: "replacement",
      replacementKind: "standard",
      replaces: {
        name: "damage",
        filter: {
          typeBox: {
            types: ["Action"],
          },
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
} as const;

export const ballLightning = definePitchFamily(fabPitchFamilies["ball-lightning"], {
  keywords: [goAgain],
  abilities: () => ({ ...abilities }),
});

export const {
  red: ballLightningRed,
  yellow: ballLightningYellow,
  blue: ballLightningBlue,
} = ballLightning.cards;
