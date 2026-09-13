import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/drowning-dire.generated.ts";
import { dominate } from "../shared/keywords.ts";
export const drowningDire = definePitchFamily(fabPitchFamilies["drowning-dire"], {
  keywords: [],
  abilities: () => ({
    resolutionPerformedTurnPlayCreateAuraGrantProperty: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "play-or-create-aura",
        player: "controller",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: dominate,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
    staticTriggeredHitOptionalMove: {
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
                typeBox: {
                  types: ["Action"],
                  excludeSubtypes: ["Attack"],
                },
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
    },
  }),
});
export const {
  red: drowningDireRed,
  yellow: drowningDireYellow,
  blue: drowningDireBlue,
} = drowningDire.cards;
