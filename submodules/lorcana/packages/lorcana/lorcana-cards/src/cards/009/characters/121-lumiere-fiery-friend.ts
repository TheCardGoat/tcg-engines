import type { CharacterCard } from "@tcg/lorcana-types";
import { lumiereFieryFriendI18n } from "./121-lumiere-fiery-friend.i18n";

export const lumiereFieryFriend: CharacterCard = {
  id: "ZVW",
  canonicalId: "ci_fE7",
  slug: "lorcana-ci_fE7",
  printings: [
    {
      id: "set9-121",
      artId: "set9-121",
      setCode: "set9",
      collectorNumber: "121",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set4-113", "set9-121"],
  cardType: "character",
  name: "Lumiere",
  version: "Fiery Friend",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "009",
  cardNumber: 121,
  rarity: "rare",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_724fef83bb594bbf883b6fc1bcc6d4e2",
    tcgPlayer: "650056",
  },
  text: [
    {
      title: "FERVENT ADDRESS",
      description: "Your other characters get +1 {S}.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
        },
        type: "modify-stat",
      },
      id: "xyr-1",
      name: "FERVENT ADDRESS",
      text: "FERVENT ADDRESS Your other characters get +1 {S}.",
      type: "static",
    },
  ],
  i18n: lumiereFieryFriendI18n,
};
