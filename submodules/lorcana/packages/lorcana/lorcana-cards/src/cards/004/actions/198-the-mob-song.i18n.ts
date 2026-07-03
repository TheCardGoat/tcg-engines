import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theMobSongI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Mob Song",
    text: [
      {
        title: "Sing Together 10",
        description:
          "(Any number of your or your teammates' characters with total cost 10 or more may {E} to sing this song for free.)",
      },
      {
        title: "Deal 3 damage to up to 3 chosen characters and/or locations.",
      },
    ],
  },
  de: {
    name: "Tod dem Biest",
    text: [
      {
        title:
          "<Gemeinsam singen> 10 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 10 oder mehr kosten, {E}, damit sie dieses Lied kostenlos singen.)",
      },
      {
        title: "Wähle bis zu 3 Charaktere und/oder Orte und füge jedem davon 3 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Tous avec moi !",
    text: [
      {
        title:
          "<À l'unisson> 10 (Vous pouvez {E} n'importe quel nombre de vos personnages ou de personnages de vos coéquipiers coûtant au total 10 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Choisissez jusqu'à 3 personnages et/ou lieux et infligez-leur 3 dommages chacun.",
      },
    ],
  },
  it: {
    name: "Attacco al Castello",
    text: [
      {
        title:
          "<Cantare Insieme> 10 (Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 10 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Infliggi 3 danni a fino a 3 personaggi e/o luoghi a tua scelta.",
      },
    ],
  },
};
