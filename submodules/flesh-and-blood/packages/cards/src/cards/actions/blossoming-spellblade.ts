import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blossoming-spellblade.generated.ts";

export const blossomingSpellblade = definePitchFamily(fabPitchFamilies["blossoming-spellblade"], {
  keywords: [fusion(["Earth", "Lightning"], "and")],
  abilities: () => ({
    ifBlossomingSpellbladeWasFusedGainsWheneverDealsDamage: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "wheneverDealsDamageOpposingHeroMayBanishNonAttack",
            text: "",
            trigger: {
              kind: "event",
              event: {
                name: "dealt-damage",
                actor: {
                  kind: "any",
                },
                observes: {
                  kind: "none",
                },
                target: {
                  kind: "hero",
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "optional",
                effect: {
                  type: "banish",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["graveyard"],
                    filter: {
                      and: [
                        {
                          typeBox: {
                            excludeSubtypes: ["Attack"],
                          },
                        },
                        {
                          typeBox: {
                            types: ["Action"],
                          },
                        },
                      ],
                    },
                    count: 1,
                  },
                  outputBinding: "banished",
                },
                then: {
                  type: "optional",
                  effect: {
                    type: "sequence",
                    steps: [
                      {
                        type: "play-card",
                        fromZones: ["banished"],
                        source: {
                          selector: "binding",
                          binding: "it",
                        },
                        duration: "this-turn",
                        asType: "instant",
                      },
                      {
                        type: "replacement",
                        replacementKind: "standard",
                        replaces: {
                          name: "move-zone",
                          subject: "self",
                          to: "graveyard",
                        },
                        modification: {
                          type: "banish",
                          target: {
                            selector: "binding",
                            binding: "it",
                          },
                        },
                        duration: "this-turn",
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
    whenAttackBlossomingSpellbladeIfWasFusedDeal1: {
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
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Blossoming Spellblade",
            },
          },
        },
        state: {
          type: "has-status",
          status: "fused",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 1,
          target: {
            selector: "any-hero",
          },
        },
      },
    },
  }),
});
export const { red: blossomingSpellbladeRed } = blossomingSpellblade.cards;
