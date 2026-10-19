import { spiritOfFire, woodlandSquirrels } from "@tcg/grand-archive-cards";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  GrandArchiveMatchRuntime,
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "@tcg/grand-archive-engine/simulator";
import { GrandArchiveServerEngine } from "@tcg/grand-archive-server-adapter";

type FixtureCard = typeof woodlandSquirrels;
type FixtureFace = Extract<FixtureCard["layout"], { kind: "single-faced" }>["face"];
type TriggeredAbility = Extract<FixtureFace["abilities"][number], { kind: "triggered" }>;

/** Synthetic ability for exercising dependent forms; not a catalog card implementation. */
export function createDependentTriggerFixture() {
  const ability: TriggeredAbility = {
    id: "preview-trigger-a1",
    kind: "triggered",
    text: "On Enter: Choose a number, a mode and targets.",
    trigger: {
      kind: "event",
      event: { name: "object-entered-field", subject: { kind: "source" } },
    },
    variables: [{ kind: "chosen", symbol: "X", minimum: 30, maximum: 40 }],
    modes: {
      declared: "stack-entry",
      choose: { kind: "exactly", amount: 1 },
      modes: [
        {
          id: "dependent",
          text: "Choose allies, then target one of those allies again.",
          variables: [
            {
              kind: "chosen",
              symbol: "Y",
              minimum: { kind: "variable", symbol: "X" },
              maximum: {
                kind: "calculate",
                operator: "add",
                operands: [{ kind: "variable", symbol: "X" }, 2],
              },
            },
          ],
          targets: [
            {
              id: "first",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: {
                  kind: "calculate",
                  operator: "subtract",
                  operands: [{ kind: "variable", symbol: "X" }, 30],
                },
              },
              candidates: {
                kind: "object",
                zones: ["field"],
                player: "each-opponent",
                filter: { kind: "type", oneOf: ["ALLY"] },
              },
            },
            {
              id: "second",
              allowRepeated: true,
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: { kind: "exactly", amount: 1 },
              candidates: { kind: "object", binding: "first" },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: { kind: "bound", binding: "second" },
            counter: { named: "preview" },
            amount: { kind: "variable", symbol: "Y" },
          },
        },
        {
          id: "alternate",
          text: "Choose your champion.",
          targets: [
            {
              id: "champion",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: { kind: "exactly", amount: 1 },
              candidates: {
                kind: "object",
                zones: ["field"],
                player: "controller",
                filter: { kind: "type", oneOf: ["CHAMPION"] },
              },
            },
          ],
          effect: { kind: "no-op" },
        },
      ],
    },
    effect: { kind: "no-op" },
  };
  if (woodlandSquirrels.layout.kind !== "single-faced") throw new Error("Expected fixture face");
  const card: FixtureCard = {
    ...woodlandSquirrels,
    canonicalId: "preview-fixture",
    slug: "preview-fixture",
    layout: {
      kind: "single-faced",
      face: {
        ...woodlandSquirrels.layout.face,
        id: "preview-fixture:face:default",
        catalogId: "preview-fixture",
        name: "Preview fixture",
        abilities: [ability],
      },
    },
  };
  const zone = "field";
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: { id: "p1", champion: spiritOfFire, zones: { hand: [card] } },
    playerTwo: {
      id: "p2",
      champion: spiritOfFire,
      zones: { [zone]: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
    },
  });
  game
    .player("p1")
    .execute({ move: "activate-card", cardId: game.player("p1").card(card).objectId });
  for (let index = 0; index < 4 && !game.state.decision; index++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error("Expected Opportunity");
    game.player(wait.playerId).pass();
  }
  if (game.state.decision?.kind !== "announce-triggered-ability")
    throw new Error("Expected trigger decision");
  return new GrandArchiveServerEngine(
    game.program,
    new GrandArchiveMatchRuntime(
      game.program,
      restoreGrandArchiveMatchSnapshot(
        game.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(game.state))),
      ),
    ),
  );
}
