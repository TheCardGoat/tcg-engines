import type { ItemCard } from "@tcg/lorcana-types";
import { scepterOfArendelleI18n } from "./170-scepter-of-arendelle.i18n";

export const scepterOfArendelle: ItemCard = {
  id: "jt9",
  canonicalId: "ci_jt9",
  reprints: ["set1-170"],
  cardType: "item",
  name: "Scepter of Arendelle",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "001",
  cardNumber: 170,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e6bc27d53eb341549fc31d79de6ddb7f",
    tcgPlayer: 505963,
  },
  text: [
    {
      title: "COMMAND",
      description:
        "{E} — Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        duration: "this-turn",
        keyword: "Support",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "1j9-1",
      name: "COMMAND",
      text: "COMMAND {E} — Chosen character gains Support this turn.",
      type: "activated",
    },
  ],
  i18n: scepterOfArendelleI18n,
};
