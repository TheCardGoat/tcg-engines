import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const merlinCleverClairvoyantI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Merlin",
    version: "Clever Clairvoyant",
    text: [
      {
        title: "PRESTIDIGITONIUM",
        description:
          "Whenever this character quests, name a card, then reveal the top card of your deck. If it's the named card, put it into your inkwell facedown and exerted. Otherwise, put it on the top of your deck.",
      },
    ],
  },
  de: {
    name: "Merlin",
    version: "Kluger Hellseher",
    text: [
      {
        title: "PRESTODIGITONIUM",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, benenne eine Karte und decke danach die oberste Karte deines Decks auf. Falls es die benannte Karte ist, darfst du jene verdeckt und erschöpft in deinen Tintenvorrat legen. Falls nicht, lege sie zurück auf dein Deck.",
      },
    ],
  },
  fr: {
    name: "Merlin",
    version: "Enchanteur clairvoyant",
    text: [
      {
        title: "PRESTIDIGITONIUM",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, nommez une carte et révélez la carte du dessus de votre pioche. S'il s'agit de la carte nommée, placez-la dans votre réserve d'encre, face cachée et épuisée. Sinon, replacez-la sur votre pioche.",
      },
    ],
  },
  it: {
    name: "Merlino",
    version: "Chiaroveggente Brillante",
    text: [
      {
        title: "PRESTIDIGITORIUM",
        description:
          "Ogni volta che questo personaggio va all'avventura, nomina una carta, poi rivela la prima carta del tuo mazzo. Se è la carta nominata, aggiungila al tuo calamaio, a faccia in giù e impegnata. Altrimenti, mettila in cima al tuo mazzo.",
      },
    ],
  },
};
