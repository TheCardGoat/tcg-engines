import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { layWaste } from "./lay-waste.ts";

export const layWasteI18n = defineFamilyI18n(layWaste, {
  en: {
    name: "Lay Waste",
    text: "Boost\nThis can't be defended by equipment.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: layWasteRedI18n,
  yellow: layWasteYellowI18n,
  blue: layWasteBlueI18n,
} = layWasteI18n.cards;
