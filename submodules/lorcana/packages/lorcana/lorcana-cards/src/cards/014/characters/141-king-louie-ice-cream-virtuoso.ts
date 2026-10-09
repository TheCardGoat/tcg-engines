import type { CharacterCard } from "@tcg/lorcana-types";
import { support } from "../../../helpers/abilities";
import { kingLouieIceCreamVirtuosoI18n } from "./141-king-louie-ice-cream-virtuoso.i18n";

export const kingLouieIceCreamVirtuoso: CharacterCard = {
  id: "1Eu",
  canonicalId: "ci_1Eu",
  slug: "lorcana-ci_1Eu",
  printings: [
    {
      id: "set14-141",
      artId: "set14-141",
      setCode: "set14",
      collectorNumber: "141",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-141"],
  cardType: "character",
  name: "King Louie",
  version: "Ice Cream Virtuoso",
  inkType: ["sapphire"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 141,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  text: "Support",
  abilities: [support],
  classifications: ["Storyborn", "Ally", "King"],
  i18n: kingLouieIceCreamVirtuosoI18n,
};
