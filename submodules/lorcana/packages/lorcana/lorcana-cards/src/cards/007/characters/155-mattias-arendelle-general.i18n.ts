import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mattiasArendelleGeneralI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mattias",
    version: "Arendelle General",
    text: [
      {
        title: "PROUD TO SERVE",
        description: "Your Queen characters gain Ward.",
      },
    ],
  },
  de: {
    name: "Leutnant Mattias",
    version: "General von Arendelle",
    text: [
      {
        title: "BEREIT ZU BESCHÜTZEN",
        description:
          "Deine Königinnen erhalten Behütet. (Gegnerische Mitspielende können diese Charaktere nicht auswählen, außer um sie herauszufordern.)",
      },
    ],
  },
  fr: {
    name: "Mattias",
    version: "Général d’Arendelle",
    text: [
      {
        title: "FIER DE SERVIR",
        description:
          "Vos personnages Reine gagnent Hors d'atteinte. (Les adversaires ne peuvent pas choisir ces personnages, hormis pour un défi.)",
      },
    ],
  },
  it: {
    name: "Mattias",
    version: "Generale di Arendelle",
    text: [
      {
        title: "FIERI DI SERVIRE I",
        description:
          "tuoi personaggi Regina ottengono Protetto. (Gli avversari non possono sceglierli se non per sfidarli.)",
      },
    ],
  },
};
