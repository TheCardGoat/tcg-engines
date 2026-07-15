import type { CharacterCard } from "@tcg/lorcana-types";
import { evasive } from "../../../helpers/abilities/evasive";
import { shift } from "../../../helpers/abilities/shift";
import { dashParrSuperFastI18n } from "./109-dash-parr-super-fast.i18n";

export const dashParrSuperFast: CharacterCard = {
  id: "S3p",
  canonicalId: "ci_S3p",
  slug: "lorcana-ci_S3p",
  printings: [
    {
      id: "set13-109",
      artId: "set13-109",
      setCode: "set13",
      collectorNumber: "109",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-109"],
  cardType: "character",
  name: "Dash Parr",
  version: "Super Fast",
  inkType: ["ruby"],
  franchise: "Incredibles",
  set: "013",
  cardNumber: 109,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "Evasive",
    },
    {
      title: "Follow Me!",
      description:
        "Whenever this character quests, you may reveal the top card of your deck. If you do, you may play it. Otherwise, put it into your discard. (You pay all costs.)",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [
    shift("Dash Parr", 3),
    evasive,
    {
      type: "triggered",
      name: "FOLLOW ME!",
      text: "FOLLOW ME! Whenever this character quests, you may reveal the top card of your deck. If you do, you may play it. Otherwise, put it into your discard. (You pay all costs.)",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "reveal-top-card",
              target: "CONTROLLER",
            },
            {
              type: "or",
              chooser: "CONTROLLER",
              options: [
                {
                  type: "play-card",
                  from: "revealed",
                  target: "CONTROLLER",
                },
                {
                  type: "mill",
                  amount: 1,
                  target: "CONTROLLER",
                },
              ],
            },
          ],
        },
      },
    },
  ],
  i18n: dashParrSuperFastI18n,
};
