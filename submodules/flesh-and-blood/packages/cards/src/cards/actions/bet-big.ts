import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bet-big.generated.ts";

export const betBig = definePitchFamily(fabPitchFamilies["bet-big"], {
  keywords: [
    {
      name: "specialization",
      hero: "Betsy",
    },
  ],
  abilities: () => ({
    whenAttacksHeroMayWagerGoldMightVigorToken: {
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
            stake: "gold-might-and-vigor",
            with: {
              selector: "attack-target",
            },
          },
        },
      },
      label: {
        name: "wager",
      },
    },
  }),
});
export const { red: betBigRed } = betBig.cards;
