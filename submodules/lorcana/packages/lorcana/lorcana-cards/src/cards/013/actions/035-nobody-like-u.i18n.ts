import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const nobodyLikeUI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Nobody Like U",
    text: [
      {
        title: "Sing Together 5",
        description:
          "(Any number of your or your teammates' characters with total cost 5 or more may exert to sing this song for free.)",
      },
      {
        title: "Play a character with cost 4 of less for free.",
      },
    ],
  },
  de: {
    name: "Nobody Like U",
    text: [
      {
        title:
          "<Gemeinsam singen> 5 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 5 oder mehr kosten, {E}, damit sie dieses Lied kostenlos singen.)",
      },
      {
        title: "Spiele einen Charakter, der 4 oder weniger kostet, kostenlos aus.",
      },
    ],
  },
  fr: {
    name: "Nobody Like U",
    text: [
      {
        title:
          "<À l'unisson> 5 (Vous pouvez {E} n'importe quel nombre de vos personnages ou de personnages de vos coéquipiers coûtant au total 5 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Jouez gratuitement un personnage coûtant 4 ou moins.",
      },
    ],
  },
  it: {
    name: "Nobody Like U",
    text: [
      {
        title:
          "<Cantare Insieme> 5 (Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 5 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Gioca un personaggio con costo 4 o inferiore gratis.",
      },
    ],
  },
};
