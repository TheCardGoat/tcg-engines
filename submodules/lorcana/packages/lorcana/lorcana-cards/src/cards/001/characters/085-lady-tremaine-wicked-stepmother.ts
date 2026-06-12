import type { CharacterCard } from "@tcg/lorcana-types";
import { ladyTremaineWickedStepmotherI18n } from "./085-lady-tremaine-wicked-stepmother.i18n";

export const ladyTremaineWickedStepmother: CharacterCard = {
  id: "L2F",
  canonicalId: "ci_L2F",
  reprints: ["set1-085"],
  cardType: "character",
  name: "Lady Tremaine",
  version: "Wicked Stepmother",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "001",
  cardNumber: 85,
  rarity: "rare",
  cost: 6,
  strength: 1,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_1acda7d08eb443e9bd36798a1fd7741a",
    tcgPlayer: 489665,
  },
  text: [
    {
      title: "DO IT AGAIN!",
      description:
        "When you play this character, you may return an action card from your discard to your hand.",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "action",
          target: "CONTROLLER",
          type: "return-from-discard",
        },
        type: "optional",
      },
      id: "qdk-1",
      name: "DO IT AGAIN!",
      text: "DO IT AGAIN! When you play this character, you may return an action card from your discard to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: ladyTremaineWickedStepmotherI18n,
};
