import { expect, it } from "vite-plus/test";
import { getCard, allCards } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { INTERACTION_PROTOCOL_VERSION, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
import type { AcContenderCard, AcActionCard } from "@tcg/alpha-clash-types";

const hero: AcContenderCard = {
  id: "mode-hero",
  name: "Hero",
  cardType: "contender",
  colors: [],
  health: 30,
  attack: 0,
  defense: 0,
};
const context = { gameId: "mode-interactions", sourceAuthority: "server" as const };
function request(
  engine: AlphaClashServerEngine,
  cardId: string,
  values: InteractionSubmission["values"],
) {
  const view = engine.getInteractionView("p1");
  const action = view.actions.find((a) => a.id === `playCard:${cardId}`);
  if (!action) throw new Error("Missing play action");
  return {
    view,
    action,
    submission: {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      requestId: action.requestId,
      actionId: action.id,
      values,
    },
  };
}
it("submits Alternative Strike's damage mode with its mode-specific target", () => {
  const card = getCard("ac-ac2-115");
  const game = Spec.fromFixture({
    definitions: [hero],
    playerOne: { hand: [card], resource: 3 },
    playerTwo: { contender: hero },
  });
  const engine = new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });
  const { action, submission } = request(engine, game.playerOne.hand(card).instanceId, {
    modeSelection: ["0"],
    "mode:0:targetId": [game.playerTwo.contender().instanceId],
  });
  expect(action.inputs.find((i) => i.id === "modeSelection")).toMatchObject({
    kind: "option-selection",
    options: [
      { id: "0", enabled: true },
      { id: "1", enabled: false },
    ],
  });
  expect(engine.submitInteraction("p1", submission, context)).toMatchObject({ success: true });
  expect(engine.state.players["player-two"].health).toBe(28);
});
it("requires both targets for the portal-open combined mode and rejects incomplete selection without payment", () => {
  const card = getCard("ac-ac2-115");
  const relic = allCards().find((card) => card.name === "Webber's Binoculars")!;
  const game = Spec.fromFixture({
    portalOpen: true,
    definitions: [hero],
    playerOne: { hand: [card], resource: 3 },
    playerTwo: { contender: hero, accessory: [relic] },
  });
  const engine = new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });
  const cardId = game.playerOne.hand(card).instanceId;
  const relicId = game.playerTwo.at(relic, "accessory").instanceId;
  const partial = request(engine, cardId, {
    modeSelection: ["2"],
    "mode:2:targetId": [game.playerTwo.contender().instanceId],
  });
  const before = structuredClone(engine.state);
  expect(engine.submitInteraction("p1", partial.submission, context).success).toBe(false);
  expect(engine.state).toEqual(before);
  const complete = request(engine, cardId, {
    ...partial.submission.values,
    "mode:2:targetIds": [game.playerTwo.at(relic, "accessory").instanceId],
  });
  expect(engine.submitInteraction("p1", complete.submission, context).success).toBe(true);
  expect(engine.state.players["player-two"].health).toBe(28);
  expect(engine.state.cards[relicId].zone).toBe("oblivion");
});
it("submits Manifest with four selected Oblivion cards and no resource payment", () => {
  const card = getCard("ac-ac8-181");
  const filler = getCard("ac-ac2-115");
  const game = Spec.fromFixture({
    playerOne: { hand: [card], deck: 8, oblivion: [filler, filler, filler, filler] },
  });
  const engine = new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });
  const targetIds = game.playerOne
    .instances(filler)
    .filter((c) => c.zone === "oblivion")
    .map((c) => c.instanceId);
  const { action, submission } = request(engine, game.playerOne.hand(card).instanceId, {
    manifestRoute: ["manifest"],
    targetIds,
  });
  expect(action.inputs.find((i) => i.id === "targetIds")).toMatchObject({ min: 4, max: 4 });
  expect(engine.submitInteraction("p1", submission, context).success).toBe(true);
  expect(engine.state.manifestedThisTurn["player-one"]).toBe(true);
  expect(targetIds.every((id) => engine.state.cards[id].zone === "deck")).toBe(true);
});

it("offers distinct Supernova mode pairs and pays its seven Nova tokens through the interaction", () => {
  const nova = getCard("ac-ac3-135");
  const factory: AcActionCard = {
    id: "mode-factory",
    name: "Factory",
    cardType: "action",
    subtype: "basic",
    colors: ["red"],
    cost: { total: 0 },
    effects: [
      {
        type: "createTokens",
        amount: 7,
        token: { name: "Nova", cardType: "accessory", colors: ["red"] },
      },
    ],
  };
  const game = Spec.fromFixture({
    definitions: [hero, factory],
    playerOne: { hand: [factory, nova], resource: Array.from({ length: 7 }, () => nova), deck: 6 },
    playerTwo: { contender: hero },
  });
  game.playerOne.playAndResolve(factory);
  const engine = new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });
  const tokens = Object.values(game.state.cards)
    .filter((c) => c.controller === "player-one" && c.isToken && c.zone === "accessory")
    .map((c) => c.instanceId);
  expect(tokens).toHaveLength(7);
  const { action, submission } = request(engine, game.playerOne.hand(nova).instanceId, {
    modeSelection: ["0,1"],
    "mode:0,1:targetId": [game.playerTwo.contender().instanceId],
    costRoute: ["normal"],
    sendCostCardIds: tokens,
    costResources: Object.values(game.state.cards)
      .filter((c) => c.zone === "resource")
      .map((c) => JSON.stringify([c.instanceId, "red"])),
  });
  expect(action.inputs.find((i) => i.id === "modeSelection")).toMatchObject({
    options: [
      { id: "0,1" },
      { id: "0,2" },
      { id: "0,3" },
      { id: "1,2" },
      { id: "1,3" },
      { id: "2,3" },
    ],
  });
  const submitted = engine.submitInteraction("p1", submission, context);
  expect(submitted.success, JSON.stringify(submitted)).toBe(true);
  for (let i = 0; i < 10 && engine.state.pendingChoices.length; i++) {
    const choice = engine.state.pendingChoices[0];
    if (choice.kind !== "ordering") throw new Error("Unexpected choice");
    expect(
      engine.dispatch(
        "resolveChoice",
        "p1",
        { choiceId: choice.id, orderedIds: choice.candidates.map((c) => c.id) },
        context,
      ).success,
    ).toBe(true);
  }
  expect(engine.state.players["player-two"].health).toBe(23);
  expect(engine.state.deckOrder["player-one"]).toHaveLength(4);
  expect(
    tokens.every(
      (id) => engine.state.cards[id] === undefined || engine.state.cards[id].zone !== "accessory",
    ),
  ).toBe(true);
});
