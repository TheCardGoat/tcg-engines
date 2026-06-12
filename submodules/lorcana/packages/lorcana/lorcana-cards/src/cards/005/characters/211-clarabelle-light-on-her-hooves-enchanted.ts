import type { CharacterCard } from "@tcg/lorcana-types";
import { clarabelleLightOnHerHooves } from "./084-clarabelle-light-on-her-hooves";
import { shift } from "../../../helpers/abilities/shift";

export const clarabelleLightOnHerHoovesEnchanted: CharacterCard = {
  ...clarabelleLightOnHerHooves,
  id: "QGJ",
  reprints: ["set5-084"],
  set: "005",
  cardNumber: 211,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_8dbe711cfb4541309eb32cf37fe48997",
    tcgPlayer: 561991,
  },
};
