import { describe, expect, it } from "vite-plus/test";
import {
  GUNDAM_ROLLING_SOURCE_NAMESPACES,
  getGundamRollingPrintingReleaseEvidence,
} from "./catalog-source-policy.ts";

describe("Gundam rolling catalog source policy", () => {
  it("keeps the three publisher rolling namespaces explicit", () => {
    expect(GUNDAM_ROLLING_SOURCE_NAMESPACES).toEqual([
      "basic-cards",
      "other-product-card",
      "promotion-card",
    ]);
  });

  it("scopes a printing to an explicitly named audited release product", () => {
    expect(
      getGundamRollingPrintingReleaseEvidence("promotion-card", {
        getIt:
          "Booster Pack Freedom Ascension [GD05] Release Event Commemorative Items for Participants",
      }),
    ).toEqual({
      kind: "publisher_product_release_event",
      productSetCodes: ["GD05"],
      sourceLabel:
        "Booster Pack Freedom Ascension [GD05] Release Event Commemorative Items for Participants",
    });
  });

  it("preserves multi-product provenance instead of selecting one product date", () => {
    expect(
      getGundamRollingPrintingReleaseEvidence("promotion-card", {
        getIt:
          "Generation Pulse [ST10]/Eternal Nexus[EB01] Release Event Commemorative Items for Participants",
      }),
    ).toMatchObject({
      productSetCodes: ["ST10", "EB01"],
    });
  });

  it("does not infer a product from generic release-event labels", () => {
    expect(
      getGundamRollingPrintingReleaseEvidence("promotion-card", {
        getIt: "Booster Release Event",
      }),
    ).toBeNull();
    expect(
      getGundamRollingPrintingReleaseEvidence("promotion-card", {
        getIt: "Starter Release Event",
      }),
    ).toBeNull();
  });

  it("rejects labels without release-event evidence or audited product codes", () => {
    expect(
      getGundamRollingPrintingReleaseEvidence("other-product-card", {
        getIt: "Premium Card Collection [GD05]",
      }),
    ).toBeNull();
    expect(
      getGundamRollingPrintingReleaseEvidence("promotion-card", {
        getIt: "[FUTURE] Release Event",
      }),
    ).toBeNull();
    expect(
      getGundamRollingPrintingReleaseEvidence("gd05", {
        getIt: "[GD05] Release Event",
      }),
    ).toBeNull();
  });
});
