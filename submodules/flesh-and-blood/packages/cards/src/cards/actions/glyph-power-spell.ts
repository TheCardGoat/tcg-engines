import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/glyph-power-spell.generated.ts";

const anyTarget = {
  selector: "object",
  declared: "on-stack",
  zones: ["hero", "permanent"],
  count: 1,
} as const;

export const glyphPowerSpell = definePitchFamily(fabPitchFamilies["glyph-power-spell"], {
  abilities: () => ({
    deal4ArcaneDamageAnyTargetIfControlSigil: {
      kind: "resolution",
      // CR 6.4.7: same declared target; a controlled Sigil replaces deal-4 with
      // deal-6. Not Class C `replacement` of a future damage event.
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            damageType: "arcane",
            amount: 4,
            target: anyTarget,
          },
          {
            type: "self-replacement",
            condition: {
              type: "control-object",
              filter: {
                nameContains: "Sigil",
              },
            },
            modification: {
              type: "deal-damage",
              damageType: "arcane",
              amount: 6,
              target: anyTarget,
            },
          },
        ],
      },
    },
  }),
});
export const { red: glyphPowerSpellRed } = glyphPowerSpell.cards;
