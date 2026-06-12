import type { CharacterCard } from "@tcg/lorcana-types";
import { rajahDevotedProtectorI18n } from "./006-rajah-devoted-protector.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const rajahDevotedProtector: CharacterCard = {
  id: "hab",
  canonicalId: "ci_hab",
  reprints: ["set10-006"],
  cardType: "character",
  name: "Rajah",
  version: "Devoted Protector",
  inkType: ["amber"],
  franchise: "Aladdin",
  set: "010",
  cardNumber: 6,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_aa590039809f41f6b67c833b1fba999c",
    tcgPlayer: 659444,
  },
  text: "Bodyguard",
  classifications: ["Storyborn", "Ally"],
  abilities: [bodyguard],
  i18n: rajahDevotedProtectorI18n,
};
