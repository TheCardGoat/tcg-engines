import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/celestial-reprimand.generated.ts";

export const celestialReprimand = definePitchFamily(fabPitchFamilies["celestial-reprimand"], {
  parameters: pitchMap({
    red: 3,
    yellow: 2,
    blue: 1,
  }),
  abilities: (amount) => ({
    reduceHeraldDefense: {
      type: "modify-numeric",
      property: "power",
      op: "subtract",
      amount,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: {
          defending: true,
          defendingAgainst: {
            and: [{ typeBox: { subtypes: ["Attack"] } }, { nameContains: "Herald" }],
          },
        },
        count: 1,
      },
      duration: "this-combat-chain",
      outputBinding: "it",
    },
  }),
});

export const {
  red: celestialReprimandRed,
  yellow: celestialReprimandYellow,
  blue: celestialReprimandBlue,
} = celestialReprimand.cards;
