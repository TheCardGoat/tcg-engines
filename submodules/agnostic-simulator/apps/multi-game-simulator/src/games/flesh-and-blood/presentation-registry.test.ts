import { createHash, webcrypto } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import type { PresentationEnvelope, PresentationRecords } from "@tcg/protocol/presentation";
import { emptyPresentationRecords } from "@tcg/protocol/presentation";
import { FabPresentationRegistry, prefetchFabBoardImages } from "./presentation-registry";
function envelope(id: string, name: string): PresentationEnvelope {
  return {
    kind: "full",
    bundle: {
      schemaVersion: 1,
      manifestId: id.repeat(64),
      catalog: {
        revision: id.repeat(64),
        url: `https://cdn.tcg.online/public/fab/presentation/${id.repeat(64)}.json`,
      },
      records: {
        card: {
          canonicalId: "card",
          slug: "card",
          name,
          defaultPrintingId: "plain",
          imageAspectRatio: 0.7,
          keywords: [],
          printings: { plain: { locale: "en-US" } },
        },
      },
      aliases: { plain: "card" },
    },
    supplements: emptyPresentationRecords(),
    bindings: { printingIdByInstanceId: { visible: "plain" } },
  };
}
describe("match-scoped presentation registry", () => {
  it("isolates revisions, installs duplicates idempotently, and rejects incompatible bases", () => {
    const first = new FabPresentationRegistry(envelope("a", "First"));
    const second = new FabPresentationRegistry(envelope("b", "Second"));
    expect(first.getSnapshot().resolver.nameForFabCardIdentity("card", undefined)).toBe("First");
    expect(second.getSnapshot().resolver.nameForFabCardIdentity("card", undefined)).toBe("Second");
    const listener = vi.fn();
    first.subscribe(listener);
    first.install(envelope("a", "First"));
    expect(listener).not.toHaveBeenCalled();
    expect(first.install(envelope("b", "Second"))).toBe(false);
    expect(first.getSnapshot().resolver.nameForFabCardIdentity("card", undefined)).toBe("First");
  });
  it("accepts cumulative supplements even after a missed update and replaces visibility bindings", () => {
    const registry = new FabPresentationRegistry(envelope("a", "First"));
    const supplements: PresentationRecords = {
      records: {
        token: {
          canonicalId: "token",
          slug: "token",
          name: "Token",
          imageAspectRatio: 1,
          keywords: [],
          printings: {},
        },
      },
      aliases: { "token:runtime": "token" },
    };
    registry.install({
      kind: "reference",
      manifestId: "a".repeat(64),
      supplements,
      bindings: { printingIdByInstanceId: {} },
    });
    expect(registry.getSnapshot().resolver.nameForFabCardIdentity("token:runtime", undefined)).toBe(
      "Token",
    );
    expect(registry.getSnapshot().bindings.printingIdByInstanceId).toEqual({});
    expect(registry.getBundle()?.records.token).toBeUndefined();
  });
  it("limits background image prefetch to four requests and tolerates failures", async () => {
    let active = 0;
    let peak = 0;
    const completions: (() => void)[] = [];
    const load = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          active++;
          peak = Math.max(peak, active);
          completions.push(() => {
            active--;
            resolve();
          });
        }),
    );
    const cancel = prefetchFabBoardImages(["1", "1", "2", "3", "4", "5", "6"], load);
    expect(load).toHaveBeenCalledTimes(4);
    completions.shift()?.();
    await Promise.resolve();
    await Promise.resolve();
    expect(peak).toBe(4);
    cancel();
    for (const complete of completions) complete();
    await Promise.resolve();
    expect(load.mock.calls.length).toBeLessThanOrEqual(5);
  });
});

