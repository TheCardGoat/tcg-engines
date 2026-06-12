import type { CharacterCard } from "@tcg/lorcana-types";
import { merlinCleverClairvoyantI18n } from "./067-merlin-clever-clairvoyant.i18n";

export const merlinCleverClairvoyant: CharacterCard = {
  id: "qhP",
  canonicalId: "ci_qhP",
  reprints: ["set7-067"],
  cardType: "character",
  name: "Merlin",
  version: "Clever Clairvoyant",
  inkType: ["amethyst", "sapphire"],
  franchise: "Sword in the Stone",
  set: "007",
  cardNumber: 67,
  rarity: "rare",
  cost: 1,
  strength: 0,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1acf47f176fd481791f5e79e900fefe6",
    tcgPlayer: 618318,
  },
  text: [
    {
      title: "PRESTIDIGITONIUM",
      description:
        "Whenever this character quests, name a card, then reveal the top card of your deck. If it's the named card, put it into your inkwell facedown and exerted. Otherwise, put it on the top of your deck.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  abilities: [
    {
      id: "1c1-1",
      text: "PRESTIDIGITONIUM Whenever this character quests, name a card, then reveal the top card of your deck. If it's the named card, put it into your inkwell facedown and exerted. Otherwise, put it on the top of your deck.",
      name: "PRESTIDIGITONIUM",
      effect: {
        steps: [
          {
            type: "name-a-card",
          },
          {
            type: "reveal-and-route",
            target: "CONTROLLER",
            routes: [
              {
                condition: { type: "revealed-matches-named" },
                destination: { zone: "inkwell", exerted: true },
              },
            ],
            fallback: { zone: "deck-top" },
          },
        ],
        type: "sequence",
      },
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: merlinCleverClairvoyantI18n,
};
