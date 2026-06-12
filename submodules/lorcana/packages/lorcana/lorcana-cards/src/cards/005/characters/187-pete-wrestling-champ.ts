import type { CharacterCard } from "@tcg/lorcana-types";
import { peteWrestlingChampI18n } from "./187-pete-wrestling-champ.i18n";

export const peteWrestlingChamp: CharacterCard = {
  id: "tEN",
  canonicalId: "ci_tEN",
  reprints: ["set5-187"],
  cardType: "character",
  name: "Pete",
  version: "Wrestling Champ",
  inkType: ["steel"],
  set: "005",
  cardNumber: 187,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_77a41111eb054ad3acd73de5f7f800e7",
    tcgPlayer: 559085,
  },
  text: [
    {
      title: "RE-PETE",
      description:
        "{E} — Reveal the top card of your deck. If it's a character card named Pete, you may play it for free.",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        type: "reveal-and-route",
        target: "CONTROLLER",
        routes: [
          {
            condition: {
              type: "revealed-is-character-named",
              name: "Pete",
            },
            destination: { zone: "play", cost: "free" },
            optional: true,
          },
        ],
        fallback: { zone: "deck-top" },
      },
      id: "pvv-1",
      name: "RE-PETE",
      text: "RE-PETE {E} - Reveal the top card of your deck. If it's a character card named Pete, you may play it for free.",
      type: "activated",
    },
  ],
  i18n: peteWrestlingChampI18n,
};
