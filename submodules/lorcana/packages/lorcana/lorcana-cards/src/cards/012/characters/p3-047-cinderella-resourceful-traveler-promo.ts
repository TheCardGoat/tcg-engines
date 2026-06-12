import type { CharacterCard } from "@tcg/lorcana-types";
import { cinderellaResourcefulTravelerP3PromoI18n } from "./p3-047-cinderella-resourceful-traveler-promo.i18n";
import { cinderellaResourcefulTraveler } from "./155-cinderella-resourceful-traveler";

export const cinderellaResourcefulTravelerP3Promo: CharacterCard = {
  ...cinderellaResourcefulTraveler,
  id: "otc",
  set: "P03",
  cardNumber: 47,
  rarity: "special",
  specialRarity: "promo",
  i18n: cinderellaResourcefulTravelerP3PromoI18n,
};
