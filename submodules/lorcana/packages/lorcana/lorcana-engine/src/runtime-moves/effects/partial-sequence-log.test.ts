import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, createMockItem } from "../../testing";

for (const gainDrop of [true, false]) {
  const source = createMockItem({
    id: `partial-sequence-${gainDrop}`,
    name: "Partial Sequence Source",
    cost: 1,
    abilities: [
      {
        type: "activated",
        name: "Destabilize",
        cost: { exert: true, ink: 2, banishSelf: true },
        effect: { type: "sequence", steps: [] },
      },
      {
        type: "triggered",
        name: "Burst",
        sourceZones: ["play"],
        trigger: { event: "banish", on: "SELF", timing: "when" },
        effect: {
          type: "optional",
          chooser: "CONTROLLER",
          effect: {
            type: "sequence",
            steps: [
              ...(gainDrop
                ? [{ type: "gain-ink-drop" as const, amount: 1, target: "CONTROLLER" as const }]
                : []),
              {
                type: "modify-stat",
                stat: "strength",
                modifier: -2,
                duration: "this-turn",
                target: "CHOSEN_CHARACTER",
              },
            ],
          },
        },
      },
    ],
  });
  describe("missing-target sequence resolution log", () => {
    it(
      gainDrop
        ? "reports completed drop gain despite missing later target"
        : "does not report completion when no instruction can resolve",
      () => {
        const g = LorcanaMultiplayerTestEngine.createWithFixture({ play: [source], inkwell: 2 });
        expect(
          g.asPlayerOne().activateAbility(source, { ability: "Destabilize" }),
        ).toBeSuccessfulCommand();
        if (gainDrop)
          expect(
            g.asPlayerOne().resolvePendingByCard(source, { resolveOptional: true }),
          ).toBeSuccessfulCommand();
        expect(g.getInkDrops(PLAYER_ONE)).toBe(gainDrop ? 1 : 0);
        expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
        const messages = g
          .asServer()
          .getMoveLogHistory()
          .flatMap((log) => log.public);
        const resolution = messages.findLast((m) => m.key.startsWith("lorcana.bag.resolve."));
        if (gainDrop) expect(resolution?.key).toBe("lorcana.bag.resolve.completed.named");
        else {
          expect(resolution).toBeUndefined();
          expect(messages.some((m) => m.key.startsWith("lorcana.bag.resolve.completed"))).toBe(
            false,
          );
        }
      },
    );
  });
}
