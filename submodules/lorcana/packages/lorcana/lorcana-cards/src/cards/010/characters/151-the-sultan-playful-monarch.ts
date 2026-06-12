import type { CharacterCard } from "@tcg/lorcana-types";
import { theSultanPlayfulMonarchI18n } from "./151-the-sultan-playful-monarch.i18n";

export const theSultanPlayfulMonarch: CharacterCard = {
  id: "pU6",
  canonicalId: "ci_pU6",
  reprints: ["set10-151"],
  cardType: "character",
  name: "The Sultan",
  version: "Playful Monarch",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "010",
  cardNumber: 151,
  rarity: "rare",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 2,
  inkable: false,
  vanilla: true,
  externalIds: {
    lorcast: "crd_cf7781eb1d414b07bdc36ec8ee7acfcf",
    tcgPlayer: 659416,
  },
  classifications: ["Storyborn", "Ally", "King"],
  i18n: theSultanPlayfulMonarchI18n,
};
