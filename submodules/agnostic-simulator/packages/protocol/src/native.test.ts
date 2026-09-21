import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { z } from "zod";
import { NativeClientMessage, NativeServerMessage } from "./native.ts";
import messages from "../fixtures/native/messages.json";

describe("native v1", () => {
  it("accepts portable examples and keeps generated schemas current", () => {
    for (const message of messages.client)
      expect(NativeClientMessage.safeParse(message).success).toBe(true);
    for (const message of messages.server)
      expect(NativeServerMessage.safeParse(message).success).toBe(true);
    for (const [name, schema] of [
      ["client", NativeClientMessage],
      ["server", NativeServerMessage],
    ] as const)
      expect(
        JSON.parse(
          readFileSync(new URL(`../fixtures/native/${name}.schema.json`, import.meta.url), "utf8"),
        ),
      ).toEqual(z.toJSONSchema(schema, { io: "input", reused: "ref" }));
  });
  it("requires exactly two fixture IDs in runtime and portable schema", () => {
    const schema = JSON.parse(
      readFileSync(new URL("../fixtures/native/client.schema.json", import.meta.url), "utf8"),
    );
    const join = schema.oneOf
      .map((entry: { $ref: string }) => schema.$defs[entry.$ref.split("/").at(-1)!])
      .find(
        (entry: { properties: { type: { const: string } } }) =>
          entry.properties.type.const === "join_game",
      );
    expect(join.properties.fixtureIds).toMatchObject({ type: "array", minItems: 2, maxItems: 2 });
    for (const length of [0, 1, 2, 3]) {
      const fixtureIds = Array.from({ length }, (_, index) => `deck-${index}`);
      expect(NativeClientMessage.safeParse({ v: 1, type: "join_game", fixtureIds }).success).toBe(
        length === 2,
      );
    }
  });
  it("rejects unsupported envelopes, actor authority and mismatched interaction guards", () => {
    const submit = messages.client.find((message) => message.type === "submit_interaction")!;
    for (const message of [
      { ...submit, v: 2 },
      { ...submit, actorId: "opponent" },
      { ...submit, expectedVersion: 8 },
      { ...submit, correlationId: "different" },
      { ...submit, expectedVersion: Number.MAX_SAFE_INTEGER + 1 },
      { v: 1, type: "join_game" },
      { v: 1, type: "join_game", gameId: "g", fixtureIds: ["a", "b"] },
      { v: 1, type: "execute_move", payload: {} },
    ])
      expect(NativeClientMessage.safeParse(message).success).toBe(false);
  });
});
