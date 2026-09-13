import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { nextAttackPowerWithOnHit } from "../../authoring/attack-patterns.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/commit-to-corruption.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const commitToCorruption = definePitchFamily(fabPitchFamilies["commit-to-corruption"], {
  parameters: {
    red: { powerBonus: 3 },
    yellow: { powerBonus: 2 },
    blue: { powerBonus: 1 },
  },
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    nextAttackPowerWithOnHit: nextAttackPowerWithOnHit({
      amount: powerBonus,
      filter: { typeBox: { subtypes: ["Attack"] } },
      effect: {
        type: "create-card",
        name: "Corrupted Corpse",
        to: { zone: "banished" },
        controller: "controller",
      },
    }),
  }),
});

export const {
  red: commitToCorruptionRed,
  yellow: commitToCorruptionYellow,
  blue: commitToCorruptionBlue,
} = commitToCorruption.cards;
