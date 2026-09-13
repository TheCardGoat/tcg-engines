import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { stingingSprite } from "./stinging-sprite.ts";

export const stingingSpriteI18n = defineFamilyI18n(stingingSprite, {
  en: {
    name: "Stinging Sprite",
    text: "When this attacks or defends, deal 1 arcane damage to target hero.",
    typeText: "Lightning Runeblade Action - Attack",
  },
});

export const {
  red: stingingSpriteRedI18n,
  yellow: stingingSpriteYellowI18n,
  blue: stingingSpriteBlueI18n,
} = stingingSpriteI18n.cards;
