import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { dragDown } from "./drag-down.ts";

export const dragDownI18n = defineFamilyI18n(dragDown, {
  en: {
    name: "Drag Down",
    typeText: "Generic Defense Reaction",
    text: (amount) => `When this defends an attack, it gets -${amount}{p}.`,
  },
});

export const {
  red: dragDownRedI18n,
  yellow: dragDownYellowI18n,
  blue: dragDownBlueI18n,
} = dragDownI18n.cards;
