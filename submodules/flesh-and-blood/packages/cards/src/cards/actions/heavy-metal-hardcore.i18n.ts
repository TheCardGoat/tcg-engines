import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { heavyMetalHardcore } from "./heavy-metal-hardcore.ts";

export const heavyMetalHardcoreI18n = defineFamilyI18n(heavyMetalHardcore, {
  en: {
    name: "Heavy Metal Hardcore",
    text: "If an Evo has been banished from boosting this turn, this gets +1{p}.\nBoost",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: heavyMetalHardcoreRedI18n,
  yellow: heavyMetalHardcoreYellowI18n,
  blue: heavyMetalHardcoreBlueI18n,
} = heavyMetalHardcoreI18n.cards;
