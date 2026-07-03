import type { CharacterCard } from "@tcg/lorcana-types";
import { maleficentUninvitedI18n } from "./151-maleficent-uninvited.i18n";

export const maleficentUninvited: CharacterCard = {
  id: "GaM",
  canonicalId: "ci_6sE",
  slug: "lorcana-ci_6sE",
  printings: [
    {
      id: "set1-151",
      artId: "set1-151",
      setCode: "set1",
      collectorNumber: "151",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set1-p1-022", "set1-151"],
  cardType: "character",
  name: "Maleficent",
  version: "Uninvited",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "001",
  cardNumber: 151,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_7d72a31f03964ae2b79110b788039b73",
    tcgPlayer: "505949",
  },
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  i18n: maleficentUninvitedI18n,
};
