import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const wasabiAlwaysPreparedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Wasabi",
    version: "Always Prepared",
    text: "Support",
  },
  de: {
    name: "Wasabi",
    version: "Auf alles vorbereitet",
    text: "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "Wasabi",
    version: "Toujours prêt",
    text: "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
  },
  it: {
    name: "Wasabi",
    version: "Sempre Pronto",
    text: "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
  },
};
