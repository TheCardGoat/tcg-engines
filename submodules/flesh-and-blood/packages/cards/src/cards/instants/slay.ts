import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/slay.generated.ts";

export const slay = definePitchFamily(fabPitchFamilies["slay"], {
  abilities: () => ({
    destroyTargetAngelAlly: {
      kind: "resolution",
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["permanent"],
          filter: {
            typeBox: {
              subtypes: ["Angel", "Ally"],
            },
          },
          count: 1,
        },
      },
    },
  }),
});

export const { red: slayRed } = slay.cards;
