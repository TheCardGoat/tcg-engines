import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aresGodOfWarI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ares",
    version: "God of War",
    text: [
      {
        title: "Reckless",
      },
      {
        title: "CALL TO BATTLE",
        description:
          "Once during your turn, whenever you put a card under one of your characters or locations, you may ready chosen character. If you do, that character can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Ares",
    version: "Gott des Krieges",
    text: [
      {
        title: "Impulsiv",
      },
      {
        title: "AUFRUF ZUM KAMPF",
        description:
          "Einmal während deines Zuges, wenn du eine Karte unter einen deiner Charaktere oder Orte legst, darfst du einen Charakter deiner Wahl bereit machen. Wenn du dies tust, kann jener in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Arès",
    version: "Dieu de la guerre",
    text: [
      {
        title: "Combattant",
      },
      {
        title: "APPEL AUX ARMES",
        description:
          "Une fois durant votre tour, lorsque vous placez une carte sous l'un de vos personnages ou de vos lieux, vous pouvez choisir un personnage et le redresser. Si vous le faites, le personnage ainsi choisi ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Ares",
    version: "Dio della Guerra",
    text: [
      {
        title: "Attaccabrighe",
      },
      {
        title: "ALLA BATTAGLIA",
        description:
          "Una volta durante il tuo turno, ogni volta che metti una carta sotto a uno dei tuoi personaggi o luoghi, puoi preparare un personaggio a tua scelta. Se lo fai, quel personaggio non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
