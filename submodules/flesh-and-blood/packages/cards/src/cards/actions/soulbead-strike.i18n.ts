import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { soulbeadStrike } from "./soulbead-strike.ts";

export const soulbeadStrikeI18n = defineFamilyI18n(soulbeadStrike, {
  en: {
    name: "Soulbead Strike",
    text: "When this hits, it gets go again.",
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: soulbeadStrikeRedI18n,
  yellow: soulbeadStrikeYellowI18n,
  blue: soulbeadStrikeBlueI18n,
} = soulbeadStrikeI18n.cards;
