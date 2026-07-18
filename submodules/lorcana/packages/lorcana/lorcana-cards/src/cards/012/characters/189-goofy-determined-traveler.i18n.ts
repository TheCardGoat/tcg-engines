import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goofyDeterminedTravelerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Goofy",
    version: "Determined Traveler",
    text: [
      {
        title: "FALLING ROCKS",
        description:
          "Whenever this character quests, if you played another character this turn, you may deal 1 damage to chosen character or location.",
      },
    ],
  },
  de: {
    name: "Goofy",
    version: "Entschlossener Reisender",
    text: [
      {
        title: "Fallende Steine",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, falls du in diesem Zug mindestens einen anderen Charakter ausgespielt hast, darfst du einem Charakter oder einem Ort deiner Wahl 1 Schaden zufügen.",
      },
    ],
  },
  fr: {
    name: "Dingo",
    version: "Voyageur déterminé",
    text: [
      {
        title: "Chute de pierres",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, si vous avez joué un autre personnage ce tour-ci, vous pouvez choisir un personnage ou un lieu et lui infliger 1 dommage.",
      },
    ],
  },
  it: {
    name: "Pippo",
    version: "Viaggiatore Determinato",
    text: [
      {
        title: "Caduta Massi",
        description:
          "Ogni volta che questo personaggio va all'avventura, se hai giocato un altro personaggio in questo turno, puoi infliggere 1 danno a un personaggio o a un luogo a tua scelta.",
      },
    ],
  },
  es: {
    name: "Mentecato",
    version: "Viajero decidido",
    text: [
      {
        title: "ROCAS QUE CAEN",
        description:
          "Siempre que este personaje realice una misión, si jugaste con otro personaje este turno, puedes causar 1 daño al personaje o ubicación elegida.",
      },
    ],
  },
};
