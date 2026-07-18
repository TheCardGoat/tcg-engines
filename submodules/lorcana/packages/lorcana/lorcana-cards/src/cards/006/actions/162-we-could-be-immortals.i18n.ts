import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const weCouldBeImmortalsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "We Could Be Immortals",
    text: "Your Inventor characters gain Resist +6 this turn. Then, put this card into your inkwell facedown and exerted.",
  },
  de: {
    name: "We Could Be Immortals",
    text: "Deine Erfinder erhalten in diesem Zug <Robust> +6. Danach lege diese Karte verdeckt und erschöpft in deinen Tintenvorrat. (Reduziere jeglichen Schaden, der den Charakteren zugefügt wird, um 6.)",
  },
  fr: {
    name: "We Could Be Immortals",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 4 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Vos personnages Inventeur gagnent <Résistance> +6 pour le reste de ce tour. Ensuite, placez cette carte dans votre réserve d'encre, face cachée et épuisée.",
      },
    ],
  },
  it: {
    name: "Saremo Immortali",
    text: [
      {
        title:
          "(Un personaggio con costo 4 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "I tuoi personaggi Inventore ottengono <Resistere> +6 per questo turno. Poi aggiungi questa carta al tuo calamaio, a faccia in giù e impegnata.",
      },
    ],
  },
  es: {
    name: "Podríamos ser inmortales",
    text: "Tus personajes Inventor obtienen Resistencia +6 este turno. Luego, coloca esta carta en tu tintero boca abajo y ejerce presión.",
  },
};
