import type { CharacterCard } from "@tcg/lorcana-types";
import { captainHookUnderhandedI18n } from "./071-captain-hook-underhanded.i18n";

export const captainHookUnderhanded: CharacterCard = {
  id: "2U6",
  canonicalId: "ci_2U6",
  reprints: ["set6-071"],
  cardType: "character",
  name: "Captain Hook",
  version: "Underhanded",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "006",
  cardNumber: 71,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_44fceab89d3a4b40bd343c2c84a5cca3",
    tcgPlayer: 583852,
  },
  text: [
    {
      title: "INSPIRES DREAD",
      description: "While this character is exerted, opposing Pirate characters can't quest.",
    },
    {
      title: "UPPER HAND",
      description: "Whenever this character is challenged, draw a card.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Pirate", "Captain"],
  abilities: [
    {
      condition: {
        type: "exerted",
      },
      effect: {
        restriction: "cant-quest",
        target: {
          selector: "all",
          zones: ["play"],
          owner: "opponent",
          count: "all",
          cardTypes: ["character"],
          filters: [{ type: "has-classification", classification: "Pirate" }],
        },
        type: "restriction",
      },
      id: "i7x-1",
      name: "INSPIRES DREAD",
      text: "INSPIRES DREAD While this character is exerted, opposing Pirate characters can't quest.",
      type: "static",
    },
    {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "i7x-2",
      name: "UPPER HAND",
      text: "UPPER HAND Whenever this character is challenged, draw a card.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: captainHookUnderhandedI18n,
};
