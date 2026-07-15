import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const basilPracticedDetectiveI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Basil",
    version: "Practiced Detective",
    text: "Support",
  },
  de: {
    name: "Basil",
    version: "Geübter Detektiv",
    text: "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "Basil",
    version: "Détective chevronné",
    text: "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
  },
  it: {
    name: "Basil",
    version: "Detective Esperto",
    text: "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
  },
};
