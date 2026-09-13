import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rapid-fire.generated.ts";

export const rapidFire = definePitchFamily(fabPitchFamilies["rapid-fire"], {
  keywords: [
    {
      name: "reload",
    },
    goAgain,
  ],
  abilities: () => ({
    endTurnArrowsGainGoAgain: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent", "combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Arrow"],
            },
          },
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { yellow: rapidFireYellow } = rapidFire.cards;
