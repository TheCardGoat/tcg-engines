import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/drone-of-brutality.generated.ts";
export const droneOfBrutality = definePitchFamily(fabPitchFamilies["drone-of-brutality"], {
  abilities: () => ({
    staticContinuousReplacementMove: {
      kind: "static",
      staticKind: "continuous",
      functionalZones: [
        "hand",
        "deck",
        "arsenal",
        "pitch",
        "stack",
        "combat-chain",
        "permanent",
        "banished",
        "graveyard",
      ],
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "move-zone",
          to: "graveyard",
          subject: "self",
        },
        modification: {
          type: "move-card",
          target: {
            selector: "self",
          },
          to: {
            zone: "deck",
            position: "bottom",
          },
        },
        duration: "permanent",
      },
    },
  }),
});
export const {
  red: droneOfBrutalityRed,
  yellow: droneOfBrutalityYellow,
  blue: droneOfBrutalityBlue,
} = droneOfBrutality.cards;
