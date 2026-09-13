import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/celestial-resolve.generated.ts";

export const celestialResolve = definePitchFamily(fabPitchFamilies["celestial-resolve"], {
  parameters: pitchMap({
    red: 5,
    yellow: 4,
    blue: 3,
  }),
  abilities: (amount) => ({
    reinforceHerald: {
      type: "modify-numeric",
      property: "defense",
      op: "add",
      amount,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: attackActionFilter({ nameContains: "Herald" }),
        count: 1,
      },
      duration: "this-turn",
      outputBinding: "it",
    },
  }),
});

export const {
  red: celestialResolveRed,
  yellow: celestialResolveYellow,
  blue: celestialResolveBlue,
} = celestialResolve.cards;
