import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/mask-of-perdition.generated.ts";

export const maskOfPerdition = defineCard(fabCardIdentitiesByCanonicalId["RnjfWPNBLBd9nGR8RdhnT"], {
  keywords: [battleworn],
  abilities: {
    atStartTurnMayDestroy2SilversControlIf: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "has-status",
          status: "in-your-graveyard",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                name: "Silver",
              },
              count: 2,
            },
          },
          then: {
            type: "equip",
            target: {
              selector: "self",
            },
          },
        },
      },
      functionalZones: ["graveyard"],
    },
    attackReactionDestroyMaskPerditionTargetAssassinAttackAction: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenHitsHeroBanishTopTheirDeck",
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
                target: {
                  kind: "hero",
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["deck"],
                  position: "top",
                  count: 1,
                },
                outputBinding: "banished",
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
              supertypes: ["Assassin"],
              types: ["Action"],
              subtypes: ["Attack"],
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
