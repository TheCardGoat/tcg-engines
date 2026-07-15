import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const trustyLoyalBloodhoundI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Trusty",
    version: "Loyal Bloodhound",
    text: "Support",
  },
  de: {
    name: "Pluto, der Spürhund",
    version: "Loyaler Bluthund",
    text: "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "César",
    version: "Fidèle limier",
    text: "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
  },
  it: {
    name: "Fido",
    version: "Segugio Leale",
    text: "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
  },
};
