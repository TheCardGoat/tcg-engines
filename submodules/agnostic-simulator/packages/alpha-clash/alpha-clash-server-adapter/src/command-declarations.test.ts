import { expect, it } from "vite-plus/test";
import type { AcContenderCard } from "@tcg/alpha-clash-types";
import { getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
import { readPlayDeclaration } from "./command-declarations";

const hero: AcContenderCard = {
  id: "command-hero",
  name: "Hero",
  cardType: "contender",
  colors: [],
  health: 30,
  attack: 0,
  defense: 0,
};
const context = { gameId: "declarations", sourceAuthority: "server" as const };
const server = (game: Spec) =>
  new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });

it("dispatches a declared Alternative Strike mode and resolves its damage", () => {
  const card = getCard("ac-ac2-115");
  const game = Spec.fromFixture({
    definitions: [hero],
    playerOne: { hand: [card], resource: 3 },
    playerTwo: { contender: hero },
  });
  const engine = server(game);
  const health = engine.state.players["player-two"].health;
  expect(
    engine.dispatch(
      "playCard",
      "p1",
      {
        cardId: game.playerOne.hand(card).instanceId,
        modeIndex: 0,
        targetId: game.playerTwo.contender().instanceId,
      },
      context,
    ).success,
  ).toBe(true);
  for (let i = 0; i < 10 && engine.state.responseWindow; i++)
    expect(engine.dispatch("pass", engine.getActivePlayerId()!, {}, context).success).toBe(true);
  expect(engine.state.players["player-two"].health).toBe(health - 2);
});

it("dispatches Manifest without charging the normal resource cost", () => {
  const card = getCard("ac-ac8-181");
  const filler = getCard("ac-ac2-115");
  const game = Spec.fromFixture({
    playerOne: { hand: [card], deck: 8, oblivion: [filler, filler, filler, filler] },
  });
  const engine = server(game);
  expect(
    engine.dispatch(
      "playCard",
      "p1",
      {
        cardId: game.playerOne.hand(card).instanceId,
        manifest: true,
        targetIds: game.playerOne
          .instances(filler)
          .filter((c) => c.zone === "oblivion")
          .map((c) => c.instanceId),
      },
      context,
    ).success,
  ).toBe(true);
  expect(engine.state.manifestedThisTurn["player-one"]).toBe(true);
  expect(engine.state.deckOrder["player-one"]).toHaveLength(8); // Four diminished; four selected cards shuffled back.
  expect(
    game.playerOne
      .instances(filler)
      .filter((c) => engine.state.cards[c.instanceId].zone === "deck"),
  ).toHaveLength(4);
});

it("preserves every nested play declaration without accepting actor or card overrides", () => {
  const declaration = {
    costReductionSacrificeIds: ["sacrifice"],
    resourcePayment: [{ cardId: "resource", color: "blue" }],
    declineSelfCostReduction: false,
    selfCostReductionCount: 2,
    declinedConditionalDiscounts: [0, 2],
    modeIndex: 0,
    modeIndices: [0, 1],
    sendCostCardIds: ["send"],
    targetId: "first",
    discardCostIds: ["discard"],
    targetIds: ["second"],
    xValue: 0,
    alternateCostCardIds: ["alternative"],
    manifest: true,
  };
  expect(
    readPlayDeclaration(
      JSON.parse(JSON.stringify({ ...declaration, playerId: "enemy", cardId: "injected" })),
    ),
  ).toEqual(declaration);
});

it.each([
  { modeIndex: -1 },
  { modeIndex: 0.5 },
  { modeIndices: [0, "1"] },
  { targetIds: ["valid", 7] },
  { declineSelfCostReduction: "false" },
  { selfCostReductionCount: -1 },
  { selfCostReductionCount: "1" },
  { selfCostReductionCount: 1.5 },
  { declinedConditionalDiscounts: [null] },
  { manifest: false },
  { xValue: Infinity },
  { costReductionSacrificeIds: "card" },
])("rejects malformed declarations atomically: %j", (invalid) => {
  const card = getCard("ac-ac2-115");
  const game = Spec.fromFixture({
    definitions: [hero],
    playerOne: { hand: [card], resource: 3 },
    playerTwo: { contender: hero },
  });
  const engine = server(game);
  const before = structuredClone(engine.state);
  expect(
    engine.dispatch(
      "playCard",
      "p1",
      { cardId: game.playerOne.hand(card).instanceId, ...invalid },
      context,
    ),
  ).toMatchObject({ success: false, errorCode: "INVALID_ARGUMENTS" });
  expect(engine.state).toEqual(before);
});
