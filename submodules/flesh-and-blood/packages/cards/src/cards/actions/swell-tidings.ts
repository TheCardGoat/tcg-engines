import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/swell-tidings.generated.ts";

export const swellTidings = definePitchFamily(fabPitchFamilies["swell-tidings"], {
  abilities: () => ({
    dealNumber5ArcaneDamageHero: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 5,
        target: {
          selector: "any-hero",
        },
      },
    },
    dealsMoreThanNumber5DamageCreatePonderToken: {
      kind: "resolution",
      condition: {
        type: "source-damage-dealt",
        per: "turn",
        comparison: { op: "gt", value: 5 },
      },
      effect: {
        type: "create-token",
        token: "ponder",
        controller: "controller",
      },
      label: {
        name: "surge",
      },
    },
  }),
});

export const { red: swellTidingsRed } = swellTidings.cards;
