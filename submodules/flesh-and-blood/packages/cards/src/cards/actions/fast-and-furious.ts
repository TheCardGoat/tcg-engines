import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fast-and-furious.generated.ts";

import { boost } from "../shared/keywords.ts";

export const fastAndFurious = definePitchFamily(fabPitchFamilies["fast-and-furious"], {
  keywords: [boost],
  abilities: () => ({
    ifVeCrankedTurnGets1: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "crank", player: "controller" },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
    whenIsBanishedFromBoostingPutSteamCounterItem: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "banish",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            filter: {
              hasStatus: "from-boosting",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "add-counter",
          counter: {
            kind: "named",
            name: "steam",
          },
          count: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Item"],
              },
              hasKeyword: "crank",
            },
            count: 1,
          },
        },
      },
    },
  }),
});
export const { red: fastAndFuriousRed } = fastAndFurious.cards;
