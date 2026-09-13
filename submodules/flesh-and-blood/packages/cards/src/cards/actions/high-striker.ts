import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/high-striker.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const highStriker = definePitchFamily(fabPitchFamilies["high-striker"], {
  parameters: {
    red: { tokenCount: 6 },
    yellow: { tokenCount: 4 },
    blue: { tokenCount: 2 },
  },
  keywords: [goAgain],
  abilities: ({ tokenCount }) => ({
    createCopperOnHit: {
      type: "delayed-trigger",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: { kind: "player", player: "ability-controller" },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: { kind: "any" },
            filter: { typeBox: { subtypes: ["Attack"] } },
            bindAs: "it",
          },
        },
      },
      policy: { kind: "windowed", duration: "this-turn", matching: "first" },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "copper",
          controller: "controller",
          count: tokenCount,
        },
      },
    },
  }),
});

export const {
  red: highStrikerRed,
  yellow: highStrikerYellow,
  blue: highStrikerBlue,
} = highStriker.cards;
