import { useEffect, useMemo, useState, type ReactNode } from "react";

import { CardImage } from "@tcg/simulator-ui";

/**
 * Ordered image ladder for FAB card art. Printing-keyed CDN URLs can 404 until
 * the ops asset sync (or for an individual missing printing), so surfaces may
 * supply board, printed, and upstream source candidates before their terminal
 * placeholder.
 *
 * Feed it the resolved chosen URL and matching fallback URLs from
 * `resolveFabCardArt`; spread the returned handlers onto the image component.
 */
export function useFabCardArtFallback({
  src,
  defaultSrc,
  fallbackSrcs = [],
}: {
  readonly src?: string;
  readonly defaultSrc?: string;
  readonly fallbackSrcs?: readonly (string | undefined)[];
}): {
  readonly src: string | undefined;
  readonly onImageError?: () => void;
} {
  const candidates = useMemo(
    () => [
      ...new Set([src, defaultSrc, ...fallbackSrcs].filter((url): url is string => Boolean(url))),
    ],
    [defaultSrc, fallbackSrcs, src],
  );
  const candidateKey = candidates.join("\u0000");
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [candidateKey]);

  const candidate = candidates[candidateIndex];
  if (!candidate) return { src: undefined };
  return {
    src: candidate,
    onImageError: () => setCandidateIndex((current) => current + 1),
  };
}

/** CardImage with the complete FAB artwork ladder applied. */
export function FabCardArtLadderImage({
  src,
  defaultSrc,
  fallbackSrcs,
  variant,
  className,
  fallback = null,
}: {
  readonly src?: string;
  readonly defaultSrc?: string;
  readonly fallbackSrcs?: readonly (string | undefined)[];
  readonly variant: "no-text" | "printed-fallback";
  readonly className?: string;
  readonly fallback?: ReactNode;
}) {
  const ladder = useFabCardArtFallback({ src, defaultSrc, fallbackSrcs });
  if (!ladder.src) return <>{fallback}</>;
  return (
    <CardImage
      className={className}
      src={ladder.src}
      alt=""
      data-art-variant={variant}
      onImageError={ladder.onImageError}
    />
  );
}
