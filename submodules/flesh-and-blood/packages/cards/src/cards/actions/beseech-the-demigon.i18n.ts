import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { beseechTheDemigon } from "./beseech-the-demigon.ts";

export const beseechTheDemigonI18n = defineFamilyI18n(beseechTheDemigon, {
  en: {
    name: "Beseech the Demigon",
    text: ({
      value1,
    }) => `Choose an attack action card in your banished zone. It gets +${value1}{p} until end of turn.
Go again`,
    typeText: "Shadow Action",
  },
});

export const {
  red: beseechTheDemigonRedI18n,
  yellow: beseechTheDemigonYellowI18n,
  blue: beseechTheDemigonBlueI18n,
} = beseechTheDemigonI18n.cards;
