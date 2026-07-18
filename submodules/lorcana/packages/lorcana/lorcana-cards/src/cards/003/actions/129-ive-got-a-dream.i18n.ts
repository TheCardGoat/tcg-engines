import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const iveGotADreamI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "I've Got a Dream",
    text: "Ready chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location's {L}.",
  },
  de: {
    name: "Ich hab 'nen Traum",
    text: "Mache einen deiner Charaktere an einem Ort bereit. Er kann in diesem Zug nicht mehr erkunden. Sammle so viele Legenden, wie der {L}-Wert dieses Ortes beträgt.",
  },
  fr: {
    name: "Moi, j'ai un rêve",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez l'un de vos personnages sur un lieu et redressez-le, il ne peut pas être envoyé à l'aventure pour le reste de ce tour. Gagnez un nombre d'éclats de Lore égal à la {L} de ce lieu.",
      },
    ],
  },
  it: {
    name: "Un Sogno C'È",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per giocare questa canzone gratis.)",
      },
      {
        title:
          "Prepara un tuo personaggio a tua scelta che si trovi in un luogo. Non può andare all'avventura per il resto di questo turno. Ottieni leggenda pari al {L} di quel luogo.",
      },
    ],
  },
  es: {
    name: "Tengo un sueño",
    text: "Listo tu personaje elegido en una ubicación. No pueden realizar misiones durante el resto de este turno. Obtén conocimientos equivalentes al {L} de esa ubicación.",
  },
};
