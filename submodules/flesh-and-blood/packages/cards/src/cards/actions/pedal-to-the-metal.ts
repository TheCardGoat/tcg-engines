import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pedal-to-the-metal.generated.ts";
import { boost, dominate } from "../shared/keywords.ts";

export const pedalToTheMetal = definePitchFamily(fabPitchFamilies["pedal-to-the-metal"], {
  keywords: [boost],
  abilities: () => ({
    triggeredHitGrantPropertyThisTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: dominate,
          },
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
            },
          },
        },
      },
    },
  }),
});

export const {
  red: pedalToTheMetalRed,
  yellow: pedalToTheMetalYellow,
  blue: pedalToTheMetalBlue,
} = pedalToTheMetal.cards;
