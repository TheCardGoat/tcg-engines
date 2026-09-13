import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/scarf-for-a-scarf.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const scarfForAScarf = definePitchFamily(fabPitchFamilies["scarf-for-a-scarf"], {
  abilities: () => ({
    whenAttacksHeroExchangeHeadEquipmentPermanentWithThemDoGetsGo: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
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
          type: "if-you-do",
          effect: {
            type: "exchange",
            first: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["equipment-head"],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                },
              },
              count: 1,
            },
            second: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["equipment-head"],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                },
              },
              count: 1,
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

export const { red: scarfForAScarfRed } = scarfForAScarf.cards;
