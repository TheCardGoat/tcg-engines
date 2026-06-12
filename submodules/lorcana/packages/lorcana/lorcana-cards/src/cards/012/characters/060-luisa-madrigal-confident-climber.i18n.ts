import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const luisaMadrigalConfidentClimberI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Luisa Madrigal",
    version: "Confident Climber",
    text: [
      {
        title: "Shift 3 {I}",
      },
      {
        title: "I CAN TAKE IT 1",
        description:
          "{I} — Move up to 1 damage from chosen character of yours to this character. Then, if this character has 3 or more damage, move all damage from this character to chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Luisa Madrigal",
    version: "Selbstbewusste Kletterin",
    text: [
      {
        title:
          "<Gestaltwandel> 3 {I} (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Luisa-Madrigal-Charaktere auszuspielen.)",
      },
      {
        title: "Ich halte das aus",
        description:
          "1 {I} — Wähle einen deiner Charaktere und verschiebe bis zu 1 Schaden von jenem auf diesen Charakter. Dann, falls dieser Charakter 3 oder mehr Schaden hat, verschiebe jeglichen Schaden von diesem Charakter zu einem gegnerischen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Luisa Madrigal",
    version: "Grimpeuse sûre d’elle",
    text: [
      {
        title:
          "<Alter> 3 {I} (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages nommé Luisa Madrigal.)",
      },
      {
        title: "Je peux encaisser",
        description:
          "1 {I} — Choisissez l'un de vos personnages et déplacez jusqu'à 1 de ses dommages sur ce personnage-ci. Ensuite, si ce personnage-ci a 3 dommages ou plus, déplacez tous ses dommages sur un personnage adverse de votre choix.",
      },
    ],
  },
  it: {
    name: "Luisa Madrigal",
    version: "Scalatrice Sicura di Sé",
    text: [
      {
        title:
          "<Trasformazione> 3 {I} (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Luisa Madrigal.)",
      },
      {
        title: "Ce la Faccio",
        description:
          "1 {I} — Sposta fino a 1 danno da un tuo personaggio a tua scelta a questo personaggio. Poi, se questo personaggio ha 3 o più danni, sposta tutti i danni da questo personaggio a un personaggio avversario a tua scelta.",
      },
    ],
  },
};
