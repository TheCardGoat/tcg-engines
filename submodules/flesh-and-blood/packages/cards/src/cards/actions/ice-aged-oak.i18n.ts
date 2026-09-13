import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { iceAgedOak } from "./ice-aged-oak.ts";

export const iceAgedOakI18n = defineFamilyI18n(iceAgedOak, {
  en: {
    name: "Ice Aged Oak",
    typeText: "Earth Action - Attack",
    text: 'When this hits a hero, create an Embodiment of Earth token.\nIce Bond - If an Ice card was pitched to play this, this gets dominate and "When this hits a hero, create a Frostbite token in each of their exposed head, chest, arms, and legs zones."',
  },
});

export const { blue: iceAgedOakBlueI18n } = iceAgedOakI18n.cards;
