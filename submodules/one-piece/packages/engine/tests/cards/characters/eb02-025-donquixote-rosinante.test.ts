import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb02DonquixoteRosinante022,
  eb02DonquixoteRosinante025,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-025 Donquixote Rosinante", () => {
  test("rests DON!! and itself before playing an eligible top-five Character rested", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb02DonquixoteRosinante022,
      character: [{ card: eb02DonquixoteRosinante025, playedOnTurn: 0 }],
      deck: [
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
      ],
      activeDon: 1,
    });
    const rosinanteId = engine.findCardInZone("south", "character", eb02DonquixoteRosinante025);
    const eligibleId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.activateEffect(rosinanteId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const play = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Rosinante's top-five choice.");
    expect(play.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(true);
    expect(play.candidates.filter((candidate) => candidate.legal)).toHaveLength(2);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Rosinante's deck order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === rosinanteId)?.rested,
    ).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
