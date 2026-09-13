import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/looming-doom.generated.ts";

export const loomingDoom = definePitchFamily(fabPitchFamilies["looming-doom"], {
  abilities: () => ({
    loomingDoomEntersArenaDestroyAllRunechantsPutManyDoomCountersLoomingDoom: {
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
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  name: "Runechant",
                },
                count: {
                  type: "all",
                },
              },
            },
            {
              type: "add-counter",
              counter: {
                kind: "named",
                name: "doom",
              },
              count: {
                type: "count",
                what: "destroyed-this-way",
              },
              target: {
                selector: "self",
              },
            },
          ],
        },
      },
    },
    beginningEndPhaseRemoveDoomCounterLoomingDoomDeal2ArcaneDamageAnyTargetOtherwiseDestroyLoomingDoom:
      {
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
            type: "unless",
            effect: {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            escape: {
              type: "if-you-do",
              effect: {
                type: "remove-counters",
                counter: {
                  kind: "named",
                  name: "doom",
                },
                count: 1,
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent"],
                  filter: {
                    name: "Looming Doom",
                  },
                  count: 1,
                },
              },
              then: {
                type: "deal-damage",
                damageType: "arcane",
                amount: 2,
                target: {
                  selector: "object",
                  declared: "on-stack",
                  zones: ["hero", "permanent"],
                  count: 1,
                },
              },
            },
          },
        },
      },
  }),
});

export const { blue: loomingDoomBlue } = loomingDoom.cards;
