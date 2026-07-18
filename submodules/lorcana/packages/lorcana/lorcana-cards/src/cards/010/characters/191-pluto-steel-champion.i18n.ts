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
        title: "Der Sieger kriegt alles",
        description:
          "Jedes Mal während deines Zuges, wenn einer deiner anderen Stahl-Charaktere durch eine Herausforderung einen anderen Charakter verbannt, sammelst du 2 Legenden.",
      },
      {
        title: "Platz schaffen",
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
        title: "Rafler la mise",
        description:
          "Durant votre tour, chaque fois que l'un de vos autres personnages Acier bannit un autre personnage via un défi, gagnez 2 éclats de Lore.",
      },
      {
        title: "Faire de la place",
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
        title: "Chi Vince Prende Tutto",
        description:
          "Durante il tuo turno, ogni volta che uno dei tuoi altri personaggi Acciaio esilia un altro personaggio in una sfida, ottieni 2 leggenda.",
      },
      {
        title: "Fare Spazio",
        description:
          "Ogni volta che giochi un altro personaggio Acciaio, puoi esiliare un oggetto a tua scelta.",
      },
    ],
  },
  es: {
    name: "Plutón",
    version: "Campeón de acero",
    text: [
      {
        title: "EL GANADOR SE LO LLEVA TODO",
        description:
          "Durante tu turno, cada vez que uno de tus otros personajes de Steel destierre a otro personaje en un desafío, gana 2 conocimientos.",
      },
      {
        title: "HACER ESPACIO",
        description:
          "Siempre que juegues con otro personaje de Steel, podrás desterrar el objeto elegido.",
      },
    ],
  },
};
