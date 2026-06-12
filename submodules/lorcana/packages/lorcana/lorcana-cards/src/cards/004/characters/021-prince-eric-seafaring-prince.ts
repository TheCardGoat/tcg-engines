import type { CharacterCard } from "@tcg/lorcana-types";
import { princeEricSeafaringPrinceI18n } from "./021-prince-eric-seafaring-prince.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const princeEricSeafaringPrince: CharacterCard = {
  id: "U2e",
  canonicalId: "ci_U2e",
  reprints: ["set4-021"],
  cardType: "character",
  name: "Prince Eric",
  version: "Seafaring Prince",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 21,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_59c6d7badfc34295857ca0743b40ceca",
    tcgPlayer: 550560,
  },
  text: [
    {
      title: "Bodyguard",
      description:
        "(This character may enter play exerted. An opposing character who challenges one of your characters must choose a character with Bodyguard if able.)",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
  abilities: [bodyguard],
  i18n: princeEricSeafaringPrinceI18n,
};
