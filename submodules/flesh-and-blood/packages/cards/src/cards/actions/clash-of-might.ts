import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/clash-of-might.generated.ts";

export const clashOfMight = definePitchFamily(fabPitchFamilies["clash-of-might"], {
  supertypeSets: [["Brute"], ["Guardian"]],
  abilities: () => ({
    staticTriggeredDefendDefendClashClash: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "clash",
          with: {
            selector: "attacking-hero",
          },
          prize: {
            type: "create-token",
            token: "might",
            creator: "token-controller",
            controller: "winner",
          },
        },
      },
      label: {
        name: "clash",
      },
    },
  }),
});

export const {
  red: clashOfMightRed,
  yellow: clashOfMightYellow,
  blue: clashOfMightBlue,
} = clashOfMight.cards;
