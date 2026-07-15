import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bePreparedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Be Prepared",
    text: "Banish all characters.",
  },
  de: {
    name: "Seid bereit!",
    text: "Verbanne alle Charaktere.",
  },
  fr: {
    name: "SOYEZ PRÊTES !",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 7 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Bannissez tous les personnages.",
      },
    ],
  },
  it: {
    name: "Be Prepared",
    text: "Banish all characters.",
  },
};
