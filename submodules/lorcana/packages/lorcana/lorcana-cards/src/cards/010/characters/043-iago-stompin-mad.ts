import type { CharacterCard } from "@tcg/lorcana-types";
import { challenger } from "../../../helpers/abilities/challenger";
import { iagoStompinMadI18n } from "./043-iago-stompin-mad.i18n";

export const iagoStompinMad: CharacterCard = {
  id: "UTt",
  canonicalId: "ci_UTt",
  reprints: ["set10-043"],
  cardType: "character",
  name: "Iago",
  version: "Stompin' Mad",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "010",
  cardNumber: 43,
  rarity: "uncommon",
  cost: 2,
  strength: 0,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_93fe86cf6bea47328896bd5ff2560694",
    tcgPlayer: 659181,
  },
  text: "Challenger +5",
  classifications: ["Storyborn", "Ally"],
  abilities: [challenger(5)],
  i18n: iagoStompinMadI18n,
};
