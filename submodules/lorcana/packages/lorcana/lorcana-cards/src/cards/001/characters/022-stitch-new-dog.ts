import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchNewDogI18n } from "./022-stitch-new-dog.i18n";

export const stitchNewDog: CharacterCard = {
  id: "Weh",
  canonicalId: "ci_Weh",
  reprints: ["set1-022"],
  cardType: "character",
  name: "Stitch",
  version: "New Dog",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "001",
  cardNumber: 22,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_a46be9bd3971477695ee84d0f25ff88d",
    tcgPlayer: 493499,
  },
  classifications: ["Storyborn", "Hero", "Alien"],
  i18n: stitchNewDogI18n,
};
