import type { CharacterCard } from "@tcg/lorcana-types";
import { lyleTiberiusRourkeCrystallizedMercenaryI18n } from "./140-lyle-tiberius-rourke-crystallized-mercenary.i18n";

export const lyleTiberiusRourkeCrystallizedMercenary: CharacterCard = {
  id: "AnC",
  canonicalId: "ci_AnC",
  reprints: ["set7-140"],
  cardType: "character",
  name: "Lyle Tiberius Rourke",
  version: "Crystallized Mercenary",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "007",
  cardNumber: 140,
  rarity: "rare",
  cost: 8,
  strength: 6,
  willpower: 4,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_4ba6dbe9f2674bb880ec26795a4663c6",
    tcgPlayer: 619485,
  },
  text: [
    {
      title: "EXPLOSIVE",
      description:
        "Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        amount: 2,
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "any",
          selector: "all",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "1ug-1",
      name: "EXPLOSIVE",
      text: "EXPLOSIVE Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        timing: "whenever",
        restrictions: [{ type: "once-per-turn" }, { type: "during-turn", whose: "your" }],
      },
      type: "triggered",
    },
  ],
  i18n: lyleTiberiusRourkeCrystallizedMercenaryI18n,
};
