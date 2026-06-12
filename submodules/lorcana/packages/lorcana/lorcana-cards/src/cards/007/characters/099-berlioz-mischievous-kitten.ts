import type { CharacterCard } from "@tcg/lorcana-types";
import { berliozMischievousKittenI18n } from "./099-berlioz-mischievous-kitten.i18n";

export const berliozMischievousKitten: CharacterCard = {
  id: "J54",
  canonicalId: "ci_J54",
  reprints: ["set7-099"],
  cardType: "character",
  name: "Berlioz",
  version: "Mischievous Kitten",
  inkType: ["emerald"],
  franchise: "Aristocats",
  set: "007",
  cardNumber: 99,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_8a7ba766a9614ec2b66cd1cb1dc10a3e",
    tcgPlayer: 618148,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: berliozMischievousKittenI18n,
};
