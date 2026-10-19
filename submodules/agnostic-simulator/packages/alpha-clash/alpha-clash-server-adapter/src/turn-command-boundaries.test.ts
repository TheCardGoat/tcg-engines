import { expect, it } from "vite-plus/test";
import { clashCard, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const body = getCard("ac-ac1-027"),
  discard = clashCard({
    id: "ordinary-portal-activation",
    name: "Ordinary Portal activation",
    colors: [],
    affiliation: "alpha",
    cost: { total: 0 },
    attack: 1,
    defense: 1,
    abilities: [
      {
        kind: "activated",
        text: "Discard this card from your hand: activate the Portal.",
        cost: { kind: "discardSelf" },
        effects: [{ type: "activatePortal" }],
      },
    ],
  });
const seats = { p1: "player-one", p2: "player-two" } as const;
const context = { gameId: "turn-boundaries", sourceAuthority: "server" as const };
it.each(
  (["p1", "p2"] as const).flatMap((actor) =>
    (["initiateClash", "activateAbility"] as const).map((move) => ({ actor, move })),
  ),
)("rejects $actor's $move on the opponent's turn", ({ actor, move }) => {
  const activePlayer = seats[actor === "p1" ? "p2" : "p1"];
  const g = Spec.fromFixture({
    definitions: [discard],
    activePlayer,
    playerOne: { clash: [body], hand: [discard] },
    playerTwo: { clash: [body], hand: [discard] },
  });
  const engine = new AlphaClashServerEngine(g.state, seats);
  const before = structuredClone(engine.state),
    undo = structuredClone(engine.getUndoState()),
    version = engine.getStateID();
  const own = g.asPlayer(seats[actor]),
    opponent = g.asPlayer(activePlayer);
  const payload =
    move === "initiateClash"
      ? { attackerId: own.at(body, "clash").instanceId, targetId: opponent.contender().instanceId }
      : { cardId: own.at(discard, "hand").instanceId, abilityIndex: 0 };
  expect(engine.dispatch(move, actor, payload, context).success, move).toBe(false);
  expect(engine.state).toEqual(before);
  expect(engine.getStateID()).toBe(version);
  expect(engine.getUndoState()).toEqual(undo);
});
it("rejects an unknown play source without throwing, and permits a legal retry", () => {
  const g = Spec.fromFixture({ playerOne: { hand: [body], resource: [body] } });
  const engine = new AlphaClashServerEngine(g.state, seats);
  const before = structuredClone(engine.state),
    version = engine.getStateID();
  expect(engine.dispatch("playCard", "p1", { cardId: "missing" }, context).success).toBe(false);
  expect(engine.state).toEqual(before);
  expect(engine.getStateID()).toBe(version);
  expect(
    engine.dispatch("playCard", "p1", { cardId: g.playerOne.at(body, "hand").instanceId }, context)
      .success,
  ).toBe(true);
});