it("recovers an omitted token once from the exact pinned artifact and installs it before notifying renders", async () => {
  vi.stubGlobal("crypto", webcrypto);
  const catalog = {
    schemaVersion: 1,
    game: "flesh-and-blood",
    records: {
      token: {
        canonicalId: "token",
        slug: "token",
        name: "Recovered Token",
        imageAspectRatio: 1,
        keywords: [],
        printings: {},
      },
    },
    aliases: {},
  };
  const bytes = JSON.stringify(catalog);
  const revision = createHash("sha256").update(bytes).digest("hex");
  const fetcher = vi.fn(async (_url: string) => new Response(bytes));
  vi.stubGlobal("fetch", fetcher);
  try {
    const initial = envelope("c", "Card");
    if (initial.kind !== "full") throw new Error("Expected full fixture");
    initial.bundle.catalog = {
      revision,
      url: `https://cdn.tcg.online/public/fab/presentation/${revision}.json`,
    };
    const first = new FabPresentationRegistry(initial);
    const second = new FabPresentationRegistry(initial);
    const renderedNames: (string | undefined)[] = [];
    first.subscribe(() =>
      renderedNames.push(first.getSnapshot().resolver.nameForFabCardIdentity("token", undefined)),
    );
    await Promise.all([
      first.ensure([{ canonicalId: "token" }]),
      second.ensure([{ canonicalId: "token" }]),
    ]);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[0]?.[0]).toBe(initial.bundle.catalog.url);
    expect(renderedNames).toEqual(["Recovered Token"]);
    await first.ensure([{ canonicalId: "token" }]);
    expect(fetcher).toHaveBeenCalledTimes(1);
  } finally {
    vi.unstubAllGlobals();
  }
});

it("resolves real fixture references while leaving invented cards as placeholders", async () => {
  vi.stubGlobal("crypto", webcrypto);
  try {
    const { fixturePresentationDefinitions } = await import("./fixture-presentation");
    const registry = new FabPresentationRegistry();
    await registry.ensure(
      fixturePresentationDefinitions([
        { canonicalId: "viz-blue-action", name: "Nimblism (Blue)" },
        { canonicalId: "viz-blood-debt-6", name: "Blood Debt Brute (6+)" },
      ]),
    );
    expect(registry.getRecords().aliases["viz-blue-action"]).toBe("cQD9DmppBQNGqb9CdqCRc");
    expect(
      registry.getSnapshot().resolver.resolveFabCardArt({ canonicalId: "viz-blue-action" })
        .boardImageUrl,
    ).toContain("/assets/board/");
    expect(registry.getRecords().aliases["viz-blood-debt-6"]).toBeUndefined();
    expect(
      registry.getSnapshot().resolver.resolveFabCardArt({ canonicalId: "viz-blood-debt-6" })
        .boardImageUrl,
    ).toBeUndefined();
    expect(registry.getSnapshot().error).toBeUndefined();
  } finally {
    vi.unstubAllGlobals();
  }
});

it("explicit retry recovers every consumer's pending descriptors after a shared failure", async () => {
  vi.stubGlobal("crypto", webcrypto);
  const descriptor = (canonicalId: string) => ({
    canonicalId,
    slug: canonicalId,
    name: canonicalId,
    imageAspectRatio: 1,
    keywords: [],
    printings: {},
  });
  const bytes = JSON.stringify({
    records: { first: descriptor("first"), second: descriptor("second") },
    aliases: {},
  });
  const revision = createHash("sha256").update(bytes).digest("hex");
  const fetcher = vi.fn().mockRejectedValue(new Error("offline"));
  vi.stubGlobal("fetch", fetcher);
  const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
  try {
    const initial = envelope("d", "Card");
    if (initial.kind !== "full") throw new Error("Expected full fixture");
    initial.bundle.catalog = {
      revision,
      url: `https://cdn.tcg.online/public/fab/presentation/${revision}.json`,
    };
    const registry = new FabPresentationRegistry(initial);
    await registry.ensure([{ canonicalId: "first" }]);
    await registry.ensure([{ canonicalId: "second" }]);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(registry.getSnapshot().error).toContain("offline");
    fetcher.mockResolvedValue(new Response(bytes));
    await registry.retry();
    expect(Object.keys(registry.getRecords().records)).toEqual(
      expect.arrayContaining(["first", "second"]),
    );
    expect(registry.getSnapshot().error).toBeUndefined();
    expect(fetcher).toHaveBeenCalledTimes(3);
  } finally {
    warning.mockRestore();
    vi.unstubAllGlobals();
  }
});
