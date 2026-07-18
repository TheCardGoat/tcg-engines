import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tryEverythingI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Try Everything",
    text: "Remove up to 3 damage from chosen character and ready them. They can't quest or challenge for the rest of this turn.",
  },
  de: {
    name: "Try Everything",
    text: "Entferne bis zu 3 Schaden von einem Charakter deiner Wahl und mache ihn bereit. Er kann in diesem Zug nicht mehr erkunden oder herausfordern.",
  },
  fr: {
    name: "Try Everything",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 4 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un personnage. Retirez-lui jusqu'à 3 dommages et redressez-le. Il ne peut ni partir à l'aventure ni défier pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Try Everything",
    text: [
      {
        title:
          "(Un personaggio con costo 4 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Rimuovi fino a 3 danni da un personaggio a tua scelta e preparalo. Non può andare all'avventura o sfidare per il resto di questo turno.",
      },
    ],
  },
  es: {
    name: "Pruébalo todo",
    text: "Elimina hasta 3 daños del personaje elegido y prepáralo. No pueden realizar misiones ni desafíos durante el resto de este turno.",
  },
};
