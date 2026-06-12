import { describe, expect, it } from "vitest";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "../../../testing";

const attackerCard = createMockCharacter({
  id: "attacker",
  name: "Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const onTheMoveDefender = createMockCharacter({
  id: "on-the-move",
  name: "On The Move Defender",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  abilities: [
    {
      id: "on-the-move-1",
      text: "When this character is challenged, return this card to your hand.",
      type: "triggered",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "when",
      },
      effect: {
        target: { ref: "self" },
        type: "return-to-hand",
      },
    },
  ],
});

const fierceProtectionWatcher = createMockCharacter({
  id: "fierce-protection",
  name: "Fierce Protection Watcher",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  abilities: [
    {
      id: "fierce-protection-1",
      text: "Whenever an opponent character challenges, deal 1 damage to the challenging character.",
      type: "triggered",
      trigger: {
        event: "challenge",
        on: "OPPONENT_CHARACTERS",
        timing: "whenever",
      },
      condition: { type: "is-exerted" },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "deal-damage",
          amount: 1,
          target: { ref: "trigger-subject" },
        },
      },
    },
  ],
});

describe("challenge bag clearing", () => {
  it("preserves unrelated bag items when a challenge is aborted by return-to-hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [attackerCard],
        deck: 1,
      },
      {
        play: [
          { card: onTheMoveDefender, exerted: true },
          { card: fierceProtectionWatcher, exerted: true },
        ],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().challenge(attackerCard, onTheMoveDefender).success).toBe(true);
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(2);

    const auth = testEngine.getAuthoritativeState() as any;
    const rawBag = auth.G.triggeredAbilities.bag.items;
    const onTheMoveBag = rawBag.find((b: any) => b.effect?.type === "return-to-hand");
    expect(onTheMoveBag).toBeDefined();

    const result = testEngine.asPlayerTwo().resolvePendingByCard(onTheMoveBag.sourceId);
    expect(result.success).toBe(true);

    expect(testEngine.asPlayerTwo().getCardZone(onTheMoveDefender)).toBe("hand");
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

    const remaining = testEngine.asPlayerTwo().getBagEffects()[0];
    expect(remaining?.sourceId).toBe(
      rawBag.find((b: any) => b.effect?.type === "optional")?.sourceId,
    );
  });
});
