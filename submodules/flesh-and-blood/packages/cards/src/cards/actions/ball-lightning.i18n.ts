import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { ballLightning } from "./ball-lightning.ts";

export const ballLightningI18n = defineFamilyI18n(ballLightning, {
  en: {
    name: "Ball Lightning",
    typeText: "Lightning Action - Attack",
    text: "Whenever a Lightning or Elemental action card would deal damage this combat chain, instead it deals that much damage plus 1.\nGo again",
  },
});

export const {
  red: ballLightningRedI18n,
  yellow: ballLightningYellowI18n,
  blue: ballLightningBlueI18n,
} = ballLightningI18n.cards;
