import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/clash-of-vigor.generated.ts";

export const clashOfVigor = definePitchFamily(fabPitchFamilies["clash-of-vigor"], {
  supertypeSets: [["Guardian"], ["Warrior"]],
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
            token: "vigor",
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
  red: clashOfVigorRed,
  yellow: clashOfVigorYellow,
  blue: clashOfVigorBlue,
} = clashOfVigor.cards;
