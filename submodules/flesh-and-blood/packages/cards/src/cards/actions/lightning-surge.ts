import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lightning-surge.generated.ts";

const abilities = {
  playedThisGrantPropertyGoAgainThisTurn: {
    kind: "resolution",
    condition: {
      type: "played-this",
      per: "turn",
      onlySource: true,
      filter: {
        playedFromZones: ["arsenal"],
      },
    },
    effect: {
      type: "grant-property",
      property: {
        kind: "keyword",
        keyword: {
          name: "go-again",
        },
      },
      target: {
        selector: "self",
      },
      duration: "this-turn",
    },
  },
} as const;

export const lightningSurge = definePitchFamily(fabPitchFamilies["lightning-surge"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: lightningSurgeRed,
  yellow: lightningSurgeYellow,
  blue: lightningSurgeBlue,
} = lightningSurge.cards;
