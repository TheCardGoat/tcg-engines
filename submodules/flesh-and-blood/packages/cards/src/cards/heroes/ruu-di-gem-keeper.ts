import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/ruu-di-gem-keeper.generated.ts";

export const ruuDiGemKeeper = defineCard(fabCardIdentitiesByCanonicalId["hRMhmf8qkn6pR7TWQLqgb"], {
  abilities: {
    allowOnlyPsaGradedCardsInDeck: {
      // Deckbuilding / table policy: only PSA-graded cards in the deck.
      kind: "static",
      staticKind: "meta",
    },
    oncePerTurnActionResourceRevealTopDeckGradedGemMint10PutHandOtherwiseOpponentDrawGoAgain: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "action",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      layerKeywords: [goAgain],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                typeBox: {
                  traits: ["Gem Mint 10"],
                },
              },
            },
            then: {
              type: "move-card",
              target: {
                selector: "binding",
                binding: "it",
              },
              to: {
                zone: "hand",
              },
            },
            else: {
              // 1v1: the single opposing hero may draw.
              type: "optional",
              chooser: "opponent",
              effect: {
                type: "draw",
                count: 1,
                player: "opponent",
              },
            },
          },
        ],
      },
    },
  },
});
