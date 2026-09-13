import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blisteringBlade } from "./blistering-blade.ts";

export const blisteringBladeI18n = defineFamilyI18n(blisteringBlade, {
  en: {
    name: "Blistering Blade",
    typeText: "Draconic Warrior Attack Reaction",
    text: "Target dagger attack gets +2{p}. If you control 2 or more Draconic chain links, instead it gets +3{p}.",
  },
});

export const { red: blisteringBladeRedI18n } = blisteringBladeI18n.cards;
