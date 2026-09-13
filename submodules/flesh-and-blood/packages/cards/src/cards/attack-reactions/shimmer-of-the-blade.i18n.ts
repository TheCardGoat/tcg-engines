import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shimmerOfTheBlade } from "./shimmer-of-the-blade.ts";

export const shimmerOfTheBladeI18n = defineFamilyI18n(shimmerOfTheBlade, {
  en: {
    name: "Shimmer of the Blade",
    typeText: "Warrior Attack Reaction",
    text: "Target weapon attack gets +3{p}.\nInstant - Discard this: Create a Blade Dance token.",
  },
});

export const { red: shimmerOfTheBladeRedI18n } = shimmerOfTheBladeI18n.cards;
