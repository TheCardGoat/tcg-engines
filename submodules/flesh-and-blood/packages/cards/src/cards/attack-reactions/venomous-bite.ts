import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/venomous-bite.generated.ts";

export const venomousBite = definePitchFamily(fabPitchFamilies["venomous-bite"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    attackBoost: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: attackActionFilter({
          or: [{ typeBox: { supertypes: ["Assassin"] } }, { typeBox: { supertypes: ["Mystic"] } }],
        }),
        count: 1,
      },
      duration: "this-turn",
      outputBinding: "it",
    },
    createFangStrike: {
      kind: "resolution",
      condition: { type: "pitch-zone-has", filter: { color: ["blue"] } },
      effect: {
        type: "create-token",
        token: "fang-strike",
        controller: "controller",
        to: { zone: "hand" },
      },
    },
  }),
});
export const {
  red: venomousBiteRed,
  yellow: venomousBiteYellow,
  blue: venomousBiteBlue,
} = venomousBite.cards;
