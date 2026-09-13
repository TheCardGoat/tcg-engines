import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/cindra-dracai-of-retribution.generated.ts";

export const cindraDracaiOfRetribution = defineCard(
  fabCardIdentitiesByCanonicalId["HRtHpngjPbHNKCFMbJw7m"],
  {
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
          // Parity with Young CIN001: activation discount from Draconic chain links
          // (not a post-equip sequence step with bogus Chain/Link subtypes).
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
  },
);
