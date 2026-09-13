import { dominate, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/azalea.generated.ts";

export const azalea = defineCard(fabCardIdentitiesByCanonicalId["Fc8mPQBjrNq6Fg9LW9RLc"], {
  abilities: {
    oncePerTurnAction0PutArsenalBottomDeckPutTopDeckFaceUpArsenalArrowGainsDominateEndTurnGoAgain: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "action",
      cost: {
        class: "asset",
        type: "resources",
        amount: 0,
      },
      layerKeywords: [goAgain],
      effect: {
        // Printed: bottom arsenal → (if you do) top of deck face-up into arsenal →
        // if that card is an Arrow, it gains dominate until end of turn.
        type: "if-you-do",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["arsenal"],
            count: 1,
          },
          to: {
            zone: "deck",
            position: "bottom",
          },
        },
        then: {
          type: "sequence",
          steps: [
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              to: {
                zone: "arsenal",
                visibility: "face-up",
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
                    subtypes: ["Arrow"],
                  },
                },
              },
              then: {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: dominate,
                },
                target: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "this-turn",
              },
            },
          ],
        },
      },
    },
  },
});
