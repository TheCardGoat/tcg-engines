import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/flash-bolt.generated.ts";

export const flashBolt = definePitchFamily(fabPitchFamilies["flash-bolt"], {
  parameters: pitchMap({ red: { amount: 3 }, yellow: { amount: 2 }, blue: { amount: 1 } }),
  abilities: ({ amount }) => ({
    dealArcaneDamage: {
      type: "deal-damage",
      damageType: "arcane",
      amount,
      target: { selector: "any-hero" },
    },
  }),
});

export const { red: flashBoltRed, yellow: flashBoltYellow, blue: flashBoltBlue } = flashBolt.cards;
