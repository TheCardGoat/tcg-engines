import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const calhounHardnosedLeaderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Calhoun",
    version: "Hard-Nosed Leader",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "LOOT DROP",
        description: "When this character is banished, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Sergeant Calhoun",
    version: "Knallharte Anführerin",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Beuteabwurf",
        description: "Wenn dieser Charakter verbannt wird, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Calhoun",
    version: "Meneuse intraitable",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Apparition de butin",
        description: "Lorsque ce personnage est banni, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Calhoun",
    version: "Leader Inflessibile",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Bottino di Gioco",
        description: "Quando questo personaggio viene esiliato, ottieni 1 leggenda.",
      },
    ],
  },
};
