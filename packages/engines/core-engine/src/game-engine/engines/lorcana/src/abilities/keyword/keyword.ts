import type { Effect } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type { BodyGuardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { ChallengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import type { EvasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { RecklessAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/recklessAbility";
import type { ResistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import type { RushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import type { ShiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { SingerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singerAbility";
import type { SingTogetherAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singTogetherAbility";
import type { SupportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { VanishAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/vanishAbility";
import type { VoicelessAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/voicelessAbility";
import type { WardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import type { LorcanaBaseAbility } from "../ability-types";

export * from "./bodyguardAbility";
export * from "./challengerAbility";
export * from "./evasiveAbility";
export * from "./recklessAbility";
export * from "./resistAbility";
export * from "./rushAbility";
export * from "./shiftAbility";
export * from "./singerAbility";
export * from "./singTogetherAbility";
export * from "./supportAbility";
export * from "./vanishAbility";
export * from "./voicelessAbility";
export * from "./wardAbility";

export type LorcanaKeywords =
  | "singer"
  | "voiceless"
  | "shift"
  | "challenger"
  | "sing-together"
  | "bodyguard"
  | "rush"
  | "reckless"
  | "evasive"
  | "resist"
  | "support"
  | "ward"
  | "vanish";

export interface LorcanaBaseKeywordAbility extends LorcanaBaseAbility {
  type: "keyword";
  keyword: LorcanaKeywords;
  text: string; // Required to match base Ability type
  name?: string;
  effects: Effect[];
}

export type LorcanaKeywordAbility =
  | WardAbility
  | VoicelessAbility
  | EvasiveAbility
  | BodyGuardAbility
  | RecklessAbility
  | ResistAbility
  | VanishAbility
  | ChallengerAbility
  | RushAbility
  | ShiftAbility
  | SupportAbility
  | SingerAbility
  | SingTogetherAbility;
