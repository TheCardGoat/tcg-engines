import { Button } from "@mantine/core";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { PresentationEnvelopeSchema, type PresentationEnvelope } from "@tcg/protocol/presentation";
import { useSimulatorRoute, useSimulatorUserSettings } from "../../simulator/providers";
import { normalizeFabAssetLocale } from "./cardArt";
import { FabPresentationRegistry, prefetchFabBoardImages } from "./presentation-registry";

const FabCardLocaleContext = createContext("en-US");
const RegistryContext = createContext<FabPresentationRegistry | null>(null);
export const useFabCardLocale = () => useContext(FabCardLocaleContext);
export function useFabPresentationRegistry() {
  const inherited = useContext(RegistryContext);
  if (!inherited) throw new Error("FAB card presentation requires FabPresentationCatalogProvider");
  return inherited;
}
export function useFabCardArt() {
  const registry = useFabPresentationRegistry();
  return useSyncExternalStore(registry.subscribe, registry.getSnapshot, registry.getSnapshot)
    .resolver;
}

/** Routes remain usable while individual appearances recover. */
export function FabPresentationCatalogProvider({
  children,
  locale,
  initial,
}: {
  children: ReactNode;
  locale?: string;
  initial?: PresentationEnvelope;
}) {
  const [registry] = useState(() => new FabPresentationRegistry(initial));
  const snapshot = useSyncExternalStore(
    registry.subscribe,
    registry.getSnapshot,
    registry.getSnapshot,
  );
  const normalizedLocale = normalizeFabAssetLocale(locale);
  // Prefetch the seated match set only. A full identity catalog is thousands of
  // board crops and must not be warmed just because tests seeded the index.
  useEffect(() => {
    const records = Object.values(registry.getRecords().records);
    if (records.length > 128) return;
    const urls = records.flatMap((record) => {
      const printings = [record.defaultPrintingId, ...Object.keys(record.printings)];
      return printings.flatMap((printingId) => {
        const url = snapshot.resolver.resolveFabCardArt({
          canonicalId: record.canonicalId,
          printingId,
          locale: normalizedLocale,
        }).boardImageUrl;
        return url ? [url] : [];
      });
    });
    return prefetchFabBoardImages(urls);
  }, [registry, snapshot.resolver, normalizedLocale]);
  return (
    <RegistryContext.Provider value={registry}>
      <FabCardLocaleContext.Provider value={normalizedLocale}>
        {snapshot.error ? (
          <div
            role="status"
            className="flex items-center gap-2 p-2"
            data-testid="fab-presentation-warning"
          >
            Some card images are unavailable.
            <Button
              size="compact-xs"
              onClick={() => {
                void registry.retry();
              }}
            >
              Retry images
            </Button>
          </div>
        ) : null}
        {children}
      </FabCardLocaleContext.Provider>
    </RegistryContext.Provider>
  );
}

/** Bootstrap preference wins over the page language; observe language changes
 * so a future locale picker can update mounted card surfaces without a reload. */
export function FabRoutePresentationCatalog({ children }: { children: ReactNode }) {
  const inherited = useContext(RegistryContext);
  const { userSettings } = useSimulatorUserSettings();
  const { matchPageData, session } = useSimulatorRoute();
  const pregameData = session?.phase === "preparation" ? session.preparation : undefined;
  const raw =
    matchPageData?.game.presentation ??
    (pregameData && typeof pregameData === "object" && "presentation" in pregameData
      ? pregameData.presentation
      : undefined);
  const initial = PresentationEnvelopeSchema.safeParse(raw);
  const [pageLocale, setPageLocale] = useState(() =>
    typeof document === "undefined" ? "en-US" : document.documentElement.lang,
  );
  useEffect(() => {
    const observer = new MutationObserver(() => setPageLocale(document.documentElement.lang));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    return () => observer.disconnect();
  }, []);
  // Tests and local shells seed a registry outside the route. Do not replace it
  // with an empty match-page catalog when the live payload is absent.
  if (inherited && !initial.success) {
    return children;
  }
  return (
    <FabPresentationCatalogProvider
      key={
        matchPageData?.match.matchId ??
        (pregameData && typeof pregameData === "object" && "matchId" in pregameData
          ? String(pregameData.matchId)
          : "local")
      }
      initial={initial.success ? initial.data : undefined}
      locale={userSettings?.locale ?? matchPageData?.userSettings?.locale ?? pageLocale}
    >
      {children}
    </FabPresentationCatalogProvider>
  );
}
