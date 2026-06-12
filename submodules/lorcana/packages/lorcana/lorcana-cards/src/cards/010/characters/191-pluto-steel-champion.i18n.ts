import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const plutoSteelChampionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pluto",
    version: "Steel Champion",
    text: [
      {
        title: "WINNER TAKE ALL",
        description:
          "During your turn, whenever one of your other Steel characters banishes another character in a challenge, gain 2 lore.",
      },
      {
        title: "MAKE ROOM",
        description: "Whenever you play another Steel character, you may banish chosen item.",
      },
    ],
  },
  de: {
    name: "Pluto",
    version: "Stahl-Champion",
    text: [
      {
        title: "DER SIEGER KRIEGT ALLES",
        description:
          "Jedes Mal während deines Zuges, wenn einer deiner anderen Stahl-Charaktere durch eine Herausforderung einen anderen Charakter verbannt, sammelst du 2 Legenden.",
      },
      {
        title: "PLATZ SCHAFFEN",
        description:
          "Jedes Mal, wenn du einen anderen Stahl-Charakter ausspielst, darfst du einen Gegenstand deiner Wahl verbannen.",
      },
    ],
  },
  fr: {
    name: "Pluto",
    version: "Champion Acier",
    text: [
      {
        title: "RAFLER LA MISE",
        description:
          "Durant votre tour, chaque fois que l'un de vos autres personnages Acier bannit un autre personnage via un défi, gagnez 2 éclats de Lore.",
      },
      {
        title: "FAIRE DE LA PLACE",
        description:
          "Chaque fois que vous jouez un autre personnage Acier, vous pouvez choisir un objet et le bannir.",
      },
    ],
  },
  it: {
    name: "Pluto",
    version: "Campione di Acciaio",
    text: [
      {
        title: "CHI VINCE PRENDE TUTTO",
        description:
          "Durante il tuo turno, ogni volta che uno dei tuoi altri personaggi Acciaio esilia un altro personaggio in una sfida, ottieni 2 leggenda.",
      },
      {
        title: "FARE SPAZIO",
        description:
          "Ogni volta che giochi un altro personaggio Acciaio, puoi esiliare un oggetto a tua scelta.",
      },
    ],
  },
};
