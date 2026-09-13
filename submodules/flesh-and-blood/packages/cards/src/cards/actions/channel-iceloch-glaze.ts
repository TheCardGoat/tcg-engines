import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/channel-iceloch-glaze.generated.ts";

import { goAgain } from "../shared/keywords.ts";

/** Model notes (hand-authored): arsenal freeze is a static while they control Frostbite/frozen, not a one-shot resolution. */
export const channelIcelochGlaze = definePitchFamily(fabPitchFamilies["channel-iceloch-glaze"], {
  keywords: [goAgain],
  abilities: () => ({
    opponentsArsenalsAreFrozenWhileTheyControlFrostbiteFrozen: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "zone-count",
        zone: "permanent",
        player: "opponent",
        filter: {
          or: [
            {
              name: "Frostbite",
            },
            {
              hasStatus: "frozen",
            },
          ],
        },
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      effect: {
        type: "freeze",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["arsenal"],
          count: {
            type: "all",
          },
        },
        duration: "while-condition",
      },
    },
    atBeginningEndPhasePutFlowCounterThenDestroy: {
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
          type: "sequence",
          steps: [
            {
              type: "add-counter",
              counter: {
                kind: "named",
                name: "flow",
              },
              count: 1,
              target: {
                selector: "self",
              },
            },
            {
              type: "unless",
              effect: {
                type: "destroy",
                target: {
                  selector: "self",
                },
              },
              escape: {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["pitch"],
                  filter: {
                    typeBox: {
                      supertypes: ["Ice"],
                    },
                  },
                  count: {
                    type: "count",
                    what: "counters-on-source",
                  },
                },
                to: {
                  zone: "deck",
                  position: "bottom",
                },
              },
            },
          ],
        },
      },
      label: {
        name: "channel-ice",
      },
    },
  }),
});
export const { blue: channelIcelochGlazeBlue } = channelIcelochGlaze.cards;
