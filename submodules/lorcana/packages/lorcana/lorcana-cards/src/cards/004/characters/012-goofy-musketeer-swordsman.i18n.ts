import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goofyMusketeerSwordsmanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Goofy",
    version: "Musketeer Swordsman",
    text: [
      {
        title: "EN GAWRSH!",
        description:
          "Whenever you play a character with Bodyguard, ready this character. He can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Goofy",
    version: "Musketier-Schwertkämpfer",
    text: [
      {
        title: "En Gawrsh!",
        description:
          "Jedes Mal, wenn du einen Charakter mit <Beschützen> ausspielst, mache diesen Charakter bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Dingo",
    version: "Mousquetaire épéiste",
    text: [
      {
        title: "En garde, hyuck!",
        description:
          "Chaque fois que vous jouez un personnage avec <Rempart>, redressez ce personnage-ci. Il ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Pippo",
    version: "Spadaccino Moschettiere",
    text: [
      {
        title: "In Gwhardia!",
        description:
          "Ogni volta che giochi un personaggio con <Guardiano>, prepara questo personaggio. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
  es: {
    name: "Mentecato",
    version: "Mosquetero espadachín",
    text: [
      {
        title: "ES GAWRSH!",
        description:
          "Siempre que interpretes a un personaje con Bodyguard, prepara este personaje. No puede realizar misiones durante el resto de este turno.",
      },
    ],
  },
};
