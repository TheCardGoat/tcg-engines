import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fantasticalAndMagicalEnchantedI18n: Record<Languages, I18nProperties> = {
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
    text: [
      {
        title:
          "<Gemeinsam singen> 9 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 9 oder mehr kosten, {E}, damit sie dieses Lied kostenlos singen.)",
      },
      {
        title:
          "Für jeden Charakter, der dieses Lied gesungen hat, ziehe 1 Karte und sammle 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Miraculeux et merveilleux",
    text: [
      {
        title:
          "<À l'unisson> 9 (Vous pouvez {E} n'importe quel nombre de vos personnages ou de personnages de vos coéquipiers coûtant au total 9 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Pour chaque personnage ayant chanté cette chanson, piochez une carte et gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Fantastico e Magico",
    text: [
      {
        title:
          "<Cantare Insieme> 9 (Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 9 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Per ogni personaggio che ha cantato questa canzone, pesca una carta e ottieni 1 leggenda.",
      },
    ],
  },
  es: {
    name: "Fantástico y mágico",
    text: [
      {
        title: "Cantar juntos 9",
        description:
          "(Cualquier número de personajes tuyos o de tus compañeros de equipo con un costo total de 9 o más puede {E} cantar esta canción gratis).",
      },
      {
        title: "Por cada personaje que cantó esta canción, roba una carta y gana 1 conocimiento.",
      },
    ],
  },
};
