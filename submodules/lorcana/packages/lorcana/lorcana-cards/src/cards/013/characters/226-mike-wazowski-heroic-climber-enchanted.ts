import type { CharacterCard } from "@tcg/lorcana-types";
import { mikeWazowskiHeroicClimber } from "./018-mike-wazowski-heroic-climber";
import { mikeWazowskiHeroicClimberEnchantedI18n } from "./226-mike-wazowski-heroic-climber-enchanted.i18n";

export const mikeWazowskiHeroicClimberEnchanted: CharacterCard = {
  ...mikeWazowskiHeroicClimber,
  id: "Cuq",
  printings: [
    {
      id: "set13-226-enchanted",
      artId: "ci_35R-enchanted",
      setCode: "set13",
      collectorNumber: "226",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  cardNumber: 226,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: mikeWazowskiHeroicClimberEnchantedI18n,
};
