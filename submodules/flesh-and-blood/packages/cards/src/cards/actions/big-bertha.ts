import { boost } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/big-bertha.generated.ts";

export const bigBertha = definePitchFamily(fabPitchFamilies["big-bertha"], {
  keywords: [boost],
  abilities: () => ({
    onBanishAddCounter: {
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
              name: "Hyper Driver",
            },
            count: 1,
          },
        },
      },
    },
  }),
});

export const { red: bigBerthaRed, yellow: bigBerthaYellow, blue: bigBerthaBlue } = bigBertha.cards;
