import type { CharacterCard } from "@tcg/lorcana-types";
import { brunoMadrigalUndetectedUncleI18n } from "./000-bruno-madrigal-undetected-uncle.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const brunoMadrigalUndetectedUncle: CharacterCard = {
  id: "gZa",
  canonicalId: "ci_gZa",
  slug: "lorcana-ci_gZa",
  printings: [
    {
      id: "set9-000",
      artId: "set9-000",
      setCode: "set9",
      collectorNumber: "0",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set4-d23-004", "set4-039", "set9-000"],
  cardType: "character",
  name: "Bruno Madrigal",
  version: "Undetected Uncle",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "009",
  cardNumber: 0,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2cbda843e29c4e6392ccddd6858eeb7d",
    tcgPlayer: "651127",
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "YOU JUST HAVE TO SEE IT",
      description:
        "{E} — Name a card, then reveal the top card of your deck. If it's the named card, put it into your hand and gain 3 lore. Otherwise, put it on the top of your deck.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [
    evasive,
    {
      cost: {
        exert: true,
      },
      effect: {
        type: "sequence",
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
                destination: { zone: "hand" },
                sideEffects: [
                  {
                    type: "gain-lore",
                    amount: 3,
                    target: "CONTROLLER",
                  },
                ],
              },
            ],
            fallback: { zone: "deck-top" },
          },
        ],
      },
      id: "13f-2",
      name: "YOU JUST HAVE TO SEE IT",
      text: "YOU JUST HAVE TO SEE IT {E} — Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand and gain 3 lore. Otherwise, put it on the top of your deck.",
      type: "activated",
    },
  ],
  i18n: brunoMadrigalUndetectedUncleI18n,
};
