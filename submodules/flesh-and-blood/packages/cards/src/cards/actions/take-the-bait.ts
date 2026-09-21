import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/take-the-bait.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const takeTheBait = definePitchFamily(fabPitchFamilies["take-the-bait"], {
  keywords: [
    {
      name: "specialization",
      hero: "Riptide",
    },
    goAgain,
  ],
  abilities: () => ({
    searchDeckForShufflePutOnTop: {
      kind: "resolution",
      effect: {
        type: "search",
        zones: ["deck"],
        filter: {},
        mayFail: true,
        to: {
          zone: "deck",
          position: "top",
        },
      },
    },
    createBaitTokenUnderOpponentSControl: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "bait",
        creator: "effect-controller",
        controller: "opponent",
      },
    },
  }),
});

export const { red: takeTheBaitRed } = takeTheBait.cards;
