import type { CharacterCard } from "@tcg/lorcana-types";
import { tukTukBigBuddyI18n } from "./184-tuk-tuk-big-buddy.i18n";

export const tukTukBigBuddy: CharacterCard = {
  id: "OzK",
  canonicalId: "ci_OzK",
  reprints: ["set6-184"],
  cardType: "character",
  name: "Tuk Tuk",
  version: "Big Buddy",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "006",
  cardNumber: 184,
  rarity: "uncommon",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_ccc37a7514f24045ad1e2c6cff286e6f",
    tcgPlayer: 593049,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: tukTukBigBuddyI18n,
};
