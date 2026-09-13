import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/malice-domina-of-the-dead.generated.ts";

export const maliceDominaOfTheDead = defineCard(
  fabCardIdentitiesByCanonicalId["cz8FPm7Rjjndfgb8jQBcT"],
  {
    abilities: {
      actionResourceTapEndTurnPlayTargetZombieGraveyardGoAgain: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            {
              class: "effect",
              type: "tap-self",
            },
          ],
        },
        layerKeywords: [goAgain],
        // Continuous until-EOT permission for the targeted zombie (Young IAR054 parity).
        effect: {
          type: "play-card",
          fromZones: ["graveyard"],
          source: {
            selector: "object",
            declared: "on-stack",
            player: "controller",
            zones: ["graveyard"],
            filter: {
              hasStatus: "face-up",
              typeBox: {
                subtypes: ["Zombie"],
              },
            },
            count: 1,
          },
          duration: "this-turn",
        },
      },
      wheneverZombieDiesBanishFaceDownCreateCorruptedCorpseBanishedZone: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "dies",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "moved-object",
              relationship: {
                kind: "controller",
                player: "ability-controller",
              },
              filter: {
                typeBox: {
                  subtypes: ["Zombie"],
                },
              },
              bindAs: "it",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "banish",
                target: {
                  selector: "binding",
                  binding: "it",
                },
                faceDown: true,
              },
              {
                type: "create-card",
                name: "Corrupted Corpse",
                to: {
                  zone: "banished",
                },
              },
            ],
          },
        },
      },
    },
  },
);
