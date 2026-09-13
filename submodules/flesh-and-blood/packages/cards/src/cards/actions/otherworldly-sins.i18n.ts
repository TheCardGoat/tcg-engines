import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { otherworldlySins } from "./otherworldly-sins.ts";

export const otherworldlySinsI18n = defineFamilyI18n(otherworldlySins, {
  en: {
    name: "Otherworldly Sins",
    typeText: "Shadow Runeblade Action",
    text: (amount) =>
      `Your next Runeblade or Shadow attack this turn gets +${amount}{p}.\nCreate a Runechant token.\nGo again`,
  },
});

export const {
  red: otherworldlySinsRedI18n,
  yellow: otherworldlySinsYellowI18n,
  blue: otherworldlySinsBlueI18n,
} = otherworldlySinsI18n.cards;
