import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailTheHeist = defineCyberpunkCard({
  id: "5ea00b3a-7e85-4c7d-91ad-90e0cf370c27",
  slug: "the-heist",
  rulesText:
    "Trash 4. Add a Gear from among them to your hand. If that Gear's cost equals the value of a friendly Gig, you may play it for free instead.",
  name: "The Heist",
  displayName: "The Heist",
  canonicalId: "the-heist",
  color: "yellow",
  classifications: ["Merc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "070",
  artist: "Dilara Özden",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/070.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  type: "program",
  cost: 2,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "Trash 4. Add a Gear from among them to your hand. If that Gear's cost equals the value of a friendly Gig, you may play it for free instead.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        // Step 1: Trash (mill) 4 cards from the controller's deck.
        {
          effect: "trashFromDeck",
          player: "friendly",
          amount: 4,
          outputBinding: "trashedCards",
        },
        // Step 2: Choose a Gear from among the trashed cards and add it to hand.
        // The `selection` on the bound target creates a chooseTarget (effectTarget)
        // pending choice, resolved by resolve-effect-target.ts, which publishes the
        // outputBinding so Step 3 can scope the free-play check to THIS Gear.
        // `min: 1` makes recovery mandatory when a Gear is available; the resolver
        // no-ops when no Gear is among the trashed cards (0 eligible targets).
        {
          effect: "moveCard",
          target: {
            selector: "bound",
            id: "trashedCards",
            cardTypes: ["gear"],
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          destination: "hand",
          outputBinding: "recoveredGear",
        },
        // Step 3: If the RECOVERED Gear's cost matches a friendly Gig value,
        // optionally play (attach) it for free. Both the condition and the
        // playCard target are scoped to the recovered Gear via the binding, so
        // only the Gear just added from trash is eligible.
        {
          effect: "playCard",
          optional: true,
          conditions: [
            {
              condition: "costMatchesGig",
              target: {
                selector: "bound",
                id: "recoveredGear",
              },
              controller: "friendly",
            },
          ],
          target: {
            selector: "bound",
            id: "recoveredGear",
          },
          free: true,
          attachTo: {
            selector: "card",
            controller: "friendly",
            zones: ["field", "legendArea"],
            cardTypes: ["unit", "legend"],
            face: "faceUp",
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
}) satisfies ProgramCardDefinition;
