import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shieldWall } from "./shield-wall.ts";

export const shieldWallI18n = defineFamilyI18n(shieldWall, {
  en: {
    name: "Shield Wall",
    text: "If you control a Guardian off-hand, Shield Wall has +4{d}.",
    typeText: "Guardian Defense Reaction",
  },
});

export const {
  red: shieldWallRedI18n,
  yellow: shieldWallYellowI18n,
  blue: shieldWallBlueI18n,
} = shieldWallI18n.cards;
