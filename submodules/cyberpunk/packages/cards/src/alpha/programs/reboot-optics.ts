import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const alphaRebootOptics = defineCyberpunkCard({
  id: "cc85bde3-16d0-4064-b5f0-35dbd855bfed",
  slug: "reboot-optics",
  rulesText:
    "Give a friendly unit +4 power this turn. Defeat it at the end of the turn. (Discard programs after they resolve.)",
  name: "Reboot Optics",
  displayName: "Reboot Optics",
  canonicalId: "reboot-optics",
  color: "yellow",
  classifications: ["Tech"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α028",
  artist: "Miguel Valderrama",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a028.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  type: "program",
  cost: 2,
  power: null,
  abilities: [
    AbilityBuilder.triggered()
      .text("Give a friendly unit +4 power this turn. Defeat it at the end of the turn.")
      .onPlay()
      .source(target.self())
      .bind(
        "selectedUnit",
        target.card({
          controller: "friendly",
          zones: ["field"],
          cardTypes: ["unit"],
          selection: {
            mode: "choose",
            min: 1,
            max: 1,
          },
        }),
      )
      .effect(
        effect.modifyPower({
          target: target.bound("selectedUnit"),
          value: 4,
          duration: "turn",
        }),
      )
      .effect(
        effect.delayed({
          timing: "endOfTurn",
          effects: [
            effect.defeat({
              target: target.bound("selectedUnit"),
            }),
          ],
        }),
      )
      .build(),
  ],
  reminderText: ["Discard programs after they resolve."],
}) satisfies ProgramCardDefinition;
