import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { runicFellingsong } from "./runic-fellingsong.ts";

export const runicFellingsongI18n = defineFamilyI18n(runicFellingsong, {
  en: {
    name: "Runic Fellingsong",
    text: "When this attacks, you may banish an aura from your graveyard. If you do, deal 1 arcane damage to target hero.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: runicFellingsongRedI18n,
  yellow: runicFellingsongYellowI18n,
  blue: runicFellingsongBlueI18n,
} = runicFellingsongI18n.cards;
