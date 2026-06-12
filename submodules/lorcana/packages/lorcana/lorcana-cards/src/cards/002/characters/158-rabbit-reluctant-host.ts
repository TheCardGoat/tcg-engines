import type { CharacterCard } from "@tcg/lorcana-types";
import { rabbitReluctantHostI18n } from "./158-rabbit-reluctant-host.i18n";

export const rabbitReluctantHost: CharacterCard = {
  id: "Y22",
  canonicalId: "ci_Y22",
  reprints: ["set2-158"],
  cardType: "character",
  name: "Rabbit",
  version: "Reluctant Host",
  inkType: ["sapphire"],
  franchise: "Winnie the Pooh",
  set: "002",
  cardNumber: 158,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_3d0ac2e2f0bb4f7bbb4831522a6cbd8b",
    tcgPlayer: 527767,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: rabbitReluctantHostI18n,
};
