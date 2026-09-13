import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/chum-friendly-first-mate.generated.ts";

import { wateryGrave } from "../shared/keywords.ts";

export const chumFriendlyFirstMate = definePitchFamily(
  fabPitchFamilies["chum-friendly-first-mate"],
  {
    keywords: [wateryGrave],
    abilities: () => ({
      actionAttack: {
        kind: "activated",
        abilityType: "attack",
        cost: {
          class: "effect",
          type: "tap-self",
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
      instantDiscardWateryGraveUntilEndTurnOpponentsMust: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "effect",
              type: "tap-self",
            },
            {
              class: "effect",
              type: "discard",
              count: 1,
              filter: {
                hasKeyword: "watery-grave",
              },
            },
          ],
        },
        effect: {
          type: "rule-modification",
          mode: "require",
          action: "be-attacked",
          subject: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    }),
  },
);
export const { yellow: chumFriendlyFirstMateYellow } = chumFriendlyFirstMate.cards;
