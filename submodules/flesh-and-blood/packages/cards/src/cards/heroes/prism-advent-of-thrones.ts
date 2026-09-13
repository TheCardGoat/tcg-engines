import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/prism-advent-of-thrones.generated.ts";

export const prismAdventOfThrones = defineCard(
  fabCardIdentitiesByCanonicalId["dhbhdcr8CB6ngRrf9GTgm"],
  {
    abilities: {
      wheneverHeraldNamePutPrismsSoulDuringActionPhaseSearchDeckFigmentPutArenaThenShuffle: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "move-zone",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "moved-object",
              relationship: {
                kind: "zone-owner",
                player: "ability-controller",
              },
              filter: {
                moniker: "herald",
              },
              bindAs: "it",
            },
            during: {
              kind: "phase",
              phase: "action",
            },
            to: "soul",
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "optional",
                effect: {
                  type: "search",
                  zones: ["deck"],
                  filter: {
                    typeBox: {
                      subtypes: ["Figment"],
                    },
                  },
                  mayFail: true,
                  to: {
                    zone: "permanent",
                  },
                },
              },
              {
                type: "shuffle",
                zone: "deck",
              },
            ],
          },
        },
      },
      oncePerTurnInstantResourceResourceBanishPrismsSoulAwakenTargetFigment: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 2,
            },
            {
              class: "effect",
              type: "banish",
              from: "soul",
              count: 1,
            },
          ],
        },
        effect: {
          type: "awaken",
          target: {
            selector: "object",
            declared: "on-stack",
            player: "controller",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Figment"],
              },
            },
            count: 1,
          },
        },
      },
    },
  },
);
