import { expect, it } from "vitest";
import { grandArchiveObjectId, grandArchivePlayerId } from "../game/identity.ts";
import { observeGrandArchiveProposedEvent } from "./observed-events.ts";

it("omits an absent keyword-action subject without losing a zero amount", () => {
  const [observed] = observeGrandArchiveProposedEvent({
    type: "keyword-action-performed",
    playerId: grandArchivePlayerId("player-one"),
    action: "empower",
    objectIds: [],
    amount: 0,
  });
  expect(observed).toMatchObject({ name: "keyword-action-performed", amount: 0 });
  expect(observed).not.toHaveProperty("subjectId");
  const subjectId = grandArchiveObjectId("card-one");
  const [withSubject] = observeGrandArchiveProposedEvent({
    type: "keyword-action-performed",
    playerId: grandArchivePlayerId("player-one"),
    action: "gather",
    objectIds: [subjectId],
  });
  expect(withSubject).toHaveProperty("subjectId", subjectId);
  expect(withSubject).not.toHaveProperty("amount");
});
