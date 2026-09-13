import { describe, expect, it } from "vitest";
import { nimblismBlue } from "./cards/actions/nimblism.ts";
import { nimblismRed } from "./cards/actions/nimblism.ts";
import { nimblismYellow } from "./cards/actions/nimblism.ts";
import {
  collectCreatedObjectSlugs,
  resolveStructuredCreatedObject,
} from "./created-object-dependencies.ts";

describe("created-object dependency closure", () => {
  it("collects create-token and modal token options but ignores runtime prizeToken data", () => {
    const slugs = collectCreatedObjectSlugs({
      effects: [
        { type: "create-token", token: "token:Cracked-Bauble" },
        {
          type: "choose-and-create-token",
          options: ["Frailty", "token:Inertia"],
        },
      ],
      runtimeEvent: { prizeToken: "gold" },
    });

    expect([...slugs].sort()).toEqual(["cracked-bauble", "frailty", "inertia"]);
  });

  it("rejects a missing authored dependency", () => {
    expect(() => resolveStructuredCreatedObject("missing-created-object", new Map())).toThrowError(
      'FAB created-object dependency "missing-created-object" cannot be resolved.',
    );
  });

  it("rejects an ambiguous colorless dependency with every candidate identity", () => {
    const structured = new Map([
      [nimblismRed.canonicalId, nimblismRed],
      [nimblismYellow.canonicalId, nimblismYellow],
      [nimblismBlue.canonicalId, nimblismBlue],
    ]);

    expect(() => resolveStructuredCreatedObject("nimblism", structured)).toThrowError(
      expect.objectContaining({
        message: expect.stringMatching(
          /nimblism-blue.*nimblism-red.*nimblism-yellow|nimblism-blue.*nimblism-yellow.*nimblism-red/,
        ),
      }),
    );
  });
});
