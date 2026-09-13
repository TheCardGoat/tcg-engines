import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/stoke-the-flames.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const stokeTheFlames = definePitchFamily(fabPitchFamilies["stoke-the-flames"], {
  abilities: () => ({
    whenHitsReturnPhoenixFlameFromGraveyardHandDoStokeFlamesGains: {
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
              zones: ["graveyard"],
              filter: {
                name: "Phoenix Flame",
              },
              count: 1,
            },
            to: {
              zone: "hand",
            },
          },
          then: {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
        },
      },
    },
  }),
});

export const { red: stokeTheFlamesRed } = stokeTheFlames.cards;
