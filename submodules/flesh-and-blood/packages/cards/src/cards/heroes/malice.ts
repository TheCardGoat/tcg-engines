import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/malice.generated.ts";

export const malice = defineCard(fabCardIdentitiesByCanonicalId["rrJg7Bntjp9WzWNcnJcjw"], {
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
      // Continuous until-EOT permission for the targeted zombie (not an immediate
      // optional cast). Printed "you may play target zombie" grants permission.
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
});
