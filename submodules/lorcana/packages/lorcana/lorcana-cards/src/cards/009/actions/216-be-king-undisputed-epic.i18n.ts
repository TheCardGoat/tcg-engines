import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const beKingUndisputedEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Be King Undisputed",
    text: "Each opponent chooses and banishes one of their characters.",
  },
  de: {
    name: "Als König geboren",
    text: "Alle gegnerischen Mitspielenden wählen je einen ihrer Charaktere und verbannen ihn.",
  },
  fr: {
    name: "Un roi incontesté",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 4 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Chaque adversaire choisit un de ses personnages et le bannit.",
      },
    ],
  },
  it: {
    name: "Sarò un Re Stimato",
    text: [
      {
        title:
          "(Un personaggio con costo 4 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Ogni avversario sceglie ed esilia uno dei suoi personaggi.",
      },
    ],
  },
  es: {
    name: "Sé rey indiscutible",
    text: "Cada oponente elige y destierra a uno de sus personajes.",
  },
};
