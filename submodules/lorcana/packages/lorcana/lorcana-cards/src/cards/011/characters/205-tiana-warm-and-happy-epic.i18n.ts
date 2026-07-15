import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tianaWarmAndHappyEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tiana",
    version: "Warm and Happy",
    text: "Support",
  },
  de: {
    name: "Tiana",
    version: "Warm und glücklich",
    text: "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "Tiana",
    version: "Réchauffée et heureuse",
    text: "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
  },
  it: {
    name: "Tiana",
    version: "Felice e al Calduccio",
    text: "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
  },
};
