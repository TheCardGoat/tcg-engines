import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/prognosticate.generated.ts";
import { opt } from "../shared/keywords.ts";

export const prognosticate = definePitchFamily(fabPitchFamilies["prognosticate"], {
  keywords: [opt(1)],
  parameters: { red: { damage: 3 }, yellow: { damage: 2 }, blue: { damage: 1 } },
  abilities: ({ damage }) => ({
    dealDamage: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: damage,
        target: {
          selector: "any-hero",
        },
      },
    },
    sourceDamageDealtOptSurge: {
      kind: "resolution",
      condition: {
        type: "source-damage-dealt",
        per: "turn",
        comparison: { op: "gt", value: damage },
      },
      effect: {
        type: "opt",
        count: 1,
      },
      label: {
        name: "surge",
      },
    },
  }),
});

export const {
  red: prognosticateRed,
  yellow: prognosticateYellow,
  blue: prognosticateBlue,
} = prognosticate.cards;
