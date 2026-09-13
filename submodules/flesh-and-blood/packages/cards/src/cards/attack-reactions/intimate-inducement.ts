import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/intimate-inducement.generated.ts";

export const intimateInducement = definePitchFamily(fabPitchFamilies["intimate-inducement"], {
  parameters: pitchMap({ red: 4, yellow: 3, blue: 2 }),
  abilities: (amount) => ({
    attackBoost: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount: 1,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: attackActionFilter({
          or: [{ typeBox: { supertypes: ["Assassin"] } }, { typeBox: { supertypes: ["Mystic"] } }],
        }),
        count: 1,
      },
      duration: "this-turn",
      outputBinding: "it",
    },
    lookAndDefend: {
      type: "sequence",
      steps: [
        {
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
                count: amount,
              },
              outputBinding: "them",
            },
            {
              type: "choose-card",
              target: { selector: "binding", binding: "them" },
              outputBinding: "it",
            },
          ],
        },
        {
          type: "conditional",
          condition: { type: "binding-matches", binding: "it", filter: { color: ["blue"] } },
          then: {
            type: "modify-numeric",
            property: "defense",
            op: "set-base",
            amount: 0,
            target: { selector: "binding", binding: "it" },
            duration: "permanent",
          },
        },
        {
          type: "sequence",
          steps: [
            { type: "add-defending", target: { selector: "binding", binding: "it" } },
            {
              type: "move-card",
              target: { selector: "binding", binding: "them", exclude: "it" },
              to: { zone: "deck", position: "top" },
            },
          ],
        },
      ],
    },
  }),
});
export const {
  red: intimateInducementRed,
  yellow: intimateInducementYellow,
  blue: intimateInducementBlue,
} = intimateInducement.cards;
