import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const trampEnterprisingDogI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tramp",
    version: "Enterprising Dog",
    text: [
      {
        title: "HEY, PIDGE",
        description:
          "If you have a character named Lady in play, you pay 1 {I} less to play this character.",
      },
      {
        title: "NO TIME FOR WISECRACKS",
        description:
          "When you play this character, chosen character of yours gets +1 {S} this turn for each other character you have in play.",
      },
    ],
  },
  de: {
    name: "Strolch",
    version: "Unternehmungslustiger Hund",
    text: [
      {
        title: "HEY, TÄUBCHEN",
        description:
          "Wenn du einen Susi-Charakter im Spiel hast, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "LASST DIE ALBERNEN SPÄSSCHEN",
        description:
          "Wenn du diesen Charakter ausspielst, wähle einen deiner Charaktere und gib ihm in diesem Zug +1 für jeden deiner anderen Charaktere im Spiel.",
      },
    ],
  },
  fr: {
    name: "Clochard",
    version: "Chien entreprenant",
    text: [
      {
        title: "HÉ, BEAUTÉ",
        description:
          "Jouer ce personnage vous coûte 1 de moins si vous avez un personnage Lady en jeu.",
      },
      {
        title: "ON FERA DE L'HUMOUR UN AUTRE JOUR",
        description:
          "Lorsque vous jouez ce personnage, choisissez un de vos personnages qui gagne +1 ce tour-ci pour chaque autre personnage que vous avez en jeu.",
      },
    ],
  },
  it: {
    name: "Biagio",
    version: "Cane Intraprendente",
    text: [
      {
        title: "EHI, BIMBA",
        description:
          "Se hai in gioco un personaggio chiamato Lilli, paga 1 in meno per giocare questo personaggio.",
      },
      {
        title: "NON È IL MOMENTO DI FARE DELLO SPIRITO",
        description:
          "Quando giochi questo personaggio, un tuo personaggio a tua scelta riceve +1 per ogni altro personaggio che hai in gioco per questo turno.",
      },
    ],
  },
};
