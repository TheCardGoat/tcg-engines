import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const i2iEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "I2I",
    text: [
      {
        title: "Sing Together 9",
        description:
          "(Any number of your or your teammates' characters with total cost 9 or more may {E} to sing this song for free.)",
      },
      {
        title:
          "Each player draws 2 cards and gains 2 lore. If 2 or more characters sang this song, ready them. They can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "I2I",
    text: [
      {
        title:
          "<Gemeinsam singen> 9 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 9 oder mehr kosten, {E}, damit sie dieses Lied kostenlos singen.)",
      },
      {
        title: "Alle Mitspielenden",
        description:
          "(auch du) ziehen je 2 Karten und sammeln 2 Legenden. Wenn 2 oder mehr deiner Charaktere dieses Lied gemeinsam gesungen haben, mache sie bereit. Sie können in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "I2I",
    text: [
      {
        title: "<À l'unisson> 9",
      },
      {
        title:
          "Chaque joueur pioche 2 cartes et gagne 2 éclats de Lore. Si 2 personnages ou plus ont chanté cette chanson, redressez-les. Ces personnages ne peuvent pas être envoyés à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "I2I",
    text: [
      {
        title:
          "<Cantare Insieme> 9 (Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 9 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Ogni giocatore pesca 2 carte e ottiene 2 leggenda. Se 2 o più personaggi hanno cantato questa canzone, preparali. Non possono andare all'avventura per il resto di questo turno.",
      },
    ],
  },
  es: {
    name: "I2I",
    text: [
      {
        title: "Cantar juntos 9",
        description:
          "(Cualquier número de personajes tuyos o de tus compañeros de equipo con un costo total de 9 o más puede {E} cantar esta canción gratis).",
      },
      {
        title:
          "Cada jugador roba 2 cartas y gana 2 conocimientos. Si 2 o más personajes cantaron esta canción, prepárelos. No pueden realizar misiones durante el resto de este turno.",
      },
    ],
  },
};
