import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aPiratesLifeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "A Pirate’s Life",
    text: [
      {
        title:
          "<Sing Together> 6 (Any number of your or your teammates' characters with total cost 6 or more may {E} to sing this song for free.)",
      },
      {
        title: "Each opponent loses 2 lore. You gain 2 lore.",
      },
    ],
  },
  de: {
    name: "Seeräuberleben",
    text: [
      {
        title:
          "<Gemeinsam singen> 6 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 6 oder mehr kosten, {E}, damit sie dieses Lied kostenlos singen.)",
      },
      {
        title: "Alle gegnerischen Mitspielenden verlieren je 2 Legenden. Du sammelst 2 Legenden.",
      },
    ],
  },
  fr: {
    name: "La vie d'un pirate",
    text: [
      {
        title:
          "<À l'unisson> 6 (Vous pouvez {E} n'importe quel nombre de vos personnages ou de personnages de vos coéquipiers coûtant au total 6 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Chaque adversaire perd 2 éclats de Lore et vous gagnez 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "La Vita del Bucanier",
    text: [
      {
        title:
          "<Cantare Insieme> 6 (Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 6 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Ogni avversario perde 2 leggenda. Tu ottieni 2 leggenda.",
      },
    ],
  },
};
