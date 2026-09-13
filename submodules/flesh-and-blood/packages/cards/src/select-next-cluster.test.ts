import { describe, expect, it } from "vitest";

import {
  familyPrefix,
  selectNextCluster,
  statusStem,
  type GapFamilyLike,
} from "../scripts/card-coverage/select-next-cluster.ts";

function family(
  id: string,
  opts: {
    kind?: GapFamilyLike["kind"];
    status?: GapFamilyLike["status"];
    primitive?: string | null;
    members?: readonly string[];
    repro?: string;
  } = {},
): GapFamilyLike {
  return {
    family: id,
    kind: opts.kind ?? "engine-primitive",
    primitive: opts.primitive === undefined ? null : opts.primitive,
    status: opts.status ?? "open",
    repro: opts.repro ?? id,
    members: (opts.members ?? ["X001"]).map((collectorNumber) => ({ collectorNumber })),
  };
}

const HAS_STATUS = "packages/engine/src/rules/evaluation/conditions/has-status.ts";
const MOVEMENT = "packages/engine/src/rules/proposals/card-movement-effects.ts";

describe("selectNextCluster", () => {
  it("skips resolved and out-of-scope families", () => {
    const cluster = selectNextCluster([
      family("multiplayer-any-hero", { kind: "out-of-scope", members: ["HVY000", "HVY001"] }),
      family("status/foo", { status: "resolved", members: ["AAA001", "AAA002", "AAA003"] }),
      family("binding/unstamped-it", { kind: "definition", members: ["UPR001"] }),
    ]);
    expect(cluster.families).toEqual(["binding/unstamped-it"]);
  });

  it("picks the densest in-scope family when unseeded", () => {
    const cluster = selectNextCluster([
      family("wager/reaction-layer-source", { members: ["A", "B", "C"] }),
      family("instead/targets-self", {
        kind: "definition",
        members: ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8"],
      }),
    ]);
    expect(cluster.families).toContain("instead/targets-self");
    expect(cluster.reason).toContain("instead/targets-self");
  });

  it("merges instead/ prefix siblings", () => {
    const cluster = selectNextCluster(
      [
        family("instead/targets-self", { kind: "definition", members: ["HNT226"] }),
        family("instead/amount-swap", { kind: "definition", members: ["ELE122"] }),
      ],
      "instead/targets-self",
    );
    expect(cluster.families).toEqual(["instead/amount-swap", "instead/targets-self"]);
  });

  it("merges families that share a member card", () => {
    const cluster = selectNextCluster([
      family("instead/targets-self", { kind: "definition", members: ["UPR006", "HNT226"] }),
      family("binding/unstamped-it", { kind: "definition", members: ["UPR006", "UPR007"] }),
      family("status/unrelated", { primitive: HAS_STATUS, members: ["MON192"] }),
    ]);
    expect(cluster.families).toEqual(["binding/unstamped-it", "instead/targets-self"]);
    expect([...cluster.members]).toEqual(["HNT226", "UPR006", "UPR007"]);
  });

  it("does not merge all has-status.ts families by primitive path", () => {
    const cluster = selectNextCluster(
      [
        family("status/card-put-into-your-banished-this-turn", {
          primitive: HAS_STATUS,
          members: ["A", "B", "C"],
        }),
        family("status/in-your-banished-zone", { primitive: HAS_STATUS, members: ["MON192"] }),
      ],
      "status/card-put-into-your-banished-this-turn",
    );
    expect(cluster.families).toEqual(["status/card-put-into-your-banished-this-turn"]);
  });

  it("merges N-or-more status stems", () => {
    const cluster = selectNextCluster(
      [
        family("status/1-or-more-cards-with-6-or-more-power-banished-this-way", {
          primitive: HAS_STATUS,
          members: ["MST236"],
        }),
        family("status/2-or-more-cards-with-6-or-more-power-banished-this-way", {
          primitive: HAS_STATUS,
          members: ["MST237"],
        }),
      ],
      "status/1-or-more-cards-with-6-or-more-power-banished-this-way",
    );
    expect(cluster.families).toHaveLength(2);
  });

  it("merges a specific (non-catch-all) primitive path", () => {
    const cluster = selectNextCluster(
      [
        family("amount/turned-face-down-this-way", { primitive: MOVEMENT, members: ["A"] }),
        family("amount/put-on-bottom-this-way", { primitive: MOVEMENT, members: ["B"] }),
      ],
      "amount/turned-face-down-this-way",
    );
    expect(cluster.families).toEqual([
      "amount/put-on-bottom-this-way",
      "amount/turned-face-down-this-way",
    ]);
    expect(cluster.primitiveHint).toBe(MOVEMENT);
  });

  it("throws when the seed family is missing or out of scope", () => {
    expect(() => selectNextCluster([], "nope")).toThrow(/No gap family/);
    expect(() =>
      selectNextCluster([family("status/foo", { status: "resolved" })], "status/foo"),
    ).toThrow(/not in scope/);
  });

  it("skips excluded families and picks the next densest", () => {
    const cluster = selectNextCluster(
      [
        family("instead/targets-self", {
          kind: "definition",
          members: ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8"],
        }),
        family("binding/unstamped-it", {
          kind: "definition",
          members: ["A", "B", "C", "D", "E", "F", "G"],
        }),
      ],
      undefined,
      ["instead/targets-self"],
    );
    expect(cluster.families).toEqual(["binding/unstamped-it"]);
  });

  it("yields an empty cluster when every in-scope family is excluded", () => {
    const cluster = selectNextCluster(
      [
        family("instead/targets-self", { kind: "definition", members: ["H1", "H2"] }),
        family("binding/unstamped-it", { kind: "definition", members: ["A"] }),
        family("multiplayer-any-hero", { kind: "out-of-scope", members: ["HVY000"] }),
      ],
      undefined,
      ["instead/targets-self", "binding/unstamped-it"],
    );
    expect(cluster.families).toEqual([]);
    expect(cluster.reason).toMatch(/exclude/);
  });
});

describe("familyPrefix / statusStem", () => {
  it("splits on the first slash", () => {
    expect(familyPrefix("instead/targets-self")).toBe("instead");
    expect(familyPrefix("lonely")).toBe("lonely");
  });

  it("stems N-or-more and didnt- status slugs", () => {
    expect(statusStem("status/1-or-more-cards-with-6-or-more-power-banished-this-way")).toBe(
      "cards-with-6-or-more-power-banished-this-way",
    );
    expect(statusStem("status/didnt-banish-this-way-card-with-6-or-more-p")).toBe(
      "banish-this-way-card-with-6-or-more-p",
    );
    expect(statusStem("binding/unstamped-it")).toBeNull();
  });
});
