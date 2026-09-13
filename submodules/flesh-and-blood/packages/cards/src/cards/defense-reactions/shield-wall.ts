import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/shield-wall.generated.ts";

export const shieldWall = definePitchFamily(fabPitchFamilies["shield-wall"], {
  abilities: () => ({
    guardianOffHandDefense: {
      kind: "resolution",
      condition: {
        type: "control-object",
        filter: { typeBox: { supertypes: ["Guardian"], subtypes: ["Off-Hand"] } },
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 4,
        target: { selector: "self" },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: shieldWallRed,
  yellow: shieldWallYellow,
  blue: shieldWallBlue,
} = shieldWall.cards;
