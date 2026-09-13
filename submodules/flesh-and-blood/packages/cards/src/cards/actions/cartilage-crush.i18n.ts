import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cartilageCrush } from "./cartilage-crush.ts";

export const cartilageCrushI18n = defineFamilyI18n(cartilageCrush, {
  en: {
    name: "Cartilage Crush",
    text: "Crush - When this deals 4 or more damage to a hero, their first action during their next turn costs an additional {r} to play or activate.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: cartilageCrushRedI18n,
  yellow: cartilageCrushYellowI18n,
  blue: cartilageCrushBlueI18n,
} = cartilageCrushI18n.cards;
