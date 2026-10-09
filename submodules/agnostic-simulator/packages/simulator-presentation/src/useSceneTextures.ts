import { useEffect, useRef, useState } from "react";
import { SRGBColorSpace, type Texture } from "three";
import { loadSceneTexture } from "./scene-texture";

export interface SceneTextureRecord {
  texture?: Texture;
  failed: boolean;
  abort: AbortController;
}
export interface SceneTextureStatus {
  loading: number;
  failed: string[];
}
/** Mounted-board cache extracted from Grand Archive. Deduplicates and drops hidden faces. */
export function useSceneTextures(
  urls: readonly string[],
  retryKey?: unknown,
  onStatus?: (status: SceneTextureStatus) => void,
) {
  const records = useRef(new Map<string, SceneTextureRecord>());
  const previousRetryKey = useRef(retryKey);
  const [, refresh] = useState(0);
  const callback = useRef(onStatus);
  callback.current = onStatus;
  const signature = JSON.stringify([...new Set(urls)].sort());
  useEffect(() => {
    const liveUrls: string[] = JSON.parse(signature);
    const live = new Set(liveUrls);
    const retry = previousRetryKey.current !== retryKey;
    previousRetryKey.current = retryKey;
    const report = () =>
      callback.current?.({
        loading: [...records.current.values()].filter((r) => !r.texture && !r.failed).length,
        failed: [...records.current].filter(([, r]) => r.failed).map(([url]) => url),
      });
    for (const [url, record] of records.current)
      if (!live.has(url) || (record.failed && retry)) {
        record.abort.abort();
        record.texture?.dispose();
        records.current.delete(url);
      }
    for (const url of liveUrls) {
      if (records.current.has(url)) continue;
      const record: SceneTextureRecord = { failed: false, abort: new AbortController() };
      records.current.set(url, record);
      void loadSceneTexture(url, record.abort.signal).then(
        (texture) => {
          if (records.current.get(url) !== record) {
            texture.dispose();
            return;
          }
          texture.colorSpace = SRGBColorSpace;
          texture.anisotropy = 4;
          record.texture = texture;
          refresh((v) => v + 1);
          report();
        },
        () => {
          if (records.current.get(url) !== record) return;
          record.failed = true;
          refresh((v) => v + 1);
          report();
        },
      );
    }
    report();
  }, [signature, retryKey]);
  useEffect(
    () => () => {
      for (const record of records.current.values()) {
        record.abort.abort();
        record.texture?.dispose();
      }
      records.current.clear();
    },
    [],
  );
  return records.current;
}
