import type { CharacterCard } from "@tcg/lorcana-types";
import { edgarBalthazarAmbitiousButlerI18n } from "./146-edgar-balthazar-ambitious-butler.i18n";

export const edgarBalthazarAmbitiousButler: CharacterCard = {
  id: "24D",
  canonicalId: "ci_24D",
  reprints: ["set7-146"],
  cardType: "character",
  name: "Edgar Balthazar",
  version: "Ambitious Butler",
  inkType: ["ruby"],
  franchise: "Aristocats",
  set: "007",
  cardNumber: 146,
  rarity: "common",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_4496d449edb34ea2b6994004e5d30c84",
    tcgPlayer: 618154,
  },
  classifications: ["Storyborn", "Villain"],
  i18n: edgarBalthazarAmbitiousButlerI18n,
};
