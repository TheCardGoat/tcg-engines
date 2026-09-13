import { boost } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/heist.generated.ts";

export const heist = definePitchFamily(fabPitchFamilies["heist"], {
  keywords: [boost],
  abilities: () => ({
    hitsPutItemCost01AnyBanishedZoneArena: {
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
          target: {
            kind: "hero",
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
              player: "any",
              zones: ["banished"],
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

export const { red: heistRed } = heist.cards;
