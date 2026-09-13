import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { nextAttackPowerAndWager } from "../../authoring/wager-patterns.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/bluff-catcher.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const bluffCatcher = definePitchFamily(fabPitchFamilies["bluff-catcher"], {
  keywords: [goAgain],
  abilities: () => ({
    alternativeGoldCost: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "alternative-cost",
        cost: {
          class: "effect",
          type: "destroy",
          filter: { name: "Gold" },
        },
        optional: true,
      },
    },
    nextSword: {
      kind: "resolution",
      effect: nextAttackPowerAndWager({
        amount: 3,
        filter: { typeBox: { subtypes: ["Sword"] } },
        prize: {
          type: "modify-numeric",
          property: "intellect",
          op: "add",
          amount: 1,
          // Wager prizes resolve in a layer controlled by the winner, which
          // gives the persisted next-end-phase modifier a stable player.
          target: { selector: "controller" },
          duration: "during-own-next-end-phase",
        },
      }),
    },
  }),
});

export const { yellow: bluffCatcherYellow } = bluffCatcher.cards;
