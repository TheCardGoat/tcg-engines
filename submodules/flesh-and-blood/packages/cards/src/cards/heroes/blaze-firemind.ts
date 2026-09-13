import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/blaze-firemind.generated.ts";

export const blazeFiremind = defineCard(fabCardIdentitiesByCanonicalId["hJdWJJWrBzNBBFz9BCJDw"], {
  abilities: {
    wheneverOptPutEnergyCountersBlazeEqualNumberLookedWay: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "opt",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "add-counter",
          counter: {
            kind: "named",
            name: "energy",
          },
          count: {
            type: "count",
            what: "looked-at-this-way",
          },
          target: {
            selector: "self",
          },
        },
      },
    },
    oncePerTurnInstantRemoveXEnergyCountersBlazeBanishWizardNonAttackActionHandEffectDealsArcaneDamageEqualXPlayTurnThoughWereInstant:
      {
        kind: "activated",
        abilityType: "instant",
        limit: {
          count: 1,
          per: "turn",
        },
        cost: {
          class: "effect",
          type: "remove-counters",
          counter: {
            kind: "named",
            name: "energy",
          },
          count: {
            type: "x",
          },
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                filter: {
                  typeBox: {
                    supertypes: ["Wizard"],
                    types: ["Action"],
                    excludeSubtypes: ["Attack"],
                  },
                  hasStatus: "arcane-damage-effect-equal-to-x",
                },
                count: 1,
              },
              outputBinding: "it",
            },
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
          ],
        },
      },
  },
});
