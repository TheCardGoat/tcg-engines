import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peopleGonnaComeHereI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "People Gonna Come Here",
    text: "Play a location from your hand or discard for free. If a character sang this song, you may move them to that location for free.",
  },
  de: {
    name: "Alle kommen dann bei mir zusammen",
    text: "Spiele einen Ort aus deiner Hand oder deinem Ablagestapel kostenlos aus. Falls ein Charakter dieses Lied gesungen hat, darfst du ihn kostenlos zu jenem Ort bewegen.",
  },
  fr: {
    name: "Je travaillerai sans trêve",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 7 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Jouez gratuitement un lieu de votre main ou de votre défausse. Si un personnage a chanté cette chanson, vous pouvez le déplacer gratuitement sur ce lieu.",
      },
    ],
  },
  it: {
    name: "L'Unica Cosa Che Ora So",
    text: [
      {
        title:
          "(Un personaggio con costo 7 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Gioca un luogo dalla tua mano o dai tuoi scarti gratis. Se un personaggio ha cantato questa canzone, puoi spostarlo in quel luogo gratis.",
      },
    ],
  },
  es: {
    name: "People Gonna Come Here",
    text: "Play a location from your hand or discard for free. If a character sang this song, you may move them to that location for free.",
  },
};
