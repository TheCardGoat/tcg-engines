import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/cut-to-the-chase.generated.ts";

export const cutToTheChase = definePitchFamily(fabPitchFamilies["cut-to-the-chase"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    contractBoost: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: {
          typeBox: { supertypes: ["Assassin"], types: ["Action"], subtypes: ["Attack"] },
          hasLabel: "contract",
        },
        count: 1,
      },
      duration: "this-turn",
      outputBinding: "it",
    },
    lookAtDeck: {
      type: "sequence",
      steps: [
        {
          type: "look",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "defending-hero",
            zones: ["deck"],
            position: "top",
            count: 1,
          },
          outputBinding: "it",
        },
        {
          type: "optional",
          effect: {
            type: "move-card",
            target: { selector: "binding", binding: "it" },
            to: { zone: "deck", position: "bottom" },
          },
        },
      ],
    },
  }),
});

export const {
  red: cutToTheChaseRed,
  yellow: cutToTheChaseYellow,
  blue: cutToTheChaseBlue,
} = cutToTheChase.cards;
