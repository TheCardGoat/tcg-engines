import type { CharacterCard } from "@tcg/lorcana-types";
import { louieChillNephewI18n } from "./149-louie-chill-nephew.i18n";
import { support } from "../../../helpers/abilities/support";

export const louieChillNephew: CharacterCard = {
  id: "ph4",
  canonicalId: "ci_VS6",
  reprints: ["set3-149", "set9-140"],
  cardType: "character",
  name: "Louie",
  version: "Chill Nephew",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "003",
  cardNumber: 149,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f81fa2c1489a44eab54bd8e0528cc202",
    tcgPlayer: 650075,
  },
  text: "Support",
  classifications: ["Dreamborn", "Ally"],
  abilities: [support],
  i18n: louieChillNephewI18n,
};
