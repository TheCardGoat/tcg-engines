import { expect, it } from "vitest";
import { getCard } from "@tcg/alpha-clash-cards";
import { projectState } from "@tcg/alpha-clash-engine";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildAlphaClashInteractionView } from "./interaction-protocol";
it("projects Distract and excludes that card from Obstruct candidates", () => {
  const bean = getCard("ac-ac5-036");
  const target = getCard("ac-ac6-175");
  const other = getCard("ac-ac4-047");
  const game = Spec.fromFixture({
    playerOne: { hand: [bean], resource: [bean, bean] },
    playerTwo: { clash: [target, other] },
  });
  const card = game.playerTwo.at(target, "clash");
  game.playerOne.play(bean, card);
  game.playerTwo.pass();
  game.playerOne.attack(game.playerOne.contender(), game.playerTwo.contender());
  game.playerTwo.pass();
  const projection = projectState(game.state, "player-two");
  expect(projection.cards.find((item) => item.instanceId === card.instanceId)?.distracted).toBe(
    true,
  );
  const view = buildAlphaClashInteractionView({
    actorId: "p2",
    seat: "player-two",
    stateVersion: 1,
    playerView: projection,
  });
  const action = view.actions.find((action) => action.id === "declareObstructors");
  const input = action?.inputs?.find((input) => input.id === "obstructorIds");
  if (!input || input.kind !== "entity-selection") throw new Error("Missing Obstruct input");
  expect(input.candidates.map((candidate) => candidate.entity.instanceId)).not.toContain(
    card.instanceId,
  );
  expect(input.candidates.map((candidate) => candidate.entity.instanceId)).toContain(
    game.playerTwo.at(other, "clash").instanceId,
  );
  expect(input.max).toBe(1);
  game.playerTwo.pass();
  expect(
    projectState(game.state, "player-two").cards.find((item) => item.instanceId === card.instanceId)
      ?.distracted,
  ).toBeUndefined();
});
