import type { CharacterCard } from "@tcg/lorcana-types";
import { penumbraMoonAlienI18n } from "./084-penumbra-moon-alien.i18n";

export const penumbraMoonAlien: CharacterCard = {
  id: "tak",
  canonicalId: "ci_tak",
  reprints: ["set10-084"],
  cardType: "character",
  name: "Penumbra",
  version: "Moon Alien",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 84,
  rarity: "rare",
  cost: 5,
  strength: 7,
  willpower: 6,
  lore: 2,
  inkable: false,
  vanilla: true,
  externalIds: {
    lorcast: "crd_b3484a7d91f949b485eb269bcb2d9975",
    tcgPlayer: 660366,
  },
  classifications: ["Storyborn", "Alien"],
  i18n: penumbraMoonAlienI18n,
};
