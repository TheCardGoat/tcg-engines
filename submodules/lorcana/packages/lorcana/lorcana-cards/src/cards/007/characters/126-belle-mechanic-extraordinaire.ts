import type { CharacterCard } from "@tcg/lorcana-types";
import { belleMechanicExtraordinaireI18n } from "./126-belle-mechanic-extraordinaire.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const belleMechanicExtraordinaire: CharacterCard = {
  id: "AY5",
  canonicalId: "ci_PhF",
  reprints: ["set7-126"],
  cardType: "character",
  name: "Belle",
  version: "Mechanic Extraordinaire",
  inkType: ["ruby", "sapphire"],
  franchise: "Beauty and the Beast",
  set: "007",
  cardNumber: 126,
  rarity: "common",
  cost: 9,
  strength: 7,
  willpower: 7,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_0d38ed42e8f14a299f6efefb250350d3",
    tcgPlayer: 619745,
  },
  text: [
    {
      title: "Shift 7",
    },
    {
      title: "SALVAGE",
      description:
        "For each item card in your discard, you pay 1 {I} less to play this character using her Shift ability.",
    },
    {
      title: "REPURPOSE",
      description:
        "Whenever this character quests, you may put up to 3 item cards from your discard on the bottom of your deck to gain 1 lore for each item card moved this way.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess", "Inventor"],
  abilities: [
    shift(7),
    {
      id: "lej-2",
      name: "SALVAGE",
      type: "static",
      sourceZones: ["hand"],
      effect: {
        type: "cost-reduction",
        amount: {
          type: "filtered-count",
          cardType: "item",
          owner: "you",
          zones: ["discard"],
          filters: [],
        },
      },
      text: "SALVAGE For each item card in your discard, you pay 1 {I} less to play this character using her Shift ability.",
    },
    {
      id: "lej-3",
      name: "REPURPOSE",
      type: "triggered",
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
              type: "put-on-bottom",
              target: {
                selector: "chosen",
                count: {
                  upTo: 3,
                },
                owner: "you",
                zones: ["discard"],
                cardTypes: ["item"],
              },
            },
            {
              type: "for-each",
              counter: {
                type: "last-effect-target-count",
              },
              effect: {
                type: "gain-lore",
                amount: 1,
                target: "CONTROLLER",
              },
            },
          ],
        },
      },
      text: "REPURPOSE Whenever this character quests, you may put up to 3 item cards from your discard on the bottom of your deck to gain 1 lore for each item card moved this way.",
    },
  ],
  i18n: belleMechanicExtraordinaireI18n,
};
