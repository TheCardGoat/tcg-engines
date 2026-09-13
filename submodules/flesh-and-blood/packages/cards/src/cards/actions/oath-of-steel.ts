import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/oath-of-steel.generated.ts";

export const oathOfSteel = definePitchFamily(fabPitchFamilies["oath-of-steel"], {
  keywords: [goAgain],
  abilities: () => ({
    wheneverAttackWeaponTurnPut1PowerCounterBeginningEndPhaseRemoveAll1PowerCountersWeapons: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "attack",
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
            },
            policy: {
              kind: "windowed",
              duration: "this-turn",
              matching: "every",
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "add-counter",
                counter: {
                  kind: "numeric",
                  value: 1,
                  property: "power",
                },
                count: 1,
                target: {
                  selector: "binding",
                  binding: "it",
                },
              },
            },
          },
          {
            type: "delayed-trigger",
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
            policy: {
              kind: "windowed",
              duration: "this-turn",
              matching: "first",
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "remove-all-counters",
                counter: {
                  kind: "numeric",
                  value: 1,
                  property: "power",
                },
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["weapon"],
                  filter: {
                    typeBox: {
                      types: ["Weapon"],
                    },
                  },
                  count: {
                    type: "all",
                  },
                },
              },
            },
          },
        ],
      },
    },
  }),
});

export const { red: oathOfSteelRed } = oathOfSteel.cards;
