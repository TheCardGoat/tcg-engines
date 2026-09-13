import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/corpse-cover.generated.ts";

export const corpseCover = definePitchFamily(fabPitchFamilies["corpse-cover"], {
  abilities: () => ({
    oncePerTurnInstantDestroyOrDiscardAllyPreventNextTwoWhileDefending: {
      kind: "activated",
      limit: { count: 1, per: "turn" },
      abilityType: "instant",
      functionalZones: ["combat-chain"],
      condition: { type: "has-status", status: "defending" },
      cost: {
        class: "mixed",
        type: "alternative",
        costs: [
          {
            class: "effect",
            type: "destroy",
            filter: { typeBox: { subtypes: ["Ally"] } },
            count: 1,
          },
          {
            class: "effect",
            type: "discard",
            filter: { typeBox: { subtypes: ["Ally"] } },
            count: 1,
          },
        ],
      },
      effect: {
        type: "prevention",
        preventionKind: "shielding",
        amount: 2,
        shielded: { selector: "controller" },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: corpseCoverRed,
  yellow: corpseCoverYellow,
  blue: corpseCoverBlue,
} = corpseCover.cards;
