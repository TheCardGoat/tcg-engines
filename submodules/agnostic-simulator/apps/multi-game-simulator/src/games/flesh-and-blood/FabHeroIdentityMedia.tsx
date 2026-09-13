import { CardImage } from "@tcg/simulator-ui";

import { isFabSubscriber, useFabHeroMedia } from "./heroMedia";

export interface FabHeroIdentityMediaProps {
  readonly heroName?: string;
  /** Subscription state belongs to the player whose hero identity is rendered,
   * not necessarily the local viewer. Premium media follows its content owner
   * for both self and opponent presentations. */
  readonly ownerSubscriptionTier?: string;
  readonly fallbackPortraitUrl?: string;
  readonly className: string;
  readonly videoClassName: string;
  readonly videoTestId?: string;
  readonly loading?: "eager" | "lazy";
}

/**
 * Renders the visual media layer for a FAB hero identity.
 *
 * Static hero art is the universal fallback. When the rendered identity's
 * owner is a subscriber and the hero asset catalog provides a video, the
 * video replaces that static background while retaining the portrait poster.
 */
export function FabHeroIdentityMedia({
  heroName,
  ownerSubscriptionTier,
  fallbackPortraitUrl,
  className,
  videoClassName,
  videoTestId,
  loading = "eager",
}: FabHeroIdentityMediaProps) {
  const media = useFabHeroMedia(heroName);
  const portraitUrl = media?.portraitUrl ?? fallbackPortraitUrl;
  const videoUrl = isFabSubscriber(ownerSubscriptionTier) ? media?.videoUrl : undefined;

  return (
    <div
      className={className}
      style={media && !videoUrl ? { backgroundImage: `url(${media.backgroundUrl})` } : undefined}
      data-media-kind={videoUrl ? "video" : portraitUrl ? "image" : "empty"}
      aria-hidden="true"
    >
      {portraitUrl ? <CardImage src={portraitUrl} alt="" loading={loading} /> : null}
      {videoUrl ? (
        <video
          className={videoClassName}
          {...(videoTestId ? { "data-testid": videoTestId } : {})}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={media?.portraitUrl ?? fallbackPortraitUrl}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
