import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sprocketRocket } from "./sprocket-rocket.ts";

export const sprocketRocketI18n = defineFamilyI18n(sprocketRocket, {
  en: {
    name: "Sprocket Rocket",
    text: "Boost\nIf an item or equipment was banished from boosting this, this gets +1{p}.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: sprocketRocketRedI18n,
  yellow: sprocketRocketYellowI18n,
  blue: sprocketRocketBlueI18n,
} = sprocketRocketI18n.cards;
