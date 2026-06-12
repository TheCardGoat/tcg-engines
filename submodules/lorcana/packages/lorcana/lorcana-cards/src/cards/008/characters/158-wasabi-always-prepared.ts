import type { CharacterCard } from "@tcg/lorcana-types";
import { wasabiAlwaysPreparedI18n } from "./158-wasabi-always-prepared.i18n";
import { support } from "../../../helpers/abilities/support";

export const wasabiAlwaysPrepared: CharacterCard = {
  id: "PYV",
  canonicalId: "ci_PYV",
  reprints: ["set8-158"],
  cardType: "character",
  name: "Wasabi",
  version: "Always Prepared",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "008",
  cardNumber: 158,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_d23689ec2d064f2c957ff6751e0a3c38",
    tcgPlayer: 631456,
  },
  text: "Support",
  classifications: ["Storyborn", "Hero", "Inventor"],
  abilities: [support],
  i18n: wasabiAlwaysPreparedI18n,
};
