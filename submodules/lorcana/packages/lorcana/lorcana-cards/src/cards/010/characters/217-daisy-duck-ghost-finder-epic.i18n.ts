import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const daisyDuckGhostFinderEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Daisy Duck",
    version: "Ghost Finder",
    text: "Support",
  },
  de: {
    name: "Daisy Duck",
    version: "Geistersucherin",
    text: "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "Daisy",
    version: "Traqueuse de fantômes",
    text: "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
  },
  it: {
    name: "Paperina",
    version: "Cercatrice di Fantasmi",
    text: "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
  },
};
