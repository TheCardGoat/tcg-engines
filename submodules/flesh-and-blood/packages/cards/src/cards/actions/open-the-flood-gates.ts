import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/open-the-flood-gates.generated.ts";

export const openTheFloodGates = definePitchFamily(fabPitchFamilies["open-the-flood-gates"], {
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
    sourceDamageDealtDrawSurge: {
      kind: "resolution",
      condition: {
        type: "source-damage-dealt",
        per: "turn",
        comparison: { op: "gt", value: damage },
      },
      effect: {
        type: "draw",
        count: 2,
        player: "controller",
      },
      label: {
        name: "surge",
      },
    },
  }),
});

export const {
  red: openTheFloodGatesRed,
  yellow: openTheFloodGatesYellow,
  blue: openTheFloodGatesBlue,
} = openTheFloodGates.cards;
