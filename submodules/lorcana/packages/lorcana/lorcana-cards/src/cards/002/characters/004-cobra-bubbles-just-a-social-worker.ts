import type { CharacterCard } from "@tcg/lorcana-types";
import { cobraBubblesJustASocialWorkerI18n } from "./004-cobra-bubbles-just-a-social-worker.i18n";

export const cobraBubblesJustASocialWorker: CharacterCard = {
  id: "2vT",
  canonicalId: "ci_2vT",
  reprints: ["set2-004"],
  cardType: "character",
  name: "Cobra Bubbles",
  version: "Just a Social Worker",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "002",
  cardNumber: 4,
  rarity: "rare",
  cost: 7,
  strength: 5,
  willpower: 9,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_ab2c56210cf647609962b1be64726001",
    tcgPlayer: 525118,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: cobraBubblesJustASocialWorkerI18n,
};
