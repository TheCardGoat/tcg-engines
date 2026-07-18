import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const protectiveAuraI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Protective Aura",
    text: "Your Floodborn characters gain Evasive until the start of your next turn.",
  },
  de: {
    name: "Beschützende Aura",
    text: "Deine Flutgestalt-Charaktere erhalten bis zu Beginn deines nächsten Zuges <Wendig>. (Nur Charaktere mit Wendig können sie herausfordern.)",
  },
  fr: {
    name: "Aura protectrice",
    text: "Vos personnages Floodborn gagnent <Insaisissable> jusqu'au début de votre prochain tour. (Seuls les personnages avec Insaisissable peuvent défier ces personnages.)",
  },
  it: {
    name: "Aura Protettiva",
    text: "I tuoi personaggi Imbevuto ottengono <Sfuggente> fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarli.)",
  },
  es: {
    name: "Aura protectora",
    text: "Tus personajes Floodborn obtienen Evasividad hasta el comienzo de tu siguiente turno.",
  },
};
