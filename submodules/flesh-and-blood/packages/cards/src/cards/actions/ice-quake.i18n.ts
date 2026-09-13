import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { iceQuake } from "./ice-quake.ts";

export const iceQuakeI18n = defineFamilyI18n(iceQuake, {
  en: {
    name: "Ice Quake",
    text: ({ amount }) =>
      `Your next attack this turn gains +${amount}{p}. Whenever an attack hits a hero this turn, create a Frostbite token under their control.`,
    typeText: "Ice Action",
  },
});

export const {
  red: iceQuakeRedI18n,
  yellow: iceQuakeYellowI18n,
  blue: iceQuakeBlueI18n,
} = iceQuakeI18n.cards;
