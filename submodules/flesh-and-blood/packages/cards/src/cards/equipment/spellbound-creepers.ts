import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/spellbound-creepers.generated.ts";

export const spellboundCreepers = defineCard(
  fabCardIdentitiesByCanonicalId["GrRfK6zQrd8DHzTHFhFfh"],
  {
    keywords: [bladeBreak],
    abilities: {
      oncePerTurnInstantPutBindCounterSpellboundCreepers: {
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
              amount: 1,
            },
            {
              class: "effect",
              type: "add-counter",
              counter: {
                kind: "named",
                name: "bind",
              },
              count: 1,
            },
          ],
        },
        condition: {
          type: "performed-this-turn",
          event: "attack-or-defend-attack-action",
          player: "controller",
        },
        effect: {
          type: "optional",
          effect: {
            type: "play-card",
            fromZones: ["hand"],
            source: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
              filter: {
                typeBox: {
                  types: ["Action"],
                  excludeSubtypes: ["Attack"],
                },
              },
            },
            appliesTo: {
              next: {
                typeBox: {
                  types: ["Action"],
                  excludeSubtypes: ["Attack"],
                },
              },
            },
            duration: "this-turn",
            asType: "instant",
          },
        },
      },
      atBeginningEndPhaseDestroySpellboundCreepersUnlessHave: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "end-phase",
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
            type: "conditional",
            condition: {
              type: "has-status",
              status: "dealt-arcane-lt-bind-counters-on-self",
            },
            then: {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
          },
        },
      },
    },
  },
);
