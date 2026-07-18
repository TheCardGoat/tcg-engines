import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const trampEnterprisingDogEnchantedI18n: Record<Languages, I18nProperties> = {
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
        title: "Hey, Täubchen",
        description:
          "Wenn du einen Susi-Charakter im Spiel hast, zahlst du 1 {I} weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "Lasst die albernen Spässchen",
        description:
          "Wenn du diesen Charakter ausspielst, wähle einen deiner Charaktere und gib ihm in diesem Zug +1 {S} für jeden deiner anderen Charaktere im Spiel.",
      },
    ],
  },
  fr: {
    name: "Clochard",
    version: "Chien entreprenant",
    text: [
      {
        title: "Hé, beauté",
        description:
          "Jouer ce personnage vous coûte 1 {I} de moins si vous avez un personnage Lady en jeu.",
      },
      {
        title: "On fera de l'humour un autre jour",
        description:
          "Lorsque vous jouez ce personnage, choisissez un de vos personnages qui gagne +1 {S} ce tour-ci pour chaque autre personnage que vous avez en jeu.",
      },
    ],
  },
  it: {
    name: "Biagio",
    version: "Cane Intraprendente",
    text: [
      {
        title: "Ehi, Bimba",
        description:
          "Se hai in gioco un personaggio chiamato Lilli, paga 1 {I} in meno per giocare questo personaggio.",
      },
      {
        title: "Non È il Momento di Fare dello Spirito",
        description:
          "Quando giochi questo personaggio, un tuo personaggio a tua scelta riceve +1 {S} per ogni altro personaggio che hai in gioco per questo turno.",
      },
    ],
  },
  es: {
    name: "Vagabundo",
    version: "Perro emprendedor",
    text: [
      {
        title: "Oye, PIDGE",
        description:
          "Si tienes un personaje llamado Lady en juego, pagas 1 {I} menos para interpretar a este personaje.",
      },
      {
        title: "NO HAY TIEMPO PARA GRISES",
        description:
          "Cuando juegas con este personaje, tu personaje elegido obtiene +1 {S} este turno por cada otro personaje que tengas en juego.",
      },
    ],
  },
};
