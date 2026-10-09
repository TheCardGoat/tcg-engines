import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jukeboxI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jukebox",
    text: [
      {
        title: "ON REPEAT",
        description:
          "Once during your turn, whenever you play a song, if it has the same name as another card in your discard, you may ready chosen character. If you do, they can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Jukebox",
    text: [
      {
        title: "Auf Wiederholung",
        description:
          "Einmal während deines Zuges, wenn du ein Lied ausspielst, falls es denselben Namen wie eine andere Karte in deinem Ablagestapel hat, darfst du einen Charakter deiner Wahl bereit machen. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Jukebox",
    text: [
      {
        title: "En boucle",
        description:
          "Une fois durant votre tour, lorsque vous jouez une chanson, si cette carte-là porte le même nom qu'une autre carte de votre défausse, vous pouvez choisir un personnage et le redresser. Si vous le faites, ce personnage ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Jukebox",
    text: [
      {
        title: "In Loop",
        description:
          "Una volta durante il tuo turno, ogni volta che giochi una canzone, se quella carta ha lo stesso nome di un'altra carta nei tuoi scarti, puoi preparare un personaggio a tua scelta. Se lo fai, non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
  es: {
    name: "Jukebox",
    text: [
      {
        title: "ON REPEAT",
        description:
          "Once during your turn, whenever you play a song, if it has the same name as another card in your discard, you may ready chosen character. If you do, they can't quest for the rest of this turn.",
      },
    ],
  },
};
