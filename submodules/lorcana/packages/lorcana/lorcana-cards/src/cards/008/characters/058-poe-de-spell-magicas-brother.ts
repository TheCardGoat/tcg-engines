import type { CharacterCard } from "@tcg/lorcana-types";
import { poeDeSpellMagicasBrotherI18n } from "./058-poe-de-spell-magicas-brother.i18n";

export const poeDeSpellMagicasBrother: CharacterCard = {
  id: "J4k",
  canonicalId: "ci_J4k",
  reprints: ["set8-058"],
  cardType: "character",
  name: "Poe De Spell",
  version: "Magica's Brother",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "008",
  cardNumber: 58,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_75c10c12f3394d92a6e2d4806474dd62",
    tcgPlayer: 631389,
  },
  classifications: ["Storyborn", "Ally", "Sorcerer"],
  i18n: poeDeSpellMagicasBrotherI18n,
};
