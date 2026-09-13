import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bloodFollowsBlade } from "./blood-follows-blade.ts";

export const bloodFollowsBladeI18n = defineFamilyI18n(bloodFollowsBlade, {
  en: {
    name: "Blood Follows Blade",
    typeText: "Warrior Attack Reaction",
    text: 'Kassai Specialization\nTarget sword attack gets go again and "When this hits, create a Cintari Sellsword token."',
  },
});

export const { yellow: bloodFollowsBladeYellowI18n } = bloodFollowsBladeI18n.cards;
