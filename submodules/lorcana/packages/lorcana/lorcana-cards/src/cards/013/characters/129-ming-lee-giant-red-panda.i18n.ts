import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mingLeeGiantRedPandaI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ming Lee",
    version: "Giant Red Panda",
    text: [
      {
        title:
          "<Temporary Shift> 7 {I} (You may pay 7 {I} to play this on top of one of your characters named Ming Lee. At the end of your turn, remove all damage from this character and return only this card to your hand.)",
      },
      {
        title: "Path of Destruction",
        description:
          "Whenever this character challenges another character, ready her. She can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Ming Lee",
    version: "Riesiger Roter Panda",
    text: [
      {
        title:
          "<Temporärer Gestaltwandel> 7 {I} (Du kannst 7 {I} zahlen, um diesen Charakter auf einen deiner Charaktere namens Ming Lee auszuspielen. Entferne am Ende deines Zuges jeglichen Schaden von diesem Charakter und nimm nur diese Karte zurück auf deine Hand.)",
      },
      {
        title: "Pfad der Zerstörung",
        description:
          "Jedes Mal, wenn dieser Charakter einen anderen Charakter herausfordert, mache diesen Charakter bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Ming Lee",
    version: "Panda roux géant",
    text: [
      {
        title:
          "<Alter temporaire> 7 {I} (Vous pouvez payer 7 {I} pour jouer ce personnage sur l'un de vos personnages nommé Ming Lee. À la fin de votre tour, retirez tous les dommages de ce personnage et renvoyez uniquement cette carte dans votre main.)",
      },
      {
        title: "Sillage de destruction",
        description:
          "Chaque fois que ce personnage en défie un autre, redressez-le. Il ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Ming Lee",
    version: "Panda Rosso Gigante",
    text: [
      {
        title:
          "<Trasformazione Temporanea> 7 {I} (Puoi pagare 7 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Ming Lee. Alla fine del tuo turno, rimuovi tutto il danno da questo personaggio e riprendi in mano solo questa carta.)",
      },
      {
        title: "Sentiero di Distruzione",
        description:
          "Ogni volta che questo personaggio sfida un altro personaggio, prepara questo personaggio. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
