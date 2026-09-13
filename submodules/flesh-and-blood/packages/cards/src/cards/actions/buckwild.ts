import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/buckwild.generated.ts";

import { goAgain } from "../shared/keywords.ts";

/** Model notes (hand-authored): go again only if pitch zone has 6+{p}; not a base keyword. */
export const buckwild = definePitchFamily(fabPitchFamilies["buckwild"], {
  abilities: () => ({
    staticTriggeredPlayPlayGrantProperty: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "play",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "pitch-zone-has",
          filter: {
            power: {
              op: "gte",
              value: 6,
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const { red: buckwildRed, yellow: buckwildYellow, blue: buckwildBlue } = buckwild.cards;
