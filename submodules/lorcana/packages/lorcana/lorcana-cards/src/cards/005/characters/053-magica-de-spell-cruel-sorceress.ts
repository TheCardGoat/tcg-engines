import type { CharacterCard } from "@tcg/lorcana-types";
import { magicaDeSpellCruelSorceressI18n } from "./053-magica-de-spell-cruel-sorceress.i18n";

export const magicaDeSpellCruelSorceress: CharacterCard = {
  id: "8Yk",
  canonicalId: "ci_8Yk",
  reprints: ["set5-053"],
  cardType: "character",
  name: "Magica De Spell",
  version: "Cruel Sorceress",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "005",
  cardNumber: 53,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5a958c7371a3467fbb486adb3bd370ce",
    tcgPlayer: 560549,
  },
  text: [
    {
      title: "PLAYING WITH POWER",
      description:
        "During opponents' turns, if an effect would cause you to discard one or more cards from your hand, you don't discard.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "8Yk-1",
      name: "PLAYING WITH POWER",
      type: "replacement",
      replaces: "discard",
      condition: {
        type: "during-turn",
        whose: "opponent",
      },
      replacement: "prevent",
      text: "PLAYING WITH POWER - During opponents' turns, if an effect would cause you to discard one or more cards from your hand, you don't discard.",
    },
  ],
  i18n: magicaDeSpellCruelSorceressI18n,
};
