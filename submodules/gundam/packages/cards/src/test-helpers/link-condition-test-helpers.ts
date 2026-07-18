import { createMockCommand } from "@tcg/gundam-engine";

/** A zero-cost Command whose visible target prompt accepts only a friendly Link Unit. */
export function createLinkUnitCheckCommand() {
  return createMockCommand({
    name: "Link Unit Check",
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "statModifier",
              stat: "ap",
              amount: 1,
              duration: "thisTurn",
              target: {
                owner: "friendly",
                cardType: "unit",
                isLinkUnit: true,
                count: 1,
              },
            },
          },
        ],
        sourceText: "【Main】Choose 1 friendly Link Unit. It gets AP+1 during this turn.",
      },
    ],
  });
}
