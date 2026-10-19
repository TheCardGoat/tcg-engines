import { clashCard, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";
import type { AcClashCard } from "@tcg/alpha-clash-types";
import { nativeFixtureState } from "./native-fixture-state";

export const commandContractFixtures = [
  {
    id: "activation-cost-routes",
    title: "Magnate · Alternative activation cost",
    description:
      "The in-play Magnate is engaged. Activate using GGG, choose the Magnate in hand, and verify the original goes to Oblivion.",
  },
  {
    id: "activation-send-cost",
    title: "Flare · Choose a Nova activation cost",
    description:
      "Native entry effects created two Novas. Activate Luminous Agent, choose one Nova and the opposing Contender, then verify only that Nova is spent.",
  },
  {
    id: "activation-nested-x",
    synthetic: true,
    title: "Contract fixture · Nested X payment",
    description:
      "Synthetic adapter contract, not an audited printed card: declare X=2, accept the optional 1+X resource payment, and draw two cards. Decline spends nothing.",
  },
  {
    id: "effect-play-declarations",
    synthetic: true,
    title: "Contract fixture · Effect play declarations",
    description:
      "Synthetic recovery target: use Final Breath to play either same-name instance, declare X=2, discard one hand card, and pay the added white resource. Not a card-admission audit.",
  },
] as const;

export function createCommandContractFixture(id: string) {
  let game: Spec;
  if (id === "activation-cost-routes") {
    const magnate = getCard("ac-tp1-010");
    game = nativeFixtureState({
      id,
      turnNumber: 9,
      playerOne: {
        clash: [{ card: magnate, ready: false }],
        hand: [magnate],
        resource: [magnate, magnate, magnate],
      },
    });
  } else if (id === "activation-send-cost") {
    const stoking = getCard("ac-ac3-120");
    game = nativeFixtureState({
      id,
      turnNumber: 9,
      playerOne: {
        clash: [getCard("ac-ac3-117")],
        hand: [stoking, stoking],
        resource: Array.from({ length: 5 }, () => getCard("ac-ac6-162")),
      },
    });
    for (let i = 0; i < 2; i++) game.playerOne.playAndResolve(game.playerOne.at(stoking, "hand"));
  } else if (id === "activation-nested-x") {
    const source = clashCard({
      id: "nested-x-contract",
      name: "Nested X contract",
      affiliation: "alpha",
      colors: ["red"],
      cost: { total: 0 },
      attack: 3,
      defense: 3,
      abilities: [
        {
          kind: "activated",
          text: "Declare X. You may pay 1+X resources to draw X cards.",
          oncePerTurn: true,
          effects: [
            {
              type: "optional",
              prompt: "Pay 1+X to draw X?",
              cost: { kind: "resources", cost: { total: 1, pips: { red: 1 }, x: true } },
              effects: [{ type: "draw", amount: "x", controller: "friendly" }],
            },
          ],
        },
      ],
    });
    const red = getCard("ac-ac6-162");
    game = Spec.fromFixture({
      id,
      turnNumber: 9,
      definitions: [source],
      playerOne: {
        contender: getCard("ac-st-001"),
        clash: [source],
        resource: [red, red, red],
        deck: [red, red, red],
      },
      playerTwo: { contender: getCard("ac-ac1-096") },
    });
  } else if (id === "effect-play-declarations") {
    const target: AcClashCard = {
      ...clashCard({
        id: "recovery-contract",
        name: "Recovery contract",
        affiliation: "alpha",
        colors: ["blue"],
        cost: { total: 0, x: true },
        attack: 2,
        defense: 5,
      }),
      additionalDiscard: 1,
    };
    const breath = getCard("ac-ac5-084"),
      white = getCard("ac-ac1-051"),
      blue = getCard("ac-ac4-113");
    game = Spec.fromFixture({
      id,
      turnNumber: 9,
      definitions: [target],
      playerOne: {
        contender: getCard("ac-st-001"),
        hand: [breath, white],
        oblivion: [target, target],
        resource: [white, blue, blue],
        deck: [white, blue],
      },
      playerTwo: { contender: getCard("ac-ac1-096") },
    });
    game.playerOne.play(breath);
    for (let i = 0; i < 20 && game.state.responseWindow && !game.state.pendingChoices.length; i++)
      game.asPlayer(game.state.responseWindow.openFor).passRound();
  } else throw new Error(`Unknown command contract fixture: ${id}`);
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}
