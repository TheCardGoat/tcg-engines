import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ruttNorthernMooseI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rutt",
    version: "Northern Moose",
    text: "Support",
  },
  de: {
    name: "Benny",
    version: "Elch aus dem Norden",
    text: "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "Truc",
    version: "Élan nordique",
    text: "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
  },
  it: {
    name: "Fiocco",
    version: "Alce del Nord",
    text: "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
  },
};
