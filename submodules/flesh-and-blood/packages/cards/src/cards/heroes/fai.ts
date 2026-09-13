import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/fai.generated.ts";

export const fai = defineCard(fabCardIdentitiesByCanonicalId["QHNfbDkffrKWgwDw7MjwQ"], {
  abilities: {
    startGamePhoenixFlameGraveyard: {
      kind: "static",
      staticKind: "meta",
      effect: {
        type: "start-game",
        setup: "place",
        filter: {
          name: "Phoenix Flame",
        },
        to: {
          zone: "graveyard",
        },
        optional: true,
      },
    },
    oncePerTurnInstantResourceResourceResourceReturnPhoenixFlameGraveyardHandAbilityCostsResourceLessDraconicChainLink:
      {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "instant",
        cost: {
          class: "asset",
          type: "resources",
          amount: 3,
        },
        costReduction: {
          amount: {
            type: "count",
            what: "chain-links",
            player: "controller",
            filter: {
              typeBox: {
                supertypes: ["Draconic"],
              },
            },
          },
        },
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
      },
  },
});
