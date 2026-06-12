import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseMusketeerCaptainI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Musketeer Captain",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "Bodyguard, Support",
      },
      {
        title: "MUSKETEERS UNITED",
        description:
          "When you play this character, if you used Shift to play him, you may draw a card for each character with Bodyguard you have in play.",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Kapitän der Musketiere",
    text: [
      {
        title: "Gestaltwandel 5",
      },
      {
        title:
          "Beschützen, Unterstützen MUSKETIERE VEREINT Falls du Gestaltwandel benutzt hast, um diesen Charakter auszuspielen, darfst du für jeden deiner Charaktere mit Beschützen im Spiel 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Capitaine Mousquetaire",
    text: [
      {
        title: "Alter 5",
      },
      {
        title:
          "Rempart, Soutien MOUSQUETAIRES UNIS Si vous jouez ce personnage en utilisant sa capacité Alter, vous pouvez piocher une carte pour chaque personnage avec Rempart que vous avez en jeu.",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Capitano Moschettiere",
    text: [
      {
        title: "Trasformazione 5",
      },
      {
        title:
          "Guardiano, Aiutante MOSCHETTIERI UNITI Quando giochi questo personaggio, se hai usato Trasformazione per giocarlo, puoi pescare una carta per ogni personaggio con Guardiano che hai in gioco.",
      },
    ],
  },
};
