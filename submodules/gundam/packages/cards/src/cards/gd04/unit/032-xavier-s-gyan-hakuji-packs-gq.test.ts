import { describe, it } from "vite-plus/test";
import { expectUnitCanDeploy } from "@tcg/gundam-engine";
import { gd04XavierSGyanHakujiPacksGq032 } from "./032-xavier-s-gyan-hakuji-packs-gq.ts";

describe("Xavier's Gyan Hakuji-Packs (GQ) (GD04-032)", () => {
  it("deploys from hand to the battle area", () =>
    expectUnitCanDeploy(gd04XavierSGyanHakujiPacksGq032));
});
