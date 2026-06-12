import type { GundamG } from "../../../types.ts";
import type { FrameworkWriteAPI } from "../../../../types/move-types.ts";

export type BattleEffCtx = {
  G: GundamG;
  sourcePlayerId: string;
  sourceCardId: string;
  framework: FrameworkWriteAPI;
};
