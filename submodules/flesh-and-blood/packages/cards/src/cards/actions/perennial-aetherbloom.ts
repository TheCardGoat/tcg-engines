import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/perennial-aetherbloom.generated.ts";

export const perennialAetherbloom = definePitchFamily(fabPitchFamilies["perennial-aetherbloom"], {
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
    sourceDamageDealtMoveCardSurge: {
      kind: "resolution",
      condition: {
        type: "source-damage-dealt",
        per: "turn",
        comparison: { op: "gt", value: damage },
      },
      effect: {
        type: "move-card",
        target: {
          selector: "self",
        },
        to: {
          zone: "deck",
          position: "bottom",
        },
      },
      label: {
        name: "surge",
      },
    },
  }),
});

export const {
  red: perennialAetherbloomRed,
  yellow: perennialAetherbloomYellow,
  blue: perennialAetherbloomBlue,
} = perennialAetherbloom.cards;
