import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const meilinLeePopularRedPandaI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Meilin Lee",
    version: "Popular Red Panda",
    text: [
      {
        title: "Temporary Shift 3 {I}",
        description:
          "(You may pay 3 {I} to play this on top of one of your characters named Meilin Lee. At the end of your turn, remove all damage from this character and return only this card to your hand.)",
      },
      {
        title: "KARAOKE QUEEN",
        description: "Once during your turn, whenever this character sings a song, gain 3 lore.",
      },
    ],
  },
  de: {
    name: "Meilin Lee",
    version: "Beliebter Roter Panda",
    text: [
      {
        title:
          "<Temporärer Gestaltwandel> 3 {I} (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Charaktere namens Meilin Lee auszuspielen. Entferne am Ende deines Zuges jeglichen Schaden von diesem Charakter und nimm nur diese Karte zurück auf deine Hand.)",
      },
      {
        title: "Karaoke-Königin",
        description:
          "Einmal während deines Zuges, wenn dieser Charakter ein Lied singt, sammelst du 3 Legenden.",
      },
    ],
  },
  fr: {
    name: "Meilin Lee",
    version: "Panda roux populaire",
    text: [
      {
        title: "<Alter temporaire> 3 {I}",
      },
      {
        title: "Reine du karaoké",
        description:
          "Une fois durant votre tour, lorsque ce personnage chante une chanson, gagnez 3 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Meilin Lee",
    version: "Celebre Panda Rosso",
    text: [
      {
        title:
          "<Trasformazione Temporanea> 3 {I} (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Mei Lee. Alla fine del tuo turno, rimuovi tutto il danno da questo personaggio e riprendi in mano solo questa carta.)",
      },
      {
        title: "Regina del Karaoke",
        description:
          "Una volta durante il tuo turno, ogni volta che questo personaggio canta una canzone, ottieni 3 leggenda.",
      },
    ],
  },
};
