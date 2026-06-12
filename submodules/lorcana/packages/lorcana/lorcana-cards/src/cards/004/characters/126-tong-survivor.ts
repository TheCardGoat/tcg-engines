import type { CharacterCard } from "@tcg/lorcana-types";
import { tongSurvivorI18n } from "./126-tong-survivor.i18n";
import { reckless } from "../../../helpers/abilities/reckless";

export const tongSurvivor: CharacterCard = {
  id: "S7p",
  canonicalId: "ci_S7p",
  reprints: ["set4-126"],
  cardType: "character",
  name: "Tong",
  version: "Survivor",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  cardNumber: 126,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 6,
  lore: 0,
  inkable: false,
  externalIds: {
    lorcast: "crd_bf643690c507479592f493f27a9dfeb2",
    tcgPlayer: 550602,
  },
  text: "Reckless",
  classifications: ["Storyborn", "Ally"],
  abilities: [reckless],
  i18n: tongSurvivorI18n,
};
