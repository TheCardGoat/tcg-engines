import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const basilOfBakerStreetI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Basil",
    version: "Of Baker Street",
    text: "Support",
  },
  de: {
    name: "Basil",
    version: "Aus der Baker Street",
    text: "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "Basil",
    version: "De Baker Street",
    text: "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
  },
  it: {
    name: "Basil",
    version: "Di Baker Street",
    text: "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
  },
};
