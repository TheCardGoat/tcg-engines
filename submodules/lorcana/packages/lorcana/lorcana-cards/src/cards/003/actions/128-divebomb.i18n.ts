import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const divebombI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Divebomb",
    text: "Banish one of your characters with Reckless to banish chosen character with less {S} than that character.",
  },
  de: {
    name: "Sturzbomber",
    text: "Verbanne einen deiner Charaktere mit <Impulsiv>, um einen Charakter deiner Wahl, mit einer geringeren {S} als der verbannte Charakter, zu verbannen.",
  },
  fr: {
    name: "Bombardement en piqué !",
    text: "Bannissez l'un de vos personnages avec <Combattant> puis choisissez un personnage ayant moins de {S} que lui et bannissez-le.",
  },
  it: {
    name: "In Picchiata",
    text: "Esilia uno dei tuoi personaggi con <Attaccabrighe> per esiliare un personaggio a tua scelta con meno {S} del tuo personaggio.",
  },
  es: {
    name: "Bomba en picado",
    text: "Destierra a uno de tus personajes con Reckless para desterrar al personaje elegido con menos {S} que ese personaje.",
  },
};
