import { LorcanaMultiplayerTestEngine, createMockAction } from "@tcg/lorcana-engine/testing";
import { donaldDuckSleepwalker } from "./packages/lorcana/lorcana-cards/src/cards/009/characters/083-donald-duck-sleepwalker";

const someAction = createMockAction({
  id: "donald-sleepwalker-test-action",
  name: "Some Action",
  cost: 1,
  text: "Gain 1 lore.",
  abilities: [
    {
      type: "action" as const,
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore" as const,
      },
    },
  ],
});

const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
  play: [donaldDuckSleepwalker],
  hand: [someAction],
  inkwell: someAction.cost,
  deck: 2,
});

const result = testEngine
  .asPlayerOne()
  .playCard(someAction, { preventAutoResolveTriggeredEffects: true });
console.log("play result:", result.success, result.reason);
const bagEffects = testEngine.asPlayerOne().getBagEffects();
console.log("bag effects count:", bagEffects.length);
console.log(
  "bag effects:",
  JSON.stringify(
    bagEffects.map((e: any) => ({
      id: e.id,
      abilityName: e.abilityName,
      controllerId: e.controllerId,
    })),
  ),
);
