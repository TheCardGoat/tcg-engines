import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fix-the-match.generated.ts";

export const fixTheMatch = definePitchFamily(fabPitchFamilies["fix-the-match"], {
  abilities: () => ({
    whenAttacksSearchDeckThenShufflePutTop: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "search",
              zones: ["deck"],
              filter: {},
              mayFail: true,
              to: {
                zone: "deck",
                position: "top",
              },
            },
            {
              type: "shuffle",
              zone: "deck",
            },
          ],
        },
      },
      label: {
        name: "clash",
      },
    },
    wheneverDefendsClashDefendingHeroWinnerCreatesMightToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
          target: {
            kind: "any",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "clash",
          with: {
            selector: "defending-hero",
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
export const { yellow: fixTheMatchYellow } = fixTheMatch.cards;
