import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { weepingBattleground } from "./weeping-battleground.ts";

export const weepingBattlegroundI18n = defineFamilyI18n(weepingBattleground, {
  en: {
    name: "Weeping Battleground",
    text: "You may banish an aura from your graveyard. If you do, deal 1 arcane damage to target hero.",
    typeText: "Runeblade Defense Reaction",
  },
});

export const {
  red: weepingBattlegroundRedI18n,
  yellow: weepingBattlegroundYellowI18n,
  blue: weepingBattlegroundBlueI18n,
} = weepingBattlegroundI18n.cards;
