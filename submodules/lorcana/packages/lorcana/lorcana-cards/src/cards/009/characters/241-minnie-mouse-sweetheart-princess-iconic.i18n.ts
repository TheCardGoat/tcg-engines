import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const minnieMouseSweetheartPrincessIconicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Minnie Mouse",
    version: "Sweetheart Princess",
    text: [
      {
        title: "ROYAL FAVOR",
        description:
          "Your characters named Mickey Mouse gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
      },
      {
        title: "BYE BYE, NOW",
        description:
          "Whenever this character quests, you may banish chosen exerted character with 5 {S} or more.",
      },
    ],
  },
  de: {
    name: "Minnie Maus",
    version: "Geliebte Prinzessin",
    text: [
      {
        title: "Königliche Gunst",
        description:
          "Deine Micky-Maus-Charaktere erhalten <Unterstützen>. (Jedes Mal, wenn die Charaktere erkunden, darfst du ihre {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Mach's gut, jetzt",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du einen erschöpften Charakter deiner Wahl mit 5 oder mehr {S} verbannen.",
      },
    ],
  },
  fr: {
    name: "Minnie",
    version: "Adorable princesse",
    text: [
      {
        title: "Faveur royale",
        description: "Vos personnages nommés Mickey Mouse gagnent <Soutien>.",
      },
      {
        title: "Allez, au revoir!",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez choisir un personnage épuisé ayant 5 {S} ou plus et le bannir.",
      },
    ],
  },
  it: {
    name: "Minni",
    version: "Dolce Principessa",
    text: [
      {
        title: "Favore Reale",
        description: "I tuoi personaggi chiamati Topolino ottengono <Aiutante>.",
      },
      {
        title: "Addio, per Ora",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi esiliare un personaggio impegnato a tua scelta con 5 {S} o superiore.",
      },
    ],
  },
};
