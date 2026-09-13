import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/drink-em-under-the-table.generated.ts";

export const drinkEmUnderTheTable = definePitchFamily(
  fabPitchFamilies["drink-em-under-the-table"],
  {
    keywords: [
      {
        name: "specialization",
        hero: "Betsy",
      },
    ],
    abilities: () => ({
      whenAttacksHeroMayWagerThemWinnerDrawsOther: {
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
            target: {
              kind: "hero",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "wager",
              with: {
                selector: "attack-target",
              },
              prize: {
                type: "sequence",
                steps: [
                  {
                    type: "draw",
                    count: 1,
                    player: "winner",
                  },
                  {
                    type: "discard",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "loser",
                      zones: ["hand"],
                      count: 1,
                    },
                  },
                ],
              },
            },
          },
        },
        label: {
          name: "wager",
        },
      },
    }),
  },
);
export const { red: drinkEmUnderTheTableRed } = drinkEmUnderTheTable.cards;
