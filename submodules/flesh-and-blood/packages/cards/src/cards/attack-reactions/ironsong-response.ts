import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/ironsong-response.generated.ts";

export const ironsongResponse = definePitchFamily(fabPitchFamilies["ironsong-response"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    reprise: {
      kind: "resolution",
      condition: { type: "defended-this-chain-link", from: "hand" },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: { typeBox: { types: ["Weapon"] } },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
      label: { name: "reprise" },
    },
  }),
});

export const {
  red: ironsongResponseRed,
  yellow: ironsongResponseYellow,
  blue: ironsongResponseBlue,
} = ironsongResponse.cards;
