import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const clarabelleNewsReporterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Clarabelle",
    version: "News Reporter",
    text: [
      {
        title: "Support",
      },
      {
        title: "BREAKING STORY",
        description: "Your other characters with Support get +1 {S}.",
      },
    ],
  },
  de: {
    name: "Klarabella",
    version: "Nachrichtenreporterin",
    text: [
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Eilmeldung",
        description: "Deine anderen Charaktere mit <Unterstützen> erhalten +1 {S}.",
      },
    ],
  },
  fr: {
    name: "Clarabelle",
    version: "Journaliste",
    text: [
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Scoop",
        description: "Vos autres personnages avec Soutien gagnent +1 {S}.",
      },
    ],
  },
  it: {
    name: "Clarabella",
    version: "Giornalista",
    text: [
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Notizia Bomba",
        description: "I tuoi altri personaggi con <Aiutante> ricevono +1 {S}.",
      },
    ],
  },
  es: {
    name: "Clarabelle",
    version: "Reportero de noticias",
    text: [
      {
        title: "Apoyo",
      },
      {
        title: "HISTORIA DE ÚLTIMA HISTORIA",
        description: "Tus otros personajes con soporte obtienen +1 {S}.",
      },
    ],
  },
};
