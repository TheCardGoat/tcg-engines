import type { CharacterCard } from "@tcg/lorcana-types";
import { rayaLeaderOfHeartI18n } from "./123-raya-leader-of-heart.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const rayaLeaderOfHeart: CharacterCard = {
  id: "rSb",
  canonicalId: "ci_rSb",
  reprints: ["set2-123"],
  cardType: "character",
  name: "Raya",
  version: "Leader of Heart",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  cardNumber: 123,
  rarity: "common",
  cost: 6,
  strength: 5,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5b613c1368aa4c94a43c012f9a73394e",
    tcgPlayer: 527530,
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "CHAMPION OF KUMANDRA",
      description:
        "Whenever this character challenges a damaged character, she takes no damage from the challenge.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
  abilities: [
    shift(4),
    {
      id: "7bt-2",
      name: "CHAMPION OF KUMANDRA",
      text: "CHAMPION OF KUMANDRA Whenever this character challenges a damaged character, she takes no damage from the challenge.",
      type: "triggered",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
        defender: {
          filters: [
            {
              type: "damaged",
            },
          ],
        },
      },
      effect: {
        duration: "this-turn",
        replacement: {
          consumeOnApply: true,
          eventKinds: ["challenge-damage"],
          targetRef: "source",
          type: "prevent-damage",
        },
        type: "create-replacement-effect",
      },
    },
  ],
  i18n: rayaLeaderOfHeartI18n,
};
