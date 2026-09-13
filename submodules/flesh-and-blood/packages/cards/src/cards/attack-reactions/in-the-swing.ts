import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/in-the-swing.generated.ts";

export const inTheSwing = definePitchFamily(fabPitchFamilies["in-the-swing"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    weaponAttackThreshold: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "compare-amount",
        amount: { type: "count", what: "weapon-attacks-this-turn" },
        comparison: { op: "gte", value: 2 },
      },
      playEffect: { role: "condition" },
    },
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
  }),
});

export const {
  red: inTheSwingRed,
  yellow: inTheSwingYellow,
  blue: inTheSwingBlue,
} = inTheSwing.cards;
