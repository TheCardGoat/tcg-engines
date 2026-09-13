import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/rhinar.generated.ts";

export const rhinar = defineCard(fabCardIdentitiesByCanonicalId["wNRqrHCn6rrKLhrDkqPwp"], {
  abilities: {
    wheneverDiscard6MorePowerDuringActionPhaseIntimidate: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "discard",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "discarded-card",
            relationship: {
              kind: "any",
            },
            filter: {
              numeric: [
                {
                  property: "power",
                  basis: "current",
                  comparison: { op: "gte", value: 6 },
                },
              ],
            },
          },
        },
        state: {
          type: "turn-player",
          who: "self",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "intimidate",
          target: "opponent",
        },
      },
      label: {
        name: "intimidate",
      },
    },
  },
});
