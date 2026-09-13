import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/graven-cowl.generated.ts";

export const gravenCowl = defineCard(fabCardIdentitiesByCanonicalId["ctk8ztqbzqLTRGNrQkJwf"], {
  keywords: [bladeBreak],
  abilities: {
    whileIsGraveyardAtStartTurnMayDestroy2: {
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
              // Silver tokens are Token Items named Silver (not a subtype vocabulary).
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
      // GY-static: functions only while in graveyard (not while equipped).
      functionalZones: ["graveyard"],
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
