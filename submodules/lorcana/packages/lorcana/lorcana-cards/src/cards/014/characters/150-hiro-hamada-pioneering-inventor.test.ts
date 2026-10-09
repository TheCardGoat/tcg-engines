import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { hiroHamadaPioneeringInventor } from "./150-hiro-hamada-pioneering-inventor";
import { landOfTheDeadMarigoldBridge } from "../locations/135-land-of-the-dead-marigold-bridge";
import { breakCard } from "../../001/actions/196-break";

const gadget = createMockItem({ id: "hiro-item", name: "Gadget", cost: 2 });

describe("Hiro Hamada - Pioneering Inventor", () => {
  it("Player Two keeps both copies boosted after one item leaves, then loses the bonus with the last item", () => {
    const secondItem = createMockItem({ id: "hiro-second-item", name: "Second Item", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [gadget] },
      {
        play: [
          { card: hiroHamadaPioneeringInventor, isDrying: false },
          { card: hiroHamadaPioneeringInventor, isDrying: false },
          gadget,
          secondItem,
        ],
        hand: [breakCard, breakCard],
        inkwell: 4,
      },
    );
    const [first, second] = g.getCardInstanceIdsInZone("play", PLAYER_TWO);
    const [firstBreak, secondBreak] = g.getCardInstanceIdsInZone("hand", PLAYER_TWO);
    const ownItem = g.findCardInstanceId(gadget, "play", PLAYER_TWO);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(firstBreak!, { targets: [ownItem!] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(ownItem!)).toBe("discard");
    expect(g.asPlayerTwo().quest(first!)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_TWO)).toBe(2);
    expect(
      g.asPlayerTwo().playCard(secondBreak!, { targets: [secondItem] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(second!)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_TWO)).toBe(3);
    expect(g.getLore(PLAYER_ONE)).toBe(0);
    expect(g.getCardInstanceIdsInZone("play", PLAYER_ONE)).toHaveLength(1);
    expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(g.asPlayerTwo().getBagEffects()).toHaveLength(0);
  });

  it("friendly characters and locations do not satisfy the item condition", () => {
    const other = createMockCharacter({ id: "hiro-other", name: "Other", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: hiroHamadaPioneeringInventor, isDrying: false },
        other,
        landOfTheDeadMarigoldBridge,
      ],
    });
    expect(g.asPlayerOne().quest(hiroHamadaPioneeringInventor)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(1);
  });

  it("loses the bonus immediately when the last friendly item is banished", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: hiroHamadaPioneeringInventor, isDrying: false }, gadget],
      hand: [breakCard],
      inkwell: 2,
    });
    expect(g.asPlayerOne().playCard(breakCard, { targets: [gadget] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(gadget)).toBe("discard");
    expect(g.asPlayerOne().quest(hiroHamadaPioneeringInventor)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(1);
  });
  it("an opposing item does not increase Hiro's quest lore", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: hiroHamadaPioneeringInventor, isDrying: false }] },
      { play: [gadget] },
    );
    expect(g.asPlayerOne().quest(hiroHamadaPioneeringInventor)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(1);
  });

  it("multiple friendly items grant only one additional lore", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: hiroHamadaPioneeringInventor, isDrying: false }, gadget, gadget],
    });
    expect(g.asPlayerOne().quest(hiroHamadaPioneeringInventor)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(2);
  });

  it("an item in hand or discard does not grant additional lore", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: hiroHamadaPioneeringInventor, isDrying: false }],
      hand: [gadget],
      discard: [gadget],
    });
    expect(g.asPlayerOne().quest(hiroHamadaPioneeringInventor)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(1);
  });
  it("gets +1 {L} while you have an item in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hiroHamadaPioneeringInventor, gadget],
      inkwell: hiroHamadaPioneeringInventor.cost + gadget.cost,
    });

    // Without an item: quests for printed lore (1).
    expect(testEngine.asPlayerOne().playCard(hiroHamadaPioneeringInventor)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(hiroHamadaPioneeringInventor)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // With an item: quests for 2.
    expect(testEngine.asPlayerOne().playCard(gadget)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(hiroHamadaPioneeringInventor)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(3);
  });
});
