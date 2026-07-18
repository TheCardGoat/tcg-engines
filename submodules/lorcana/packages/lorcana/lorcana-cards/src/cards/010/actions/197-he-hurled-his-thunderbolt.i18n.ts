import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const heHurledHisThunderboltI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "He Hurled His Thunderbolt",
    text: "Deal 4 damage to chosen character. Your Deity characters gain Challenger +2 this turn. (They get +2 {S} while challenging.)",
  },
  de: {
    name: "Mit einem Blitz allein",
    text: "Füge einem Charakter deiner Wahl 4 Schaden zu. Deine Gottheiten erhalten in diesem Zug <Herausfordern> +2. (Während sie herausfordern, erhalten sie +2 {S}.)",
  },
  fr: {
    name: "Foudroyant d'un éclair",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 4 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un personnage et infligez-lui 4 dommages. Vos personnages Dieu gagnent <Offensif> +2 pour le reste de ce tour. (Lorsqu'ils défient, ces personnages gagnent +2 {S}.)",
      },
    ],
  },
  it: {
    name: "Con i suoi Fulmini",
    text: [
      {
        title:
          "(Un personaggio con costo 4 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Infliggi 4 danni a un personaggio a tua scelta. I tuoi personaggi Divinità ottengono <Sfidante> +2 per questo turno. (Ricevono +2 {S} mentre stanno sfidando.)",
      },
    ],
  },
  es: {
    name: "Lanzó su rayo",
    text: "Inflige 4 daños al personaje elegido. Tus personajes de Deidad obtienen Retador +2 este turno. (Obtienen +2 {S} mientras desafían).",
  },
};
