import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/nuu-alluring-desire.generated.ts";

export const nuuAlluringDesire = defineCard(
  fabCardIdentitiesByCanonicalId["MghLPDjq8CfBJ8RzNc7Ft"],
  {
    abilities: {
      attacksStealthGetChainLinkResolvesBanishAllActionDefending: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "chainLinkResolvesBanishAllActionDefending",
              text: "",
              trigger: {
                kind: "event",
                event: {
                  name: "chain-link-resolve",
                  actor: {
                    kind: "any",
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
                  type: "banish",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    zones: ["combat-chain"],
                    filter: {
                      typeBox: {
                        types: ["Action"],
                      },
                      defending: true,
                    },
                    count: {
                      type: "all",
                    },
                  },
                },
              },
            },
          },
          target: {
            selector: "this-attack",
          },
          duration: "while-in-arena",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
              hasKeyword: "stealth",
            },
            count: 99,
          },
        },
      },
      instantChiChiChiLookTopOpposingHerosDeckBlueBanishEndTurnPlayBlueHerosBanishedZoneWithoutPayingResourceCost:
        {
          kind: "activated",
          abilityType: "instant",
          cost: {
            class: "asset",
            type: "chi",
            amount: 3,
          },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "look",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["deck"],
                  position: "top",
                  count: 1,
                },
                outputBinding: "it",
              },
              {
                type: "conditional",
                condition: {
                  type: "binding-matches",
                  binding: "it",
                  filter: {
                    color: ["blue"],
                  },
                },
                then: {
                  type: "optional",
                  effect: {
                    type: "banish",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                  },
                },
              },
              {
                type: "play-card",
                fromZones: ["banished"],
                source: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["banished"],
                  filter: {
                    color: ["blue"],
                  },
                  count: {
                    type: "all",
                  },
                },
                costModification: "free",
                duration: "this-turn",
              },
            ],
          },
        },
    },
  },
);
