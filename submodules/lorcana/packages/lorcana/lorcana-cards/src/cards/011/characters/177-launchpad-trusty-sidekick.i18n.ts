import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const launchpadTrustySidekickI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Launchpad",
    version: "Trusty Sidekick",
    text: [
      {
        title: "WHAT DID YOU NEED?",
        description:
          "{E} — Draw a card. Then, choose and discard a card unless you have a character named Darkwing Duck in play.",
      },
    ],
  },
  de: {
    name: "Quack, der Bruchpilot",
    version: "Treuer Handlanger",
    text: [
      {
        title: "WAS HAST DU",
        description:
          "BENÖTIGT? — Ziehe 1 Karte. Wähle danach 1 Karte aus deiner Hand und wirf sie ab, außer du hast einen Darkwing-Duck-Charakter im Spiel.",
      },
    ],
  },
  fr: {
    name: "Flagada Jones",
    version: "Assistant de confiance",
    text: [
      {
        title: "DE QUOI AVIEZ-VOUS BESOIN?",
        description:
          "— Piochez une carte. Ensuite, défaussez une carte sauf si vous avez un personnage Myster Mask en jeu.",
      },
    ],
  },
  it: {
    name: "Jet",
    version: "Fido Assistente",
    text: [
      {
        title: "DI COSA AVEVI BISOGNO?",
        description:
          "— Pesca una carta. Poi, scegli e scarta una carta a meno che tu non abbia in gioco un personaggio chiamato Darkwing Duck.",
      },
    ],
  },
};
