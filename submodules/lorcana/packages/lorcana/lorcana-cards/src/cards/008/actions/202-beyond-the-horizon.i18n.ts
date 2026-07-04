import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const beyondTheHorizonI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Beyond the Horizon",
    text: [
      {
        title: "Sing Together 7",
        description:
          "(Any number of your or your teammates' characters with total cost 7 or more may {E} to sing this song for free.)",
      },
      {
        title: "Choose any number of players. They discard their hands and draw 3 cards each.",
      },
    ],
  },
  de: {
    name: "Beyond the Horizon",
    text: [
      {
        title:
          "<Gemeinsam singen> 7 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 7 oder mehr kosten, {E}, damit sie dieses Lied kostenlos singen.)",
      },
      {
        title:
          "Wähle beliebig viele Personen aus. Sie werfen die Karten aus ihrer Hand ab und ziehen je 3 Karten.",
      },
    ],
  },
  fr: {
    name: "Beyond the Horizon",
    text: [
      {
        title:
          "<À l'unisson> 7 (Vous pouvez {E} n'importe quel nombre de vos personnages ou de personnages de vos coéquipiers coûtant au total 7 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez n'importe quel nombre de joueurs. Chaque joueur ainsi choisi défausse sa main puis pioche 3 cartes.",
      },
    ],
  },
  it: {
    name: "Beyond the Horizon",
    text: [
      {
        title:
          "<Cantare Insieme> 7 (Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 7 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Scegli un qualsiasi numero di giocatori. Ognuno di loro scarta la propria mano e pesca 3 carte.",
      },
    ],
  },
};
