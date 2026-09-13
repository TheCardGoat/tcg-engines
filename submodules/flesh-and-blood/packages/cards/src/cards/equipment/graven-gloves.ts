import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/graven-gloves.generated.ts";

export const gravenGloves = defineCard(fabCardIdentitiesByCanonicalId["tbhqDHnRMTh9JtkGdpwpG"], {
  keywords: [bladeBreak],
  abilities: {
    atStartTurnMayDestroy2SilverControlIf: {
      kind: "static",
      staticKind: "triggered",
      functionalZones: ["graveyard"],
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
    },
    whenIsEquippedFromAnywhereOtherThanGraveyardPut: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "equip",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
          excludeFrom: ["graveyard"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "add-counter",
          counter: {
            kind: "numeric",
            value: -1,
            property: "defense",
          },
          count: 1,
          target: {
            selector: "self",
          },
        },
      },
    },
  },
});
