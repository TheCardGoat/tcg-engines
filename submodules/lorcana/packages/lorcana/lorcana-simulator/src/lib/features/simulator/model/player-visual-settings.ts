/**
 * Player Visual Settings
 *
 * Per-player cosmetic settings (card back, playmat) used by the simulator.
 *
 * ## Data flow
 * - **Storage**: Persisted in `users.settings.visualSettings` and `users.settings.gameVisualSettings.lorcana`.
 * - **Save**: `PUT /v1/users/me/settings` with `{ visualSettings, gameVisualSettings: { lorcana } }`.
 * - **Load**: Included in the `game_joined` WebSocket message as `playerVisualSettings` map.
 *
 * ## Player ID mapping
 * `LorcanaPlayerSettingsMap` is keyed by playerId, which can be:
 * - A **userId** in practice matches (player1Id = userId).
 * - A **gameProfileId** in ranked/matchmade matches (player1Id = gameProfileId).
 *
 * The server resolves both cases when building the map for `game_joined`.
 * On the client side, the key always matches whatever the engine uses as owner IDs.
 */

import { buildSimulatorAssetUrl } from "$lib/config/public-url-config.js";

export interface LorcanaPlayerVisualSettings {
  cardBack?: string;
  playmat?: string;
}

export type LorcanaPlayerSettingsMap = Partial<Record<string, LorcanaPlayerVisualSettings>>;

export interface LorcanaResolvedCardBack {
  id: string;
  src: string;
  artOnlySrc: string;
}

export interface LorcanaResolvedPlaymat {
  id: string;
  src: string | null;
}

export interface LorcanaResolvedPlayerVisualSettings {
  cardBack: LorcanaResolvedCardBack;
  playmat: LorcanaResolvedPlaymat;
}

export const CARD_BACK_PRESETS = {
  none: null,
  default: {
    src: buildSimulatorAssetUrl("card-back/card-back.webp"),
    artOnlySrc: buildSimulatorAssetUrl("card-back/card-back-square.webp"),
  },
  white: {
    src: buildSimulatorAssetUrl("card-back/back-white.webp"),
    artOnlySrc: buildSimulatorAssetUrl("card-back/back-white-square.webp"),
  },
  yellow: {
    src: buildSimulatorAssetUrl("card-back/back-yellow.webp"),
    artOnlySrc: buildSimulatorAssetUrl("card-back/back-yellow-square.webp"),
  },
  cosmos: {
    src: buildSimulatorAssetUrl("card-back/back-cosmos.webp"),
    artOnlySrc: buildSimulatorAssetUrl("card-back/back-cosmos-square.webp"),
  },
  ariel: {
    src: buildSimulatorAssetUrl("card-back/sleeve-ariel.webp"),
    artOnlySrc: buildSimulatorAssetUrl("card-back/sleeve-ariel.webp"),
  },
  cendrillon: {
    src: buildSimulatorAssetUrl("card-back/sleeve-cendrillon.webp"),
    artOnlySrc: buildSimulatorAssetUrl("card-back/sleeve-cendrillon.webp"),
  },
  minniee: {
    src: buildSimulatorAssetUrl("card-back/sleeve-minniee.webp"),
    artOnlySrc: buildSimulatorAssetUrl("card-back/sleeve-minniee.webp"),
  },
  _0001: {
    src: buildSimulatorAssetUrl("card-back/sleeve_0001.webp"),
    artOnlySrc: buildSimulatorAssetUrl("card-back/sleeve_0001.webp"),
  },
  bella: {
    src: buildSimulatorAssetUrl("card-back/sleevee-bella.webp"),
    artOnlySrc: buildSimulatorAssetUrl("card-back/sleevee-bella.webp"),
  },
  jasmine: {
    src: buildSimulatorAssetUrl("card-back/sleevejasminewebp.webp"),
    artOnlySrc: buildSimulatorAssetUrl("card-back/sleevejasminewebp.webp"),
  },
} as const satisfies Record<string, { src: string; artOnlySrc: string } | null>;

