import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const blastFromYourPastI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Blast from Your Past",
    text: "Name a card. Return all character cards with that name from your discard to your hand.",
  },
  de: {
    name: "Wer einmal lügt, der hat Pech",
    text: "Benenne eine Karte. Nimm alle Charakterkarten mit dem genannten Namen aus deinem Ablagestapel zurück auf deine Hand.",
  },
  fr: {
    name: "Un mirage à deux visages",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 6 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Nommez une carte. Renvoyez dans votre main toutes les cartes Personnage portant ce nom depuis votre défausse.",
      },
    ],
  },
  it: {
    name: "Le Tue Menzogne",
    text: [
      {
        title:
          "(Un personaggio con costo 6 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Nomina una carta. Riprendi in mano dai tuoi scarti tutte le carte personaggio con quel nome.",
      },
    ],
  },
};
