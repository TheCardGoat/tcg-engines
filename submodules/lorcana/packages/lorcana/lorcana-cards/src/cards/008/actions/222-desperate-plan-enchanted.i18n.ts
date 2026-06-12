import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const desperatePlanEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Desperate Plan",
    text: "If you have no cards in your hand, draw until you have 3 cards in your hand. Otherwise, choose and discard any number of cards, then draw that many cards.",
  },
  de: {
    name: "Verzweifelter Plan",
    text: "Falls du keine Karten auf der Hand hast, ziehe so viele Karten, bis du 3 Karten auf deiner Hand hast. Andernfalls, wähle eine beliebige Anzahl an Karten von deiner Hand aus und wirf sie ab, um dieselbe Anzahl an Karten zu ziehen.",
  },
  fr: {
    name: "Plan désespéré",
    text: "Si vous n'avez aucune carte en main, piochez jusqu'à avoir 3 cartes en main. Sinon, défaussez n'importe quel nombre de cartes et piochez-en autant.",
  },
  it: {
    name: "Piano Disperato",
    text: "Se non hai carte in mano, pesca finché non hai 3 carte in mano. Altrimenti, scegli e scarta un qualsiasi numero di carte, poi pesca altrettante carte.",
  },
};
