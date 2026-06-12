import type { CharacterCard } from "@tcg/lorcana-types";
import { dukeWeaseltonSmalltimeCrookI18n } from "./146-duke-weaselton-small-time-crook.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const dukeWeaseltonSmalltimeCrook: CharacterCard = {
  id: "MRG",
  canonicalId: "ci_MRG",
  reprints: ["set2-146"],
  cardType: "character",
  name: "Duke Weaselton",
  version: "Small-Time Crook",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "002",
  cardNumber: 146,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_302ea1ce0fe94e5c97360498d05eee9d",
    tcgPlayer: 527763,
  },
  text: "Ward",
  classifications: ["Storyborn"],
  abilities: [ward],
  i18n: dukeWeaseltonSmalltimeCrookI18n,
};
