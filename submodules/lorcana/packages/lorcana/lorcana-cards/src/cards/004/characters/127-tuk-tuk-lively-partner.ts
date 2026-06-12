import type { CharacterCard } from "@tcg/lorcana-types";
import { tukTukLivelyPartnerI18n } from "./127-tuk-tuk-lively-partner.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const tukTukLivelyPartner: CharacterCard = {
  id: "PQN",
  canonicalId: "ci_j2H",
  reprints: ["set4-127", "set9-129"],
  cardType: "character",
  name: "Tuk Tuk",
  version: "Lively Partner",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  cardNumber: 127,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1f37e8ef12cb407f815ee35eb21abf61",
    tcgPlayer: 650064,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "ON A ROLL",
      description:
        "When you play this character, you may move him and one of your other characters to the same location for free. The other character gets +2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    evasive,
    {
      id: "PQN-2",
      name: "ON A ROLL",
      text: "ON A ROLL When you play this character, you may move him and one of your other characters to the same location for free. The other character gets +2 {S} this turn.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-to-location",
              character: "ANOTHER_CHOSEN_CHARACTER_OF_YOURS",
              location: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["location"],
              },
              cost: "free",
            },
            {
              type: "move-to-location",
              character: "SELF",
              location: {
                ref: "previous-target",
              },
              cost: "free",
            },
            {
              type: "modify-stat",
              stat: "strength",
              modifier: 2,
              duration: "this-turn",
              target: {
                reference: "selected-first",
              },
            },
          ],
        },
      },
    },
  ],
  i18n: tukTukLivelyPartnerI18n,
};
