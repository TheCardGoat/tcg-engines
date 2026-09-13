import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/mentors/minerva-themis.generated.ts";

export const minervaThemis = defineCard(fabCardIdentitiesByCanonicalId.RkrCbfz9npggPKrTHFN8z, {
  abilities: {
    revealAtStart: {
      kind: "static",
      staticKind: "triggered",
      functionalZones: ["arsenal"],
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
          status: "face-down-in-arsenal",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "turn-face-up",
            target: {
              selector: "self",
            },
          },
        },
      },
    },
    empowerOneHandedWeapons: {
      kind: "static",
      staticKind: "while",
      functionalZones: ["arsenal"],
      condition: {
        type: "has-status",
        status: "face-up-in-arsenal",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent", "combat-chain"],
          filter: {
            typeBox: {
              types: ["Weapon"],
              subtypes: ["1H"],
            },
          },
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
    teachWeaponHits: {
      kind: "static",
      staticKind: "triggered",
      functionalZones: ["arsenal"],
      trigger: {
        kind: "event-and-state",
        event: {
          name: "hit",
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
              typeBox: {
                types: ["Weapon"],
              },
            },
            bindAs: "it",
          },
        },
        state: {
          type: "has-status",
          status: "face-up-in-arsenal",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "add-counter",
              counter: {
                kind: "named",
                name: "lesson",
              },
              count: 1,
              // Printed: "put a lesson counter on Minerva" — the counter
              // accumulates on the mentor herself, not on the weapon.
              target: {
                selector: "self",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "has-counter",
                counter: {
                  kind: "named",
                  name: "lesson",
                },
                target: {
                  selector: "self",
                },
                comparison: {
                  op: "gte",
                  value: 3,
                },
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "banish",
                    target: {
                      selector: "self",
                    },
                  },
                  {
                    type: "search",
                    zones: ["deck"],
                    filter: {
                      moniker: "Specialization",
                    },
                    mayFail: true,
                    to: {
                      zone: "arsenal",
                      visibility: "face-up",
                    },
                  },
                  {
                    type: "shuffle",
                    zone: "deck",
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
});
