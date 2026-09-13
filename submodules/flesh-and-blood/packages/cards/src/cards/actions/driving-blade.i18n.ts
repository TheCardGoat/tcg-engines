import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { drivingBlade } from "./driving-blade.ts";

export const drivingBladeI18n = defineFamilyI18n(drivingBlade, {
  en: {
    name: "Driving Blade",
    text: (amount) =>
      `Your next weapon attack this turn gains +${amount}{p} and go again.\nGo again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: drivingBladeRedI18n,
  yellow: drivingBladeYellowI18n,
  blue: drivingBladeBlueI18n,
} = drivingBladeI18n.cards;
