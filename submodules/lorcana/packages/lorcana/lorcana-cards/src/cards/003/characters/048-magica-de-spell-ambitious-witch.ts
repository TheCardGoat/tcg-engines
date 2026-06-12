import type { CharacterCard } from "@tcg/lorcana-types";
import { magicaDeSpellAmbitiousWitchI18n } from "./048-magica-de-spell-ambitious-witch.i18n";

export const magicaDeSpellAmbitiousWitch: CharacterCard = {
  id: "xwX",
  canonicalId: "ci_xwX",
  reprints: ["set3-048"],
  cardType: "character",
  name: "Magica De Spell",
  version: "Ambitious Witch",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "003",
  cardNumber: 48,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_1613e74208754e64b862c2a8b28add19",
    tcgPlayer: 538257,
  },
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  i18n: magicaDeSpellAmbitiousWitchI18n,
};
