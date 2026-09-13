import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tick-tock-clock.generated.ts";
import { crank } from "../shared/keywords.ts";

export const tickTockClock = definePitchFamily(fabPitchFamilies["tick-tock-clock"], {
  keywords: [crank],
  abilities: () => ({
    entersArenaWithSteamCounter: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "enter-arena",
          subject: "self",
        },
        modification: {
          type: "add-counter",
          counter: {
            kind: "named",
            name: "steam",
          },
          count: 1,
          target: {
            selector: "self",
          },
        },
        duration: "while-in-arena",
      },
    },
    atStartTurnDestroyDealsNumber1DamageUnlessRemoveSteamCounterFrom: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
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
            type: "remove-counters",
            counter: {
              kind: "named",
              name: "steam",
            },
            count: 1,
            target: {
              selector: "self",
            },
          },
        },
      },
    },
    whenMechanologistAttackActionControlHitsHeroDestroyUpNumber2OtherItems: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
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
                supertypes: ["Mechanologist"],
                types: ["Action"],
                subtypes: ["Attack"],
              },
            },
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "sequence",
              steps: [
                {
                  type: "destroy",
                  target: {
                    selector: "self",
                  },
                },
                {
                  type: "destroy",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    zones: ["permanent"],
                    filter: {
                      typeBox: {
                        subtypes: ["Item"],
                      },
                    },
                    count: { type: "up-to", amount: 2 },
                  },
                  outputBinding: "them",
                },
              ],
            },
            {
              type: "deal-damage",
              damageType: "generic",
              amount: {
                type: "count",
                what: "destroyed-this-way",
                filter: {
                  typeBox: {
                    subtypes: ["Item"],
                  },
                },
              },
              target: {
                selector: "binding",
                binding: "them",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { red: tickTockClockRed } = tickTockClock.cards;
