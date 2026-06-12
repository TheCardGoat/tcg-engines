import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const obscurosphereI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Obscurosphere",
    text: [
      {
        title: "EXTRACT OF EMERALD 2",
        description:
          "{I}, Banish this item — Your characters gain Ward until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Obskurosphäre",
    text: [
      {
        title: "EXTRAKT AUS SMARAGD 2,",
        description:
          "Verbanne diesen Gegenstand — Deine Charaktere erhalten bis zu Beginn deines nächsten Zuges Behütet. (Gegnerische Mitspielende können die Charaktere nicht auswählen, außer um sie herauszufordern.)",
      },
    ],
  },
  fr: {
    name: "Obscurosphère",
    text: [
      {
        title: "EXTRAIT",
        description:
          "D'ÉMERAUDE 2, bannissez cet objet — Vos personnages gagnent Hors d'atteinte jusqu'au début de votre prochain tour. (Les adversaires ne peuvent pas choisir ces personnages, hormis pour un défi.)",
      },
    ],
  },
  it: {
    name: "Oscurosfera",
    text: [
      {
        title: "ESTRATTO DI SMERALDO 2,",
        description:
          "esilia questo oggetto — I tuoi personaggi ottengono Protetto fino all'inizio del tuo prossimo turno. (Gli avversari non possono sceglierli se non per sfidarli.)",
      },
    ],
  },
};
