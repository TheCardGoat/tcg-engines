import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fantasticalAndMagicalI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Fantastical and Magical",
    text: [
      {
        title: "Sing Together 9",
        description:
          "(Any number of your or your teammates' characters with total cost 9 or more may {E} to sing this song for free.)",
      },
      {
        title: "For each character that sang this song, draw a card and gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Fantastisch und auch magisch",
    text: "Gemeinsam singen 9 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 9 oder mehr kosten,, damit sie dieses Lied kostenlos singen.) Für jeden Charakter, der dieses Lied gesungen hat, ziehe 1 Karte und sammle 1 Legende.",
  },
  fr: {
    name: "Miraculeux et merveilleux",
    text: "À l'unisson 9 (Vous pouvez n'importe quel nombre de vos personnages ou de personnages de vos coéquipiers coûtant au total 9 ou plus pour chanter cette chanson gratuitement.) Pour chaque personnage ayant chanté cette chanson, piochez une carte et gagnez 1 éclat de Lore.",
  },
  it: {
    name: "Fantastico e Magico",
    text: [
      {
        title: "Cantare Insieme 9",
        description:
          "(Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 9 o superiore può per cantare questa canzone gratis.) Per ogni personaggio che ha cantato questa canzone, pesca una carta e ottieni 1 leggenda.",
      },
    ],
  },
};
