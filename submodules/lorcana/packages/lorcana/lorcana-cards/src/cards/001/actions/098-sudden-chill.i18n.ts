import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const suddenChillI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sudden Chill",
    text: "Each opponent chooses and discards a card.",
  },
  de: {
    name: "Durchbohrender Blick",
    text: "Alle gegnerischen Mitspielenden wählen je 1 Karte aus ihrer Hand und werfen sie ab.",
  },
  fr: {
    name: "CRUELLE DIABLESSE",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Chaque adversaire choisit et défausse une carte de sa main.",
      },
    ],
  },
  it: {
    name: "Sudden Chill",
    text: "Each opponent chooses and discards a card.",
  },
  es: {
    name: "Escalofrío repentino",
    text: "Cada oponente elige y descarta una carta.",
  },
};
