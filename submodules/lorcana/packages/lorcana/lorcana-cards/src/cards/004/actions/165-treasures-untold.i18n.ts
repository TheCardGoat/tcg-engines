import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const treasuresUntoldI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Treasures Untold",
    text: "Return up to 2 item cards from your discard into your hand.",
  },
  de: {
    name: "Schätze und Zeug",
    text: "Nimm bis zu 2 Gegenstandskarten aus deinem Ablagestapel zurück auf deine Hand.",
  },
  fr: {
    name: "Tous ces Secrets",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 6 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Reprenez en main jusqu'à 2 cartes Objet de votre défausse.",
      },
    ],
  },
  it: {
    name: "Che Ricchezze",
    text: [
      {
        title:
          "(Un personaggio con costo 6 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Riprendi in mano fino a 2 carte oggetto dai tuoi scarti.",
      },
    ],
  },
  es: {
    name: "Tesoros no contados",
    text: "Devuelve a tu mano hasta 2 cartas de objetos de tu descarte.",
  },
};
