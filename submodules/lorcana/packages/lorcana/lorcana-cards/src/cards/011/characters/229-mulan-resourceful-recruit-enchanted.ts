import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanResourcefulRecruit } from "./069-mulan-resourceful-recruit";

export const mulanResourcefulRecruitEnchanted: CharacterCard = {
  ...mulanResourcefulRecruit,
  id: "7Ks",
  reprints: ["set11-069"],
  set: "011",
  cardNumber: 229,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_5eb205c36e0b4038a8a46aa47dd50b0f",
    tcgPlayer: 677162,
  },
};
