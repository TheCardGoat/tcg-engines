import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const annaIceBreakerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Anna",
    version: "Ice Breaker",
    text: [
      {
        title: "Support",
      },
      {
        title: "WINTER AMBUSH",
        description:
          "When you play this character, chosen opposing character can't ready at the start of their next turn.",
      },
    ],
  },
  de: {
    name: "Anna",
    version: "Eisbrecherin",
    text: [
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Winterlicher Hinterhalt",
        description:
          "Wenn du diesen Charakter ausspielst, wähle einen gegnerischen Charakter. Er wird zu Beginn seines nächsten Zuges nicht bereit gemacht.",
      },
    ],
  },
  fr: {
    name: "Anna",
    version: "Briseuse de glace",
    text: [
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Embuscade glaciale",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui ne se redresse pas au début de son prochain tour.",
      },
    ],
  },
  it: {
    name: "Anna",
    version: "Rompighiaccio",
    text: [
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Imboscata Invernale",
        description:
          "Quando giochi questo personaggio, un personaggio avversario a tua scelta non si può preparare all'inizio del suo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Ana",
    version: "Rompehielos",
    text: [
      {
        title: "Apoyo",
      },
      {
        title: "EMBOSCADA DE INVIERNO",
        description:
          "Cuando juegas con este personaje, el personaje contrario elegido no puede estar listo al comienzo de su siguiente turno.",
      },
    ],
  },
};
