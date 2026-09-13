import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/biting-blade.generated.ts";

export const bitingBlade = definePitchFamily(fabPitchFamilies["biting-blade"], {
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
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["weapon", "permanent", "combat-chain"],
          filter: { typeBox: { types: ["Weapon"] } },
          count: { type: "all" },
        },
        duration: "this-turn",
      },
      label: { name: "reprise" },
    },
  }),
});

export const {
  red: bitingBladeRed,
  yellow: bitingBladeYellow,
  blue: bitingBladeBlue,
} = bitingBlade.cards;
