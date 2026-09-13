import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/crumble-to-eternity.generated.ts";

import { dominate } from "../shared/keywords.ts";

export const crumbleToEternity = definePitchFamily(fabPitchFamilies["crumble-to-eternity"], {
  keywords: [
    {
      name: "specialization",
      hero: "Jarl",
    },
  ],
  abilities: () => ({
    whenEntersArenaMayPut1CounterEquipment: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
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
              kind: "numeric",
              value: -1,
              property: "defense",
            },
            count: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                },
              },
              count: 1,
            },
          },
        },
      },
    },
    atBeginningActionPhaseDestroyThenNextAttackTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
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
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: dominate,
              },
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    subtypes: ["Attack"],
                  },
                },
              },
            },
          ],
        },
      },
    },
  }),
});
export const { blue: crumbleToEternityBlue } = crumbleToEternity.cards;
