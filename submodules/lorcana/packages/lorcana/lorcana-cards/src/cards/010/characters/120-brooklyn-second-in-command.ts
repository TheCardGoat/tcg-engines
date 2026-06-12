import type { CharacterCard } from "@tcg/lorcana-types";
import { brooklynSecondInCommandI18n } from "./120-brooklyn-second-in-command.i18n";
import { evasive } from "../../../helpers/abilities/evasive";
import { stoneByDay } from "../../../helpers/abilities/stoneByDay";

export const brooklynSecondInCommand: CharacterCard = {
  id: "jg3",
  canonicalId: "ci_jg3",
  reprints: ["set10-120"],
  cardType: "character",
  name: "Brooklyn",
  version: "Second in Command",
  inkType: ["ruby"],
  franchise: "Gargoyles",
  set: "010",
  cardNumber: 120,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_07d54e366c0548e6890cee09e3eaa032",
    tcgPlayer: 659241,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "STONE BY DAY",
      description: "If you have 3 or more cards in your hand, this character can't ready.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Gargoyle"],
  abilities: [evasive, stoneByDay],
  i18n: brooklynSecondInCommandI18n,
};
