import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/teklo-pounder.generated.ts";

export const tekloPounder = definePitchFamily(fabPitchFamilies["teklo-pounder"], {
  abilities: () => ({
    entersArenaWithNumber3SteamCountersOn: {
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
          count: 3,
          target: {
            selector: "self",
          },
        },
        duration: "while-in-arena",
      },
    },
    whenHasNoneDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "counter-removed",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "object",
          },
          remaining: 0,
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
    whenBoostAttackActionRemoveSteamCounterFromDoAttackGetsNumber2: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "boost",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "boosted-card",
            relationship: {
              kind: "any",
            },
            filter: attackActionFilter(),
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "if-you-do",
          effect: {
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
          then: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
          },
        },
      },
      limit: {
        count: 1,
        per: "turn",
      },
    },
  }),
});

export const { blue: tekloPounderBlue } = tekloPounder.cards;
