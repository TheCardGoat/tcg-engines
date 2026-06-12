import type { CharacterCard } from "@tcg/lorcana-types";
import { magicaDeSpellThievingSorceressI18n } from "./050-magica-de-spell-thieving-sorceress.i18n";

export const magicaDeSpellThievingSorceress: CharacterCard = {
  id: "iq5",
  canonicalId: "ci_iq5",
  reprints: ["set3-050"],
  cardType: "character",
  name: "Magica De Spell",
  version: "Thieving Sorceress",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "003",
  cardNumber: 50,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_177102be31464591b1637a5b9b2b5aca",
    tcgPlayer: 538255,
  },
  text: [
    {
      title: "TELEKINESIS",
      description:
        "{E} — Return chosen item with cost equal to or less than this character's {S} to its player's hand.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      type: "activated",
      id: "iq5-1",
      name: "TELEKINESIS",
      text: "TELEKINESIS {E} — Return chosen item with cost equal to or less than this character's {S} to its player's hand.",
      cost: {
        exert: true,
      },
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["item"],
          filter: [
            {
              type: "cost-comparison",
              comparison: "less-or-equal",
              value: 3,
            },
          ],
        },
      },
    },
  ],
  i18n: magicaDeSpellThievingSorceressI18n,
};
