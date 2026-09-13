import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { boomGrenade } from "./boom-grenade.ts";

export const boomGrenadeI18n = defineFamilyI18n(boomGrenade, {
  en: {
    name: "Boom Grenade",
    text: ({ value3 }) =>
      `Crank\nThis enters the arena with a steam counter. At the start of your turn, destroy this unless you remove a steam counter from it.\nWhen a Mechanologist attack action card you control hits a hero, destroy this and deal ${value3} damage to them.`,
    typeText: "Mechanologist Action - Item",
  },
});

export const {
  red: boomGrenadeRedI18n,
  yellow: boomGrenadeYellowI18n,
  blue: boomGrenadeBlueI18n,
} = boomGrenadeI18n.cards;