export const PLAYMAT_PRESETS = {
  default: null,
  "005": buildSimulatorAssetUrl("playmats/005.webp"),
  "beast-001": buildSimulatorAssetUrl("playmats/beast-001.webp"),
  bela: buildSimulatorAssetUrl("playmats/bela.webp"),
  "belle-001": buildSimulatorAssetUrl("playmats/belle-001.webp"),
  besouro: buildSimulatorAssetUrl("playmats/besouro.webp"),
  cat: buildSimulatorAssetUrl("playmats/cat.webp"),
  corrida: buildSimulatorAssetUrl("playmats/corrida.webp"),
  corridadenovo: buildSimulatorAssetUrl("playmats/corridadenovo.webp"),
  dodnal: buildSimulatorAssetUrl("playmats/dodnal.webp"),
  donal: buildSimulatorAssetUrl("playmats/donal.webp"),
  dragao: buildSimulatorAssetUrl("playmats/dragao.webp"),
  emerald: buildSimulatorAssetUrl("playmats/emerald.webp"),
  elsa: buildSimulatorAssetUrl("playmats/elsa_bg.webp"),
  fogogelo: buildSimulatorAssetUrl("playmats/fogogelo.webp"),
  genio: buildSimulatorAssetUrl("playmats/genio.webp"),
  hiro: buildSimulatorAssetUrl("playmats/hiro.webp"),
  lorcana_1: buildSimulatorAssetUrl("playmats/lorcana_1.webp"),
  "malificent-001": buildSimulatorAssetUrl("playmats/malificent-001.webp"),
  "maui-001": buildSimulatorAssetUrl("playmats/maui-001.webp"),
  "mickey-001": buildSimulatorAssetUrl("playmats/mickey-001.webp"),
  "moana-001": buildSimulatorAssetUrl("playmats/moana-001.webp"),
  moana: buildSimulatorAssetUrl("playmats/moana.webp"),
  mulan: buildSimulatorAssetUrl("playmats/mulan.webp"),
  pooh: buildSimulatorAssetUrl("playmats/pooh.webp"),
  "pooh-001": buildSimulatorAssetUrl("playmats/pooh-001.webp"),
  "rapunzel-001": buildSimulatorAssetUrl("playmats/rapunzel-001.webp"),
  "rapunzel-002": buildSimulatorAssetUrl("playmats/rapunzel-002.webp"),
  "stitch-001": buildSimulatorAssetUrl("playmats/stitch-001.webp"),
  "stitch-002": buildSimulatorAssetUrl("playmats/stitch-002.webp"),
  "tinker-bell-001": buildSimulatorAssetUrl("playmats/tinker-bell-001.webp"),
} as const satisfies Record<string, string | null>;

export const DEFAULT_LORCANA_CARD_BACK_ID = "default";
export const DEFAULT_LORCANA_PLAYMAT_ID = "default";

export const DEFAULT_LORCANA_PLAYER_VISUAL_SETTINGS: LorcanaResolvedPlayerVisualSettings = {
  cardBack: {
    id: DEFAULT_LORCANA_CARD_BACK_ID,
    ...CARD_BACK_PRESETS.default,
  },
  playmat: {
    id: DEFAULT_LORCANA_PLAYMAT_ID,
    src: PLAYMAT_PRESETS.default,
  },
};

function isExternalAsset(value: string): boolean {
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/") ||
    value.startsWith("data:")
  );
}

export function resolveLorcanaCardBack(selection?: string | null): LorcanaResolvedCardBack {
  if (!selection) {
    return DEFAULT_LORCANA_PLAYER_VISUAL_SETTINGS.cardBack;
  }

  if (isExternalAsset(selection)) {
    return {
      id: selection,
      src: selection,
      artOnlySrc: selection,
    };
  }

  const preset = CARD_BACK_PRESETS[selection as keyof typeof CARD_BACK_PRESETS];
  if (preset === undefined || preset === null) {
    return DEFAULT_LORCANA_PLAYER_VISUAL_SETTINGS.cardBack;
  }

  return {
    id: selection,
    ...preset,
  };
}

export function resolveLorcanaPlaymat(selection?: string | null): LorcanaResolvedPlaymat {
  if (!selection) {
    return DEFAULT_LORCANA_PLAYER_VISUAL_SETTINGS.playmat;
  }

  if (isExternalAsset(selection)) {
    return {
      id: selection,
      src: selection,
    };
  }

  const preset = PLAYMAT_PRESETS[selection as keyof typeof PLAYMAT_PRESETS];
  if (preset === undefined) {
    return DEFAULT_LORCANA_PLAYER_VISUAL_SETTINGS.playmat;
  }

  return {
    id: selection,
    src: preset,
  };
}

export function resolveLorcanaPlayerVisualSettings(
  playerSettings: LorcanaPlayerVisualSettings | null | undefined,
): LorcanaResolvedPlayerVisualSettings {
  return {
    cardBack: resolveLorcanaCardBack(playerSettings?.cardBack),
    playmat: resolveLorcanaPlaymat(playerSettings?.playmat),
  };
}

export function getLorcanaPlayerVisualSettings(
  playerSettingsByOwnerId: LorcanaPlayerSettingsMap | null | undefined,
  ownerId: string | null | undefined,
): LorcanaResolvedPlayerVisualSettings {
  if (!ownerId) {
    return DEFAULT_LORCANA_PLAYER_VISUAL_SETTINGS;
  }

  return resolveLorcanaPlayerVisualSettings(playerSettingsByOwnerId?.[ownerId]);
}
