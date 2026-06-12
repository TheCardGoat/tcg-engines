import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chernabogEvildoerEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chernabog",
    version: "Evildoer",
    text: [
      {
        title: "THE POWER OF EVIL",
        description:
          "For each character card in your discard, you pay 1 {I} less to play this character.",
      },
      {
        title: "SUMMON THE SPIRITS",
        description:
          "When you play this character, shuffle all character cards from your discard into your deck.",
      },
    ],
  },
  de: {
    name: "Chernabog",
    version: "Übeltäter",
    text: [
      {
        title: "DIE MACHT DES BÖSEN",
        description:
          "Für jede Charakterkarte in deinem Ablagestapel zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "DIE GEISTER BESCHWÖREN",
        description:
          "Wenn du diesen Charakter ausspielst, mische alle Charakterkarten aus deinem Ablagestapel zurück in dein Deck.",
      },
    ],
  },
  fr: {
    name: "Chernabog",
    version: "Répand le mal",
    text: [
      {
        title: "LE POUVOIR DU MAL",
        description:
          "Ce personnage vous coûte 1 de moins pour chaque carte Personnage dans votre défausse.",
      },
      {
        title: "INVOCATION DES ESPRITS",
        description:
          "Lorsque vous jouez ce personnage, remettez tous les personnages de votre défausse dans votre pioche, puis mélangez-la.",
      },
    ],
  },
  it: {
    name: "Chernabog",
    version: "Maligno",
    text: [
      {
        title: "IL POTERE DEL MALE",
        description:
          "Per ogni carta personaggio nei tuoi scarti, paga 1 in meno per giocare questo personaggio.",
      },
      {
        title: "EVOCARE GLI SPIRITI",
        description:
          "Quando giochi questo personaggio, rimescola nel tuo mazzo tutte le carte personaggio nei tuoi scarti.",
      },
    ],
  },
};
