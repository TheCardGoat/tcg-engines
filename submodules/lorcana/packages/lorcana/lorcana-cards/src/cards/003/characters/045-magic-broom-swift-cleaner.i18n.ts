import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicBroomSwiftCleanerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magic Broom",
    version: "Swift Cleaner",
    text: [
      {
        title: "Rush",
      },
      {
        title: "CLEAN THIS, CLEAN THAT",
        description:
          "When you play this character, you may shuffle all Broom cards from your discard into your deck.",
      },
    ],
  },
  de: {
    name: "Zauberbesen",
    version: "Rasanter Saubermacher",
    text: [
      {
        title: "<Rasant>",
      },
      {
        title: "Reinige dies, putze das",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du alle Besen aus deinem Ablagestapel zurück in dein Deck mischen.",
      },
    ],
  },
  fr: {
    name: "Balais magiques",
    version: "Nettoyeur rapide",
    text: [
      {
        title: "<Charge>",
      },
      {
        title: "Nettoie ceci, nettoie cela",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez remélanger toutes les cartes Balai de votre défausse dans votre pioche.",
      },
    ],
  },
  it: {
    name: "Scopa Magica",
    version: "Pulitore Rapido",
    text: [
      {
        title: "<Lesto> (Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
      {
        title: "Pulisci Questo, Pulisci Quello",
        description:
          "Quando giochi questo personaggio, puoi rimescolare nel tuo mazzo tutte le carte Scopa presenti nei tuoi scarti.",
      },
    ],
  },
};
