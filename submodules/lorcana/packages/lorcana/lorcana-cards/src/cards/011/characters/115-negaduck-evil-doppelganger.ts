import type { CharacterCard } from "@tcg/lorcana-types";
import { negaduckEvilDoppelgangerI18n } from "./115-negaduck-evil-doppelganger.i18n";

export const negaduckEvilDoppelganger: CharacterCard = {
  id: "PG5",
  canonicalId: "ci_PG5",
  reprints: ["set11-115"],
  cardType: "character",
  name: "Negaduck",
  version: "Evil Doppelganger",
  inkType: ["ruby"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 115,
  rarity: "common",
  cost: 2,
  strength: 4,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_c7e5c7bde26548919587cb50662ebef3",
    tcgPlayer: 675501,
  },
  classifications: ["Storyborn", "Super", "Villain"],
  i18n: negaduckEvilDoppelgangerI18n,
};
