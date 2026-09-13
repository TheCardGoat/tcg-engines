import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";
import { projectGrandArchiveViewerState } from "../projection/view.ts";
import {
  collectGrandArchiveLogContractIssues,
  GRAND_ARCHIVE_LOG_KEYS,
  GRAND_ARCHIVE_LOG_TEMPLATES,
  renderGrandArchiveLogTemplate,
} from "./messages.ts";
import { projectGrandArchiveViewerLog } from "./projection.ts";

function card(
  id: string,
  type: "ACTION" | "CHAMPION",
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: id,
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("log-champion", "CHAMPION");
const secret = card("log-secret-card", "ACTION");
const filler = card("log-filler", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([champion, secret, filler]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 8 },
      ...(id === "p1" ? [{ definitionId: secret.canonicalId, count: 1 }] : []),
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 828,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const secretObject = Object.values(state.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === secret.canonicalId,
  );
  if (!secretObject) throw new Error("Missing private log fixture card");
  return { program, state, p1, p2, secretObject };
}

describe("Grand Archive viewer log projection", () => {
  it("keeps a private-zone move's identity in the controller log only", () => {
    const fixture = setup();
    const transaction = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.secretObject.id,
        from: fixture.secretObject.zone,
        to: "hand",
      },
    ]);

    const ownerLog = projectGrandArchiveViewerLog(
      fixture.program,
      transaction.state,
      fixture.p1,
      transaction.result.events,
    );
    const opponentLog = projectGrandArchiveViewerLog(
      fixture.program,
      transaction.state,
      fixture.p2,
      transaction.result.events,
    );
    expect(ownerLog).toHaveLength(1);
    expect(ownerLog[0]).toMatchObject({
      key: "grand-archive.card.moved",
      values: { cardName: secret.canonicalId, from: "main-deck", to: "hand" },
    });
    expect(opponentLog).toHaveLength(1);
    expect(opponentLog[0]).toMatchObject({
      key: "grand-archive.card.moved.hidden",
      values: { from: "main-deck", to: "hand" },
    });
    expect(JSON.stringify(opponentLog)).not.toContain(secret.canonicalId);
  });

  it("shows revealed identities to every viewer but keeps look results private", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const reveal = kernel.transact(fixture.state, [
      {
        type: "card-revealed",
        objectId: fixture.secretObject.id,
        playerId: fixture.p1,
      },
    ]);
    for (const viewerId of [fixture.p1, fixture.p2]) {
      const log = projectGrandArchiveViewerLog(
        fixture.program,
        reveal.state,
        viewerId,
        reveal.result.events,
      );
      expect(log[0]).toMatchObject({
        key: "grand-archive.card.revealed",
        values: { cardName: secret.canonicalId },
      });
    }

    const looked = kernel.transact(fixture.state, [
      {
        type: "cards-looked-at",
        objectIds: [fixture.secretObject.id],
        playerId: fixture.p1,
      },
    ]);
    const ownerLog = projectGrandArchiveViewerLog(
      fixture.program,
      looked.state,
      fixture.p1,
      looked.result.events,
    );
    const opponentLog = projectGrandArchiveViewerLog(
      fixture.program,
      looked.state,
      fixture.p2,
      looked.result.events,
    );
    expect(ownerLog[0]).toMatchObject({
      key: "grand-archive.cards.looked-at.private",
      values: { cardNames: secret.canonicalId },
    });
    expect(opponentLog[0]).toMatchObject({
      key: "grand-archive.cards.looked-at",
      values: { count: 1 },
    });
    expect(JSON.stringify(opponentLog)).not.toContain(secret.canonicalId);
  });

  it("never exposes a private zone's resulting order", () => {
    const fixture = setup();
    const objectIds = fixture.state.zones[fixture.p1]["main-deck"];
    const reordered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "zone-reordered",
        playerId: fixture.p1,
        zone: "main-deck",
        objectIds: [...objectIds].reverse(),
        cause: { kind: "rule", rule: "test-fixture-order" },
      },
    ]);
    for (const viewerId of [fixture.p1, fixture.p2]) {
      const log = projectGrandArchiveViewerLog(
        fixture.program,
        reordered.state,
        viewerId,
        reordered.result.events,
      );
      expect(log[0]).toMatchObject({
        key: "grand-archive.zone.reordered",
        values: { count: objectIds.length, zone: "main-deck" },
      });
      expect(JSON.stringify(log)).not.toContain(secret.canonicalId);
    }
  });

  it("keeps a previously public identity in every viewer's face-down banishment log", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const field = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.secretObject.id,
        from: "main-deck",
        to: "field",
      },
    ]).state;
    const banished = kernel.transact(field, [
      {
        type: "object-moved",
        objectId: fixture.secretObject.id,
        from: "field",
        to: "banishment",
        entryFacing: "face-down",
      },
    ]);

    for (const viewerId of [fixture.p1, fixture.p2]) {
      const log = projectGrandArchiveViewerLog(
        fixture.program,
        banished.state,
        viewerId,
        banished.result.events,
      );
      expect(log[0]).toMatchObject({
        key: "grand-archive.card.moved",
        values: { cardName: secret.canonicalId, from: "field", to: "banishment" },
      });
    }
  });

  it("keeps one public card trackable when it alone enters an ordered private zone", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const field = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.secretObject.id,
        from: "main-deck",
        to: "field",
      },
    ]).state;
    const tracked = kernel.transact(field, [
      {
        type: "object-moved",
        objectId: fixture.secretObject.id,
        from: "field",
        to: "main-deck",
        placement: "top",
      },
    ]);

    for (const viewerId of [fixture.p1, fixture.p2]) {
      const log = projectGrandArchiveViewerLog(
        fixture.program,
        tracked.state,
        viewerId,
        tracked.result.events,
      );
      expect(log[0]).toMatchObject({
        key: "grand-archive.card.moved",
        values: { cardName: secret.canonicalId, from: "field", to: "main-deck" },
      });
    }
  });

  it("uses the authoritative object face name in logs and viewer state", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const field = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.secretObject.id,
        from: "main-deck",
        to: "field",
      },
    ]).state;
    const object = field.objects[fixture.secretObject.id];
    if (!object) throw new Error("Missing display-name fixture object");
    const renamed = {
      ...field,
      objects: {
        ...field.objects,
        [object.id]: { ...object, nameOverride: "Copied Secret" },
      },
    };
    const changed = kernel.transact(renamed, [
      { type: "counter-changed", objectId: object.id, counter: "buff", delta: 1 },
    ]);

    const log = projectGrandArchiveViewerLog(
      fixture.program,
      changed.state,
      fixture.p1,
      changed.result.events,
    );
    expect(log[0]).toMatchObject({ values: { cardName: "Copied Secret" } });

    const fieldView = projectGrandArchiveViewerState(
      fixture.program,
      changed.state,
      fixture.p1,
    ).players.find((player) => player.id === fixture.p1)!.zones.field;
    if (fieldView.visibility !== "visible") throw new Error("Field must be visible");
    expect(fieldView.objects.find((candidate) => candidate.id === object.id)?.name).toBe(
      "Copied Secret",
    );
  });

  it("keeps an event-time object name after the object leaves the match", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const field = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.secretObject.id,
        from: fixture.secretObject.zone,
        to: "field",
      },
    ]).state;
    const counter = kernel.transact(field, [
      { type: "counter-changed", objectId: fixture.secretObject.id, counter: "buff", delta: 1 },
    ]);
    const object = counter.state.objects[fixture.secretObject.id]!;
    const removed = kernel.transact(counter.state, [
      { type: "object-removed-from-game", object, losingPlayerId: fixture.p1 },
    ]).state;

    expect(
      projectGrandArchiveViewerLog(fixture.program, removed, fixture.p1, counter.result.events)[0],
    ).toMatchObject({ values: { cardName: secret.canonicalId } });
  });

  it("keeps every registered template complete and fully interpolated", () => {
    expect(Object.keys(GRAND_ARCHIVE_LOG_TEMPLATES).sort()).toEqual(
      [...GRAND_ARCHIVE_LOG_KEYS].sort(),
    );
    expect(collectGrandArchiveLogContractIssues()).toEqual([]);
    const rendered = renderGrandArchiveLogTemplate("grand-archive.card.moved", {
      playerId: "p1",
      cardName: "Test Card",
      from: "hand",
      to: "memory",
    });
    expect(rendered).toBe("p1 moved Test Card from hand to memory.");
  });
});
