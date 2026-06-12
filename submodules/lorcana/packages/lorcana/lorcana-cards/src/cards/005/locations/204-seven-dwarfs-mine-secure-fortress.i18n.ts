import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sevenDwarfsMineSecureFortressI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Seven Dwarfs' Mine",
    version: "Secure Fortress",
    text: [
      {
        title: "MOUNTAIN DEFENSE",
        description:
          "During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.",
      },
    ],
  },
  de: {
    name: "Mine der Sieben Zwerge",
    version: "Sicheres Bollwerk",
    text: [
      {
        title: "GEBIRGSVERTEIDIGUNG",
        description:
          "Jedes erste Mal, wenn einer deiner Charaktere in deinem Zug an diesen Ort bewegt wird, darfst du einem Charakter deiner Wahl 1 Schaden zufügen. Wenn du so einen Ritter bewegt hast, darfst du einem Charakter deiner Wahl stattdessen 2 Schaden zufügen.",
      },
    ],
  },
  fr: {
    name: "Mine des sept Nains",
    version: "Forteresse sécurisée",
    text: [
      {
        title: "DÉFENSE EN MONTAGNE",
        description:
          "Durant votre tour, la première fois que vous déplacez un personnage sur ce lieu, vous pouvez choisir un personnage et lui infliger 1 dommage. Si le personnage déplacé est un Chevalier, infligez 2 dommages à la place.",
      },
    ],
  },
  it: {
    name: "Miniera dei Sette Nani",
    version: "Fortezza Inespugnabile",
    text: [
      {
        title: "DIFESA MONTANA",
        description:
          "Durante il tuo turno, la prima volta che sposti un personaggio in questo luogo, puoi infliggere 1 danno a un personaggio a tua scelta. Se il personaggio spostato è un Cavaliere, infliggi invece 2 danni.",
      },
    ],
  },
};
