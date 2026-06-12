import type { CharacterCard } from "@tcg/lorcana-types";
import { skippyEnergeticRabbitI18n } from "./087-skippy-energetic-rabbit.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const skippyEnergeticRabbit: CharacterCard = {
  id: "Wyz",
  canonicalId: "ci_Wyz",
  reprints: ["set3-087"],
  cardType: "character",
  name: "Skippy",
  version: "Energetic Rabbit",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "003",
  cardNumber: 87,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5aab3c53b77844b2921a280dfe53bdaa",
    tcgPlayer: 537933,
  },
  text: "Ward",
  classifications: ["Storyborn", "Ally"],
  abilities: [ward],
  i18n: skippyEnergeticRabbitI18n,
};
