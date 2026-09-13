import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/unhallowed-rites.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const unhallowedRites = definePitchFamily(fabPitchFamilies["unhallowed-rites"], {
  keywords: [bloodDebt],
  abilities: () => ({
    playStaticEffect: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "performed-this-turn",
        event: "play-non-attack-action",
        player: "controller",
      },
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
        optional: true,
      },
    },
    resolutionOptional: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["graveyard"],
            filter: {
              and: [
                {
                  typeBox: {
                    excludeSubtypes: ["Attack"],
                  },
                },
                {
                  typeBox: {
                    types: ["Action"],
                  },
                },
                {
                  hasKeyword: "blood-debt",
                },
              ],
            },
            count: 1,
          },
          to: {
            zone: "deck",
            position: "bottom",
          },
        },
      },
    },
  }),
});

export const {
  red: unhallowedRitesRed,
  yellow: unhallowedRitesYellow,
  blue: unhallowedRitesBlue,
} = unhallowedRites.cards;
