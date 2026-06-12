import type { CharacterCard } from "@tcg/lorcana-types";
import { iagoFakeFlamingoI18n } from "./079-iago-fake-flamingo.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const iagoFakeFlamingo: CharacterCard = {
  id: "Lbm",
  canonicalId: "ci_Lbm",
  reprints: ["set5-079"],
  cardType: "character",
  name: "Iago",
  version: "Fake Flamingo",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "005",
  cardNumber: 79,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a7aa78d2d3044e7ea94529cb078fced2",
    tcgPlayer: 559625,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "IN DISGUISE",
      description:
        "Whenever this character quests, you pay 2 {I} less for the next action you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    evasive,
    {
      effect: {
        amount: 2,
        cardType: "action",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "1y2-2",
      name: "IN DISGUISE",
      text: "IN DISGUISE Whenever this character quests, you pay 2 {I} less for the next action you play this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: iagoFakeFlamingoI18n,
};
