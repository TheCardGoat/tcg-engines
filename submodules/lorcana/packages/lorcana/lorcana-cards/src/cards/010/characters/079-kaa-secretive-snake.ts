import type { CharacterCard } from "@tcg/lorcana-types";
import { evasive } from "../../../helpers/abilities/evasive";
import { kaaSecretiveSnakeI18n } from "./079-kaa-secretive-snake.i18n";

export const kaaSecretiveSnake: CharacterCard = {
  id: "I5f",
  canonicalId: "ci_qS6",
  reprints: ["set10-079"],
  cardType: "character",
  name: "Kaa",
  version: "Secretive Snake",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "010",
  cardNumber: 79,
  rarity: "uncommon",
  cost: 7,
  strength: 6,
  willpower: 7,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_f2d99b79354c466ebcaaeadcba69678e",
    tcgPlayer: 660191,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Villain"],
  abilities: [evasive],
  i18n: kaaSecretiveSnakeI18n,
};
