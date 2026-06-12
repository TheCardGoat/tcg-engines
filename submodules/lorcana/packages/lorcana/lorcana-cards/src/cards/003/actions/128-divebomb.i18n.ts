import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const divebombI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Divebomb",
    text: "Banish one of your characters with Reckless to banish chosen character with less {S} than that character.",
  },
  de: {
    name: "Sturzbomber",
    text: "Verbanne einen deiner Charaktere mit Impulsiv, um einen Charakter deiner Wahl, mit einer geringeren als der verbannte Charakter, zu verbannen.",
  },
  fr: {
    name: "Bombardement en piqué !",
    text: "Bannissez l'un de vos personnages avec Combattant puis choisissez un personnage ayant moins de que lui et bannissez-le.",
  },
  it: {
    name: "In Picchiata",
    text: "Esilia uno dei tuoi personaggi con Attaccabrighe per esiliare un personaggio a tua scelta con meno del tuo personaggio.",
  },
};
