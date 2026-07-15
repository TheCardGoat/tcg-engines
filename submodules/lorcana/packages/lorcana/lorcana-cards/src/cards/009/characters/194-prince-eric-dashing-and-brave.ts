import type { CharacterCard } from "@tcg/lorcana-types";
import { princeEricDashingAndBraveI18n } from "./194-prince-eric-dashing-and-brave.i18n";

import { challenger } from "../../../helpers/abilities/challenger";

export const princeEricDashingAndBrave: CharacterCard = {
  id: "0Em",
  canonicalId: "ci_Zf7",
  slug: "lorcana-ci_Zf7",
  printings: [
    {
      id: "set9-194",
      artId: "set9-194",
      setCode: "set9",
      collectorNumber: "194",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set1-187", "set9-194"],
  cardType: "character",
  name: "Prince Eric",
  version: "Dashing and Brave",
  inkType: ["steel"],
  franchise: "Little Mermaid",
  set: "009",
  cardNumber: 194,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_81a978c964b049f19747a98304b7f03d",
    tcgPlayer: "650127",
  },
  text: "Challenger +2 (While challenging, this character gets +2 {S}).",
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [challenger(2)],
  i18n: princeEricDashingAndBraveI18n,
};
