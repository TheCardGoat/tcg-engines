import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chiefTuiRespectedLeaderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chief Tui",
    version: "Respected Leader",
    text: "Support",
  },
  de: {
    name: "Tui",
    version: "Respektierter Anführer",
    text: "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "TUI",
    version: "Chef respecté",
    text: "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
  },
  it: {
    name: "Capo Tui",
    version: "Leader Rispettato",
    text: "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
  },
  es: {
    name: "Jefe Tui",
    version: "Líder respetado",
    text: "Apoyo",
  },
};
