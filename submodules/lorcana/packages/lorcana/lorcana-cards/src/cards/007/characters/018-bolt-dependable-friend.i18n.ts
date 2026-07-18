import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const boltDependableFriendI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bolt",
    version: "Dependable Friend",
    text: "Support",
  },
  de: {
    name: "Bolt",
    version: "Verlässlicher Freund",
    text: "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
  },
  fr: {
    name: "Volt",
    version: "Ami digne de confiance",
    text: "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
  },
  it: {
    name: "Bolt",
    version: "Amico Fidato",
    text: "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
  },
  es: {
    name: "Tornillo",
    version: "Amigo confiable",
    text: "Apoyo",
  },
};
