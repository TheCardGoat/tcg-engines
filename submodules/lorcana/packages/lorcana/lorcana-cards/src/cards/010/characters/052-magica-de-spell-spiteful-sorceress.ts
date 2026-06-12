import type { CharacterCard } from "@tcg/lorcana-types";
import { magicaDeSpellSpitefulSorceressI18n } from "./052-magica-de-spell-spiteful-sorceress.i18n";

export const magicaDeSpellSpitefulSorceress: CharacterCard = {
  id: "f64",
  canonicalId: "ci_f64",
  reprints: ["set10-052"],
  cardType: "character",
  name: "Magica De Spell",
  version: "Spiteful Sorceress",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 52,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e209409eb89242b58b08601654b417dc",
    tcgPlayer: 659458,
  },
  text: [
    {
      title: "MYSTICAL MANIPULATION",
      description:
        "Whenever you put a card under one of your characters or locations, you may move 1 damage counter from chosen character to chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      effect: {
        steps: [
          {
            chooser: "CONTROLLER",
            effect: {
              type: "move-damage",
              amount: 1,
              from: "CHOSEN_CHARACTER",
              to: "CHOSEN_OPPOSING_CHARACTER",
            },
            type: "optional",
          },
        ],
        type: "sequence",
      },
      id: "f64-1",
      name: "MYSTICAL MANIPULATION",
      text: "MYSTICAL MANIPULATION Whenever you put a card under one of your characters or locations, you may move 1 damage counter from chosen character to chosen opposing character.",
      trigger: {
        event: "put-card-under",
        on: "YOUR_CHARACTERS_OR_LOCATIONS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: magicaDeSpellSpitefulSorceressI18n,
};
