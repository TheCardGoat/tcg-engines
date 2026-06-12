import type { CharacterCard } from "@tcg/lorcana-types";
import { weeDingwallScrappyLadI18n } from "./176-wee-dingwall-scrappy-lad.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const weeDingwallScrappyLad: CharacterCard = {
  id: "jMG",
  canonicalId: "ci_jMG",
  reprints: ["set12-176"],
  cardType: "character",
  name: "Wee Dingwall",
  version: "Scrappy Lad",
  inkType: ["steel"],
  franchise: "Brave",
  set: "012",
  cardNumber: 176,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1fe95db14cce4c10b58cd4293dce1bb9",
  },
  text: "Challenger +2",
  classifications: ["Storyborn", "Ally"],
  abilities: [challenger(2)],
  i18n: weeDingwallScrappyLadI18n,
};
