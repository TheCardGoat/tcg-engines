// CR 2.2.0 6.2.4: secondary conditions are checked at bag resolution.
import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, createMockItem, createMockSong } from ".";

const song = createMockSong({ id: "name-timing-song", name: "Repeated Song", cost: 0, text: "" });
const copy = createMockSong({ id: "name-timing-copy", name: "Repeated Song", cost: 0, text: "" });
const miller = createMockItem({
  id: "name-timing-miller",
  name: "Miller",
  cost: 1,
  abilities: [
    {
      type: "triggered",
      trigger: { event: "play", on: { cardType: "song", controller: "you" }, timing: "whenever" },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: { type: "mill", amount: 1, target: "CONTROLLER" },
      },
    },
  ],
});

describe("played-card-name trigger timing", () => {
  it("allows a later bag effect to satisfy a secondary name condition", () => {
    const source = createMockItem({
      id: "name-timing-source",
      name: "Name Source",
      cost: 1,
      abilities: [
        {
          type: "triggered",
          condition: { type: "played-card-name", zone: "discard", excludeSelf: true },
          trigger: {
            event: "play",
            on: { cardType: "song", controller: "you" },
            timing: "whenever",
          },
          effect: {
            type: "optional",
            chooser: "CONTROLLER",
            effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" },
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [song],
      deck: [copy],
      play: [miller, source],
    });
    expect(g.asPlayerOne().playCard(song)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(2);
    expect(
      g.asPlayerOne().resolvePendingByCard(miller, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(source, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(1);
  });

  it("still checks a name condition that defines the trigger itself", () => {
    const source = createMockItem({
      id: "name-trigger-source",
      name: "Trigger Source",
      cost: 1,
      abilities: [
        {
          type: "triggered",
          trigger: {
            event: "play",
            on: { cardType: "song", controller: "you" },
            timing: "whenever",
            condition: { type: "played-card-name", zone: "discard", excludeSelf: true },
          },
          effect: {
            type: "optional",
            chooser: "CONTROLLER",
            effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" },
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [song],
      deck: [copy],
      play: [miller, source],
    });
    expect(g.asPlayerOne().playCard(song)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(1);
    expect(
      g.asPlayerOne().resolvePendingByCard(miller, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.getLore(PLAYER_ONE)).toBe(0);
  });
});
