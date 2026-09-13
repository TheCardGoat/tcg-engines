import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { boltNShot } from "./bolt-n-shot.ts";

export const boltNShotI18n = defineFamilyI18n(boltNShot, {
  en: {
    name: "Bolt'n' Shot",
    typeText: "Ranger Action - Arrow Attack",
    text: "If Bolt'n' Shot's {p} is greater than its base {p}, it has go again and \"If this hits, reload.\"",
  },
});

export const {
  red: boltNShotRedI18n,
  yellow: boltNShotYellowI18n,
  blue: boltNShotBlueI18n,
} = boltNShotI18n.cards;
