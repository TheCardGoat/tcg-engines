import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const dodgeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dodge!",
    text: "Chosen character gains Ward and Evasive until the start of your next turn. (Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)",
  },
  de: {
    name: "Ausweichen!",
    text: "Ein Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges Behütet und Wendig. (Gegnerische Karten können den Charakter nicht auswählen, außer um ihn herauszufordern. Nur Charaktere mit Wendig können den Charakter herausfordern.)",
  },
  fr: {
    name: "Esquive !",
    text: "Choisissez un personnage qui gagne Hors d'atteinte et Insaisissable jusqu'au début de votre prochain tour. (Les adversaires ne peuvent pas choisir ce personnage, hormis pour un défi. Seuls les personnages avec Insaisissable peuvent défier ce personnage.)",
  },
  it: {
    name: "Schivata!",
    text: "Un personaggio a tua scelta ottiene Protetto e Sfuggente fino all'inizio del tuo prossimo turno. (Gli avversari non possono sceglierlo se non per sfidarlo. Solo altri personaggi con Sfuggente possono sfidarlo.)",
  },
};
