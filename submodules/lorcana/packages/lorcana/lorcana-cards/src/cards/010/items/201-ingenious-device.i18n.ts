import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ingeniousDeviceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ingenious Device",
    text: [
      {
        title: "SURPRISE PACKAGE",
        description: "{E}, 2 {I}, Banish this item — Draw a card, then choose and discard a card.",
      },
      {
        title: "TIME GROWS SHORT",
        description:
          "During your turn, when this item is banished, deal 3 damage to chosen character or location.",
      },
    ],
  },
  de: {
    name: "Kunstvoller Apparat",
    text: [
      {
        title: "Überraschung",
        description:
          "{E}, 2 {I}, Verbanne diesen Gegenstand — Ziehe 1 Karte. Wähle danach 1 Karte aus deiner Hand und wirf sie ab.",
      },
      {
        title: "Die Zeit wird knapp",
        description:
          "Wenn dieser Gegenstand in deinem Zug verbannt wird, füge einem Charakter oder Ort deiner Wahl 3 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Mécanisme très ingénieux",
    text: [
      {
        title: "Un genre de paquet surprise",
        description: "{E}, 2 {I}, Bannissez cet objet — Piochez une carte puis défaussez-en une.",
      },
      {
        title: "Comme le temps passe",
        description:
          "Durant votre tour, lorsque cet objet est banni, choisissez un personnage ou un lieu et infligez-lui 3 dommages.",
      },
    ],
  },
  it: {
    name: "Ingegnoso Ordigno",
    text: [
      {
        title: "Souvenir",
        description:
          "{E}, 2 {I}, esilia questo oggetto — Pesca una carta, poi scegli e scarta una carta.",
      },
      {
        title: "Il Tempo Vola",
        description:
          "Durante il tuo turno, quando questo oggetto viene esiliato, infliggi 3 danni a un personaggio o a un luogo a tua scelta.",
      },
    ],
  },
};
