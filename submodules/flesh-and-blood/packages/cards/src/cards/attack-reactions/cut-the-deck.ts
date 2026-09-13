import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/cut-the-deck.generated.ts";

export const cutTheDeck = definePitchFamily(fabPitchFamilies["cut-the-deck"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    boostAndCut: {
      type: "sequence",
      steps: [
        {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: { typeBox: { supertypes: ["Warrior"] } },
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
        {
          type: "conditional",
          condition: {
            type: "binding-matches",
            binding: "it",
            filter: { hasStatus: "defended-by-attack-action" },
          },
          then: {
            type: "sequence",
            steps: [
              { type: "draw", count: 1, player: "controller" },
              {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand", "arsenal"],
                  count: 1,
                },
                to: { zone: "deck", position: "bottom" },
              },
            ],
          },
        },
      ],
    },
  }),
});

export const {
  red: cutTheDeckRed,
  yellow: cutTheDeckYellow,
  blue: cutTheDeckBlue,
} = cutTheDeck.cards;
