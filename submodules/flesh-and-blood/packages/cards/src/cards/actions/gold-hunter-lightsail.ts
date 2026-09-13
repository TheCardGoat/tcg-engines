import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/gold-hunter-lightsail.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const goldHunterLightsail = definePitchFamily(fabPitchFamilies["gold-hunter-lightsail"], {
  abilities: () => ({
    whenAttacksIfControlLessGoldThanOpponentGets: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        },
        state: {
          type: "not",
          condition: {
            type: "zone-count",
            zone: "permanent",
            player: "controller",
            filter: {
              name: "Gold",
            },
            comparison: {
              op: "gte",
              value: {
                type: "count",
                what: "cards-in-zone",
                zone: "permanent",
                player: "opponent",
                filter: {
                  name: "Gold",
                },
              },
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
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
  }),
});
export const { yellow: goldHunterLightsailYellow } = goldHunterLightsail.cards;
