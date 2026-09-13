import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { callInTheBigGuns } from "./call-in-the-big-guns.ts";

export const callInTheBigGunsI18n = defineFamilyI18n(callInTheBigGuns, {
  en: {
    name: "Call in the Big Guns",
    text: ({ textValue1 }) => `Your next arrow attack this turn gets +${textValue1}{p}.
You may put an arrow from your hand face-up into your arsenal.
Go again`,
    typeText: "Ranger Action",
  },
});

export const {
  red: callInTheBigGunsRedI18n,
  yellow: callInTheBigGunsYellowI18n,
  blue: callInTheBigGunsBlueI18n,
} = callInTheBigGunsI18n.cards;
