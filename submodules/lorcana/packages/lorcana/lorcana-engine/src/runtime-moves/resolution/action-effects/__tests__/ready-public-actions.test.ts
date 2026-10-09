// CR 5.1.1.1 and 6.1.5.1: inference from the ready-state transition and
// the requirement to perform A before resolving "If you do, B".
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockAction,
  createMockCharacter,
} from "../../../../testing";

const watcher = createMockCharacter({
  id: "ready-transition-watcher",
  name: "Ready Watcher",
  cost: 2,
  abilities: [
    {
      type: "triggered",
      name: "Observe ready",
      text: "Whenever you ready this character, gain 1 lore.",
      trigger: { event: "ready", on: "SELF", timing: "whenever" },
      effect: { type: "gain-lore", target: "CONTROLLER", amount: 1 },
    },
  ],
});
const readyAction = createMockAction({
  id: "ready-transition-action",
  name: "Ready then gain",
  cost: 1,
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "conditional",
            condition: { type: "if-you-do" },
            then: { type: "gain-lore", target: "CONTROLLER", amount: 2 },
          },
        ],
      },
    },
  ],
});

describe("ready through public actions", () => {
  for (const exerted of [false, true]) {
    it(`${exerted ? "an exerted" : "an already-ready"} target generates ${exerted ? "one" : "no"} ready trigger and conditional reward`, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [readyAction],
        inkwell: 1,
        play: [{ card: watcher, exerted, isDrying: false }],
      });
      expect(g.asPlayerOne().playCard(readyAction)).toBeSuccessfulCommand();
      expect(g.asPlayerOne().resolveNextPending({ targets: [watcher] })).toBeSuccessfulCommand();
      expect(g.asPlayerOne().isExerted(watcher)).toBe(false);
      // The mandatory watcher trigger resolves automatically after the action.
      expect(g.getLore(PLAYER_ONE)).toBe(exerted ? 3 : 0);
      expect(g.asPlayerOne().getBagCount()).toBe(0);
    });
  }

  it("still applies an unconditional quest restriction to an already-ready target", () => {
    const action = createMockAction({
      id: "ready-unconditional",
      name: "Ready and restrict",
      cost: 1,
      abilities: [
        {
          type: "action",
          effect: {
            type: "ready",
            restriction: "cant-quest",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [action],
      inkwell: 1,
      play: [{ card: watcher, isDrying: false }],
    });
    expect(g.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolveNextPending({ targets: [watcher] })).toBeSuccessfulCommand();
    expect(g.hasRestriction(watcher, "cant-quest")).toBe(true);
    expect(g.asPlayerOne().quest(watcher)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.getLore(PLAYER_ONE)).toBe(0);
  });
});
