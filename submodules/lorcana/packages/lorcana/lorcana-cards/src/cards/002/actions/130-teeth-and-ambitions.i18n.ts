import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const teethAndAmbitionsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Teeth and Ambitions",
    text: "Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.",
  },
  de: {
    name: "Zähne blank wie Neid",
    text: "Wähle einen deiner Charaktere und füge ihm 2 Schaden zu, um einem anderen Charakter deiner Wahl 2 Schaden zuzufügen.",
  },
  fr: {
    name: "Votre roi vous invite à la fête",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez l'un de vos personnages et infligez-lui 2 dommages pour infliger 2 dommages à un autre personnage au choix.",
      },
    ],
  },
  it: {
    name: "Affiliamo le Zanne",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Infliggi 2 danni a un tuo personaggio a tua scelta per infliggere 2 danni a un altro personaggio a tua scelta.",
      },
    ],
  },
};
