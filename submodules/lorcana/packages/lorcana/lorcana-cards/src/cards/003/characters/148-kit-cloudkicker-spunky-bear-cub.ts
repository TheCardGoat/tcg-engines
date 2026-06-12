import type { CharacterCard } from "@tcg/lorcana-types";
import { kitCloudkickerSpunkyBearCubI18n } from "./148-kit-cloudkicker-spunky-bear-cub.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const kitCloudkickerSpunkyBearCub: CharacterCard = {
  id: "0ke",
  canonicalId: "ci_0ke",
  reprints: ["set3-148"],
  cardType: "character",
  name: "Kit Cloudkicker",
  version: "Spunky Bear Cub",
  inkType: ["sapphire"],
  franchise: "Talespin",
  set: "003",
  cardNumber: 148,
  rarity: "common",
  cost: 1,
  strength: 0,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9a81433a0c2c4944a0af1b1724213f40",
    tcgPlayer: 539098,
  },
  text: "Ward",
  classifications: ["Storyborn", "Ally"],
  abilities: [ward],
  i18n: kitCloudkickerSpunkyBearCubI18n,
};
