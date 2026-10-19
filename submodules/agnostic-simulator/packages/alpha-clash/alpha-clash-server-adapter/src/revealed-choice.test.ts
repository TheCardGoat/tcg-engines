import { expect, test } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { projectState } from "@tcg/alpha-clash-engine";
import { AcTestEngine } from "@tcg/alpha-clash-engine/testing";
import { buildAlphaClashInteractionView } from "./interaction-protocol";

test("Clarity's native reveal decision names its visible card and cost", () => {
  const game = AcTestEngine.fromFixture({
    playerOne: {
      contender: getCard("ac-vtd1-001-p-black"),
      deck: [getCard("ac-ac1-001"), getCard("ac-ac1-028"), getCard("ac-ac1-027")],
    },
  });
  game.playerOne.attack(game.playerOne.contender(), game.playerTwo.contender());
  for (let index = 0; index < 2; index++) {
    const choice = game.state.pendingChoices[0];
    if (choice?.kind !== "modal") throw new Error("Expected native Foretell");
    game.run({
      type: "resolveChoice",
      playerId: "player-one",
      choiceId: choice.id,
      optionId: choice.options[0].id,
    });
  }
  const projected = projectState(game.state, "player-one");
  const view = buildAlphaClashInteractionView({
    actorId: "human",
    seat: "player-one",
    stateVersion: 3,
    playerView: projected,
  });
  const choice = view.actions[0];
  expect(choice.text.key).toBe(
    "Choose what happens to the revealed card. Revealed: Denver (cost 1).",
  );
  expect(choice.inputs[0].text?.key).toBe(choice.text.key);
  const otherView = buildAlphaClashInteractionView({
    actorId: "bot",
    seat: "player-two",
    stateVersion: 3,
    playerView: projectState(game.state, "player-two"),
  });
  expect(otherView.actions.some((action) => action.id.startsWith("resolveChoice:"))).toBe(false);
  const nativeChoice = game.state.pendingChoices[0];
  if (nativeChoice.kind !== "modal") throw new Error("Expected native reveal choice");
  game.run({
    type: "resolveChoice",
    playerId: "player-one",
    choiceId: nativeChoice.id,
    optionId: nativeChoice.options[1].id,
  });
  expect(game.playerOne.zone(getCard("ac-ac1-001"))).toBe("oblivion");
});
