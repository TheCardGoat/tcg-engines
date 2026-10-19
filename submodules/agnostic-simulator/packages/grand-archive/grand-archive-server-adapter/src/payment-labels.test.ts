import { describe, expect, it } from "vitest";
import { buildInteractionSubmission } from "@tcg/protocol";
import {
  adventOfTheStormcaller,
  creativeShock,
  pangTongYoungPhoenix,
  raiArchmage,
  raiManaWeaver,
  raiSpellcrafter,
  spiritOfFire,
  woodlandSquirrels,
} from "@tcg/grand-archive-cards";
import { GrandArchiveMatchRuntime } from "@tcg/grand-archive-engine/simulator";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { commandForGrandArchiveSubmission } from "./interaction.ts";
import { GrandArchiveServerEngine } from "./server-engine.ts";

describe("Grand Archive payment labels", () => {
  it.each([
    {
      source: adventOfTheStormcaller,
      payment: Array.from({ length: 12 }, () => woodlandSquirrels),
      label: "Pay with Woodland Squirrels ×12",
    },
    {
      source: creativeShock,
      payment: [pangTongYoungPhoenix, woodlandSquirrels, pangTongYoungPhoenix],
      label: "Pay with Pang Tong, Young Phoenix ×2, Woodland Squirrels",
    },
  ])("groups repeated names without changing payment identities: $label", (scenario) => {
    const fixture = GrandArchiveTestEngine.startFixture({
      playerOne: {
        id: "p1",
        champion: spiritOfFire,
        lineage: [raiSpellcrafter, raiArchmage, raiManaWeaver],
        zones: { hand: [scenario.source, ...scenario.payment] },
      },
      playerTwo: { id: "p2", champion: spiritOfFire },
    });
    const server = new GrandArchiveServerEngine(
      fixture.program,
      new GrandArchiveMatchRuntime(fixture.program, fixture.state),
    );
    const view = server.getInteractionView("p1");
    const action = view.actions.find(
      (entry) => entry.source?.definitionId === scenario.source.canonicalId,
    );
    if (!action) throw new Error("Expected native activation action");
    expect(action.text.key).toBe(
      `Activate ${scenario.source.layout.face.name} · ${scenario.label}`,
    );
    const submission = buildInteractionSubmission({ view, action, values: {} });
    const command = commandForGrandArchiveSubmission(server.runtime, "p1", submission)?.command;
    if (command?.move !== "activate-card") throw new Error("Expected native activation command");
    const expected = Object.values(server.runtime.state.objects)
      .filter(
        (object) => object.zone === "hand" && object.definitionId !== scenario.source.canonicalId,
      )
      .map((object) => ({ kind: "card", cardId: object.id }));
    expect(command.reservePayment).toHaveLength(expected.length);
    expect(command.reservePayment).toEqual(expect.arrayContaining(expected));
    expect(
      server.submitInteraction("p1", submission, {
        gameId: "payment-label-test",
        sourceAuthority: "server",
      }).success,
    ).toBe(true);
  });
});
