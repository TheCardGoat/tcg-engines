import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/cindra.generated.ts";

export const cindra = defineCard(fabCardIdentitiesByCanonicalId["m7hWTmtRzJnrtqtfLLR6M"], {
  abilities: {
    wheneverHitMarkedCreateFealtyToken: {
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
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              hasStatus: "marked",
            },
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "fealty",
          controller: "controller",
        },
      },
    },
    oncePerTurnInstantResourceResourceResourceEquipUp2DraconicDaggersGraveyardCostsResourceLessActivateDraconicChainLink:
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
        // Same shape as FAI001-a2: dynamic activation discount from Draconic chain links.
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
          type: "equip",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["graveyard"],
            filter: {
              and: [
                {
                  typeBox: {
                    supertypes: ["Draconic"],
                  },
                },
                {
                  typeBox: {
                    subtypes: ["Dagger"],
                  },
                },
              ],
            },
            count: { type: "up-to", amount: 2 },
          },
        },
      },
  },
});
