import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/hood-of-red-sand.generated.ts";

export const hoodOfRedSand = defineCard(fabCardIdentitiesByCanonicalId["6ntF8Rdm7PqLkHWnPMkrF"], {
  keywords: [
    {
      name: "specialization",
      hero: "Kassai",
    },
    battleworn,
  ],
  abilities: {
    attackReactionBanishRedYellowFromGraveyardDestroyTarget: {
      kind: "activated",
      abilityType: "attack-reaction",
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
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "effect",
                type: "banish",
                from: "graveyard",
                count: 1,
                filter: {
                  color: ["red"],
                },
              },
              {
                class: "effect",
                type: "banish",
                from: "graveyard",
                count: 1,
                filter: {
                  color: ["yellow"],
                },
              },
            ],
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenHitsDraw",
            text: "",
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
                type: "draw",
                count: 1,
                player: "controller",
              },
            },
          },
        },
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Sword"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  },
});
