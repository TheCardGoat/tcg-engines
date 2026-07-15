import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const liShangNewlyPromotedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Li Shang",
    version: "Newly Promoted",
    text: [
      {
        title: "I WON'T LET YOU DOWN",
        description: "This character can challenge ready characters.",
      },
      {
        title: "BIG RESPONSIBILITY",
        description: "While this character is damaged, he gets +2 {S}.",
      },
    ],
  },
  de: {
    name: "Li Shang",
    version: "Frisch befördert",
    text: [
      {
        title: "Darauf könnt ihr euch verlassen",
        description: "Dieser Charakter kann bereite Charaktere herausfordern.",
      },
      {
        title: "Sehr viel Verantwortung",
        description: "Solange dieser Charakter beschädigt ist, erhält er +2 {S}.",
      },
    ],
  },
  fr: {
    name: "Li Shang",
    version: "Nouvellement promu",
    text: [
      {
        title: "Je ferai tout ce qui est en mon pouvoir",
        description: "Ce personnage peut défier des personnages redressés.",
      },
      {
        title: "Une énorme responsabilité",
        description: "Tant que ce personnage a au moins un dommage, il gagne +2 {S}.",
      },
    ],
  },
  it: {
    name: "Li Shang",
    version: "Appena Promosso",
    text: [
      {
        title: "Non Ti Deluderò",
        description: "Questo personaggio può sfidare i personaggi preparati.",
      },
      {
        title: "Enorme Responsabilità",
        description: "Mentre questo personaggio ha danno, riceve +2 {S}.",
      },
    ],
  },
};
