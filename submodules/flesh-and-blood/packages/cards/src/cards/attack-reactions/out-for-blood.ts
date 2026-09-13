import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/out-for-blood.generated.ts";

export const outForBlood = definePitchFamily(fabPitchFamilies["out-for-blood"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    weaponBoost: {
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
    reprise: {
      kind: "resolution",
      condition: { type: "defended-this-chain-link", from: "hand" },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: { selector: "this-attack" },
        duration: "this-turn",
        appliesTo: { next: { typeBox: { subtypes: ["Attack"] } } },
      },
      label: { name: "reprise" },
    },
  }),
});

export const {
  red: outForBloodRed,
  yellow: outForBloodYellow,
  blue: outForBloodBlue,
} = outForBlood.cards;
