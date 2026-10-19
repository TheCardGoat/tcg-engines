import { spiritOfFire, woodlandSquirrels, grayWolf, giantTortoise } from "@tcg/grand-archive-cards";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { GrandArchiveMatchRuntime } from "@tcg/grand-archive-engine/simulator";
import { GrandArchiveServerEngine } from "@tcg/grand-archive-server-adapter";

type Card = typeof woodlandSquirrels;
type Face = Extract<Card["layout"], { kind: "single-faced" }>["face"];
type Ability = Extract<Face["abilities"][number], { kind: "activated" }>;

/** Synthetic fixture for native action discovery and sequential payments. */
export function createAbilityPaymentFixture() {
  const ability: Ability = {
    id: "native-payment-a1",
    kind: "activated",
    activation: "ability",
    text: "Discard a card and pay 1 reserve: Put X counters on target champion.",
    variables: [{ kind: "chosen", symbol: "X", minimum: 30, maximum: 40 }],
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
          player: "each-opponent",
          filter: { kind: "type", oneOf: ["CHAMPION"] },
        },
      },
    ],
    cost: {
      kind: "all",
      costs: [
        {
          kind: "select-and-move",
          player: "controller",
          from: "hand",
          to: "graveyard",
          count: { kind: "exactly", amount: 1 },
        },
        { kind: "pay-reserve", amount: 1 },
      ],
    },
    effect: {
      kind: "add-counter",
      subject: { kind: "bound", binding: "champion" },
      counter: { named: "paid" },
      amount: { kind: "variable", symbol: "X" },
    },
  };
  if (woodlandSquirrels.layout.kind !== "single-faced") throw new Error("Expected fixture face");
  const card: Card = {
    ...woodlandSquirrels,
    canonicalId: "payment-fixture",
    slug: "payment-fixture",
    layout: {
      kind: "single-faced",
      face: {
        ...woodlandSquirrels.layout.face,
        id: "payment-fixture:face:default",
        catalogId: "payment-fixture",
        name: "Payment fixture",
        abilities: [ability],
      },
    },
  };
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      id: "p1",
      name: "You",
      champion: spiritOfFire,
      zones: { field: [card], hand: [woodlandSquirrels, grayWolf, giantTortoise] },
    },
    playerTwo: { id: "p2", name: "Opponent", champion: spiritOfFire },
  });
  return new GrandArchiveServerEngine(
    game.program,
    new GrandArchiveMatchRuntime(game.program, game.state),
  );
}
