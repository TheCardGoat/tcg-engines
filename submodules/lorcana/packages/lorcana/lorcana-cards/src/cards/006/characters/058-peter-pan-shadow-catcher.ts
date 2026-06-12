import type { CharacterCard } from "@tcg/lorcana-types";
import { peterPanShadowCatcherI18n } from "./058-peter-pan-shadow-catcher.i18n";

export const peterPanShadowCatcher: CharacterCard = {
  id: "3qg",
  canonicalId: "ci_3qg",
  reprints: ["set6-058"],
  cardType: "character",
  name: "Peter Pan",
  version: "Shadow Catcher",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "006",
  cardNumber: 58,
  rarity: "uncommon",
  cost: 4,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_421a2dfb847b406fb91556a8ee090423",
    tcgPlayer: 591995,
  },
  text: [
    {
      title: "GOTCHA!",
      description:
        "During your turn, whenever a card is put into your inkwell, exert chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        type: "exert",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
      id: "3qg-1",
      name: "GOTCHA!",
      text: "GOTCHA! During your turn, whenever a card is put into your inkwell, exert chosen opposing character.",
      condition: {
        type: "your-turn",
      },
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: peterPanShadowCatcherI18n,
};
