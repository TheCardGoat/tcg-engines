import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const weKnowTheWayI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "We Know the Way",
    text: "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.",
  },
  de: {
    name: "Wir kennen den Weg",
    text: "Mische eine Karte deiner Wahl aus deinem Ablagestapel zurück in dein Deck. Decke die oberste Karte deines Decks auf. Falls sie den selben Namen hat, wie die gewählte Karte, darfst du sie kostenlos ausspielen. Falls nicht, nimm sie auf deine Hand.",
  },
  fr: {
    name: "L'explorateur",
    text: "Choisissez une carte de votre défausse et mélangez-la dans votre pioche. Révélez la carte du dessus de votre pioche. Si la carte révélée a le même nom que la carte choisie, vous pouvez la jouer gratuitement. Sinon, ajoutez-la à votre main.",
  },
  it: {
    name: "La Strada di Casa",
    text: "(Un personaggio con costo 3 o superiore può per cantare questa canzone gratis.) Rimescola nel tuo mazzo una carta a tua scelta dai tuoi scarti. Rivela la prima carta del tuo mazzo. Se ha lo stesso nome della carta scelta, puoi giocare la carta rivelata gratis. Altrimenti, aggiungila alla tua mano.",
  },
};
