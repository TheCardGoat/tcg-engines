import type { CharacterCard } from "@tcg/lorcana-types";
import { dashParrLavaRunnerP3PromoI18n } from "./p3-052-dash-parr-lava-runner-promo.i18n";
import { dashParrLavaRunner } from "./061-dash-parr-lava-runner";

export const dashParrLavaRunnerP3Promo: CharacterCard = {
  ...dashParrLavaRunner,
  id: "UC4",
  set: "P03",
  cardNumber: 52,
  rarity: "special",
  specialRarity: "promo",
  i18n: dashParrLavaRunnerP3PromoI18n,
};
