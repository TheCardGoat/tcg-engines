import type { CharacterCard } from "@tcg/lorcana-types";
import { liShangSeasonedStrategistI18n } from "./145-li-shang-seasoned-strategist.i18n";

export const liShangSeasonedStrategist: CharacterCard = {
  id: "1HE",
  canonicalId: "ci_1HE",
  reprints: ["set10-145"],
  cardType: "character",
  name: "Li Shang",
  version: "Seasoned Strategist",
  inkType: ["sapphire"],
  franchise: "Mulan",
  set: "010",
  cardNumber: 145,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_b8e31f6f54ad44749dc441c7547ab686",
    tcgPlayer: 660002,
  },
  classifications: ["Storyborn", "Hero", "Captain"],
  i18n: liShangSeasonedStrategistI18n,
};
