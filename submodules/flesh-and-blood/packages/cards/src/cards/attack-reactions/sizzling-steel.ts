import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/sizzling-steel.generated.ts";

const daggerAttack = {
  selector: "object",
  declared: "on-stack",
  zones: ["combat-chain"],
  filter: {
    typeBox: {
      subtypes: ["Dagger"],
    },
  },
  count: 1,
} as const;

export const sizzlingSteel = definePitchFamily(fabPitchFamilies["sizzling-steel"], {
  abilities: () => ({
    boostDaggerForDraconicLinks: {
      kind: "resolution",
      // CR 6.4.7: one declared dagger-attack target; the Draconic-link clause
      // replaces the preceding +3 when the count holds at generation.
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
            target: daggerAttack,
            duration: "this-turn",
            outputBinding: "it",
          },
          {
            type: "self-replacement",
            condition: {
              type: "compare-amount",
              amount: {
                type: "count",
                what: "chain-links",
                player: "controller",
                filter: { typeBox: { supertypes: ["Draconic"] } },
              },
              comparison: { op: "gte", value: 2 },
            },
            modification: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 4,
              target: daggerAttack,
              duration: "this-turn",
            },
          },
        ],
      },
    },
  }),
});

export const { red: sizzlingSteelRed } = sizzlingSteel.cards;
