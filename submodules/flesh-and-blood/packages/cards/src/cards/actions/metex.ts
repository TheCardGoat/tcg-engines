import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/metex.generated.ts";
import { boost } from "../shared/keywords.ts";

export const metex = definePitchFamily(fabPitchFamilies["metex"], {
  keywords: [boost],
  abilities: () => ({
    triggeredHitOptionalMoveCard: {
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
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {
                typeBox: {
                  subtypes: ["Item"],
                },
                cost: {
                  op: "lte",
                  value: 1,
                },
              },
              count: 1,
            },
            to: {
              zone: "permanent",
            },
          },
        },
      },
    },
  }),
});

export const { red: metexRed, yellow: metexYellow, blue: metexBlue } = metex.cards;
