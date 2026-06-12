import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const belleMechanicExtraordinaireEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Belle",
    version: "Mechanic Extraordinaire",
    text: [
      {
        title: "Shift 7",
      },
      {
        title: "SALVAGE",
        description:
          "For each item card in your discard, you pay 1 {I} less to play this character using her Shift ability.",
      },
      {
        title: "REPURPOSE",
        description:
          "Whenever this character quests, you may put up to 3 item cards from your discard on the bottom of your deck to gain 1 lore for each item card moved this way.",
      },
    ],
  },
  de: {
    name: "Belle",
    version: "Mechanikerin der Extraklasse",
    text: [
      {
        title: "Gestaltwandel 7",
      },
      {
        title: "BERGUNG",
        description:
          "Die Gestaltwandel-Kosten dieses Charakters reduzieren sich für jede Gegenstandskarte in deinem Ablagestapel um 1.",
      },
      {
        title: "WIEDERVERWENDUNG",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du bis zu 3 Gegenstandskarten aus deinem Ablagestapel unter dein Deck legen, um für jede so bewegte Karte 1 Legende zu sammeln.",
      },
    ],
  },
  fr: {
    name: "Belle",
    version: "Mécanicienne extraordinaire",
    text: [
      {
        title: "Alter 7",
      },
      {
        title: "RÉCUPÉRATION",
        description:
          "Jouer ce personnage en utilisant sa capacité Alter vous coûte 1 de moins pour chaque carte Objet dans votre défausse.",
      },
      {
        title: "RECYCLAGE",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez placer jusqu'à 3 cartes Objet de votre défausse sous votre pioche pour gagner 1 éclat de Lore par carte placée ainsi.",
      },
    ],
  },
  it: {
    name: "Belle",
    version: "Meccanica Straordinaria",
    text: [
      {
        title: "Trasformazione 7",
      },
      {
        title: "RECUPERARE",
        description:
          "Per ogni carta oggetto nei tuoi scarti, paga 1 in meno per giocare questo personaggio usando la sua abilità Trasformazione.",
      },
      {
        title: "CONVERTIRE",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi mettere fino a 3 carte oggetto dai tuoi scarti in fondo al tuo mazzo per ottenere 1 leggenda per ogni carta oggetto spostata in questo modo.",
      },
    ],
  },
};
