import type { CharacterCard } from "@tcg/lorcana-types";
import { fairyGodmotherHereToHelpI18n } from "./040-fairy-godmother-here-to-help.i18n";

export const fairyGodmotherHereToHelp: CharacterCard = {
  id: "yFu",
  canonicalId: "ci_yFu",
  reprints: ["set2-040"],
  cardType: "character",
  name: "Fairy Godmother",
  version: "Here to Help",
  inkType: ["amethyst"],
  franchise: "Cinderella",
  set: "002",
  cardNumber: 40,
  rarity: "uncommon",
  cost: 5,
  strength: 3,
  willpower: 7,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_28f00cdb65fe48deb2f97ff979670b4b",
    tcgPlayer: 527733,
  },
  classifications: ["Storyborn", "Ally", "Fairy"],
  i18n: fairyGodmotherHereToHelpI18n,
};
