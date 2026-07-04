import type { CharacterCard } from "@tcg/lorcana-types";
import { maleficentUninvitedP1I18n } from "./p1-022-maleficent-uninvited.i18n";

export const maleficentUninvitedP1: CharacterCard = {
  id: "FIn",
  canonicalId: "ci_6sE",
  slug: "lorcana-ci_6sE",
  printings: [
    {
      id: "set1-p1-022",
      artId: "set1-p1-022",
      setCode: "set1",
      collectorNumber: "22",
      rarity: "special",
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
  cardNumber: 22,
  rarity: "special",
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
  i18n: maleficentUninvitedP1I18n,
};
