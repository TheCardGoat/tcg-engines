import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/emperor-dracai-of-aesir.generated.ts";

export const emperorDracaiOfAesir = defineCard(
  fabCardIdentitiesByCanonicalId["QgqNQGbtcF6NNBMDbDMhh"],
  {
    abilities: {
      allowOnlyRedCardsInDeck: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "rule-modification",
          mode: "restrict",
          action: "have-in-deck",
          subject: {
            color: ["red"],
          },
          duration: "permanent",
        },
      },
      actionResourceResourceResourceSearchDeckCommandConquerAttackThenShuffle: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "asset",
          type: "resources",
          amount: 3,
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "sequence",
              steps: [
                {
                  type: "search",
                  zones: ["deck"],
                  filter: {
                    name: "Command And Conquer",
                  },
                  mayFail: true,
                  to: {
                    zone: "permanent",
                  },
                  outputBinding: "it",
                },
                {
                  type: "attack-with",
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                },
              ],
            },
            {
              type: "shuffle",
              zone: "deck",
            },
          ],
        },
      },
    },
  },
);
