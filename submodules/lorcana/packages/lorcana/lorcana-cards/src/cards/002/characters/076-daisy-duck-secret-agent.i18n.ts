import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const daisyDuckSecretAgentI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Daisy Duck",
    version: "Secret Agent",
    text: [
      {
        title: "THWART",
        description: "Whenever this character quests, each opponent chooses and discards a card.",
      },
    ],
  },
  de: {
    name: "Daisy Duck",
    version: "Geheimagentin",
    text: [
      {
        title: "SABOTIEREN",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, wählen alle gegnerischen Mitspielenden je 1 Karte aus ihrer Hand und werfen diese ab.",
      },
    ],
  },
  fr: {
    name: "Daisy",
    version: "Agente secrète",
    text: [
      {
        title: "DÉJOUER",
        description:
          "Lorsque ce personnage est envoyé à l'aventure, chaque adversaire choisit une carte et la défausse.",
      },
    ],
  },
  it: {
    name: "Daisy Duck",
    version: "Secret Agent",
    text: [
      {
        title: "THWART",
        description: "Whenever this character quests, each opponent chooses and discards a card.",
      },
    ],
  },
};
