import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/lubricate.generated.ts";

export const lubricate = definePitchFamily(fabPitchFamilies["lubricate"], {
  abilities: () => ({
    up3CogsControl: {
      kind: "resolution",
      effect: {
        type: "untap",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          filter: {
            typeBox: {
              subtypes: ["Cog"],
            },
          },
          count: {
            type: "up-to",
            amount: 3,
          },
        },
      },
    },
  }),
});

export const { blue: lubricateBlue } = lubricate.cards;
