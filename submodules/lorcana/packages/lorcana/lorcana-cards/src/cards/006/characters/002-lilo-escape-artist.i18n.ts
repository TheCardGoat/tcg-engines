import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const liloEscapeArtistI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lilo",
    version: "Escape Artist",
    text: [
      {
        title: "NO PLACE I'D RATHER BE",
        description:
          "At the start of your turn, if this card is in your discard, you may play her and she enters play exerted.",
      },
    ],
  },
  de: {
    name: "Lilo",
    version: "Entfesslungskünstlerin",
    text: [
      {
        title: "Kein Ort, an dem ich lieber bin",
        description:
          "Zu Beginn deines Zuges, wenn diese Karte in deinem Ablagestapel ist, darfst du sie erschöpft ausspielen.",
      },
    ],
  },
  fr: {
    name: "Lilo",
    version: "Reine de l’évasion",
    text: [
      {
        title: "Pas d'autre endroit où je préférerais être",
        description:
          "Au début de votre tour, si cette carte est dans votre défausse, vous pouvez la jouer et elle entre en jeu épuisée.",
      },
    ],
  },
  it: {
    name: "Lilo",
    version: "Artista della Fuga",
    text: [
      {
        title: "Non c'è posto migliore",
        description:
          "All'inizio del tuo turno, se questa carta si trova nei tuoi scarti, puoi giocarla ed entra in gioco impegnata.",
      },
    ],
  },
};
