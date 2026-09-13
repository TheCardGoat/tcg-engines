import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/fyendal-s-spring-tunic.generated.ts";

export const fyendalSSpringTunic = defineCard(
  fabCardIdentitiesByCanonicalId["RP6pJj9WtwbTT79qdHPkz"],
  {
    keywords: [bladeBreak],
    abilities: {
      atStartTurnIfHasFewerThan3Energy: {
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
            type: "has-counter",
            counter: {
              kind: "named",
              name: "energy",
            },
            target: {
              selector: "self",
            },
            comparison: {
              op: "lt",
              value: 3,
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "add-counter",
              counter: {
                kind: "named",
                name: "energy",
              },
              count: 1,
              target: {
                selector: "self",
              },
            },
          },
        },
      },
      instantRemove3EnergyCountersFromGain: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "remove-counters",
          counter: {
            kind: "named",
            name: "energy",
          },
          count: 3,
        },
        effect: {
          type: "gain-resources",
          amount: 1,
        },
      },
    },
  },
);
