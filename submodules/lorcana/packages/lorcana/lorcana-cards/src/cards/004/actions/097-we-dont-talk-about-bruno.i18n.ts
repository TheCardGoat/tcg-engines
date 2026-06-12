import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const weDontTalkAboutBrunoI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "We Don’t Talk About Bruno",
    text: "Return chosen character to their player's hand, then that player discards a card at random.",
  },
  de: {
    name: "Nur kein Wort über Bruno",
    text: "Schicke einen Charakter deiner Wahl auf die zugehörige Hand zurück, danach muss diese Person eine zufällig ausgewählte Karte von ihrer Hand abwerfen.",
  },
  fr: {
    name: "Ne parlons pas de Bruno",
    text: "Choisissez un personnage et renvoyez-le dans la main de son propriétaire. Puis, ce joueur doit défausser une carte au hasard de sa main.",
  },
  it: {
    name: "Non Si Nomina Bruno",
    text: "(Un personaggio con costo 5 o superiore può per cantare questa canzone gratis.) Fai ripendere in mano al suo giocatore un personaggio a tua scelta, poi quel giocatore scarta una carta a caso.",
  },
};
