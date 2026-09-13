import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/shield-bash.generated.ts";

export const shieldBash = definePitchFamily(fabPitchFamilies["shield-bash"], {
  abilities: () => ({
    punishAttacker: {
      kind: "resolution",
      condition: {
        type: "defended-this-chain-link",
        filter: {
          typeBox: { supertypes: ["Guardian"], subtypes: ["Off-Hand"] },
          defense: { op: "gte", value: 1 },
        },
      },
      effect: {
        type: "unless",
        effect: {
          type: "deal-damage",
          damageType: "generic",
          amount: 1,
          target: { selector: "attacking-hero" },
        },
        escape: {
          type: "discard",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "attacking-hero",
            zones: ["hand"],
            count: 1,
          },
        },
      },
    },
  }),
});

export const {
  red: shieldBashRed,
  yellow: shieldBashYellow,
  blue: shieldBashBlue,
} = shieldBash.cards;
