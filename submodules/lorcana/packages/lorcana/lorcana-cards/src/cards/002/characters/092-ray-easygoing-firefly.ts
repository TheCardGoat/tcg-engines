import type { CharacterCard } from "@tcg/lorcana-types";
import { rayEasygoingFireflyI18n } from "./092-ray-easygoing-firefly.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const rayEasygoingFirefly: CharacterCard = {
  id: "Jkc",
  canonicalId: "ci_Jkc",
  reprints: ["set2-092"],
  cardType: "character",
  name: "Ray",
  version: "Easygoing Firefly",
  inkType: ["emerald"],
  franchise: "Princess and the Frog",
  set: "002",
  cardNumber: 92,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_b7cb9265f8b84f77afabe12e61219153",
    tcgPlayer: 527250,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive],
  i18n: rayEasygoingFireflyI18n,
};
