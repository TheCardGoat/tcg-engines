import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/voltic-bolt.generated.ts";

/** Model notes (hand-authored): deal 5 arcane to target hero; no extra clause. */
export const volticBolt = definePitchFamily(fabPitchFamilies["voltic-bolt"], {
  parameters: pitchMap({ red: { damage: 5 }, yellow: { damage: 4 }, blue: { damage: 3 } }),
  abilities: ({ damage }) => ({
    resolutionDealDamage: {
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
  }),
});

export const {
  red: volticBoltRed,
  yellow: volticBoltYellow,
  blue: volticBoltBlue,
} = volticBolt.cards;
