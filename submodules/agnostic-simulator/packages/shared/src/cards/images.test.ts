/**
 * Card Image Resolution Tests
 */

import { describe, expect, it } from "bun:test";
import {
  ImageFormat,
  ImageSize,
  ImageSource,
  buildLorcastUrl,
  buildLorcastUrls,
  buildLorcanaImageRefs,
  buildRavensburgerImageRefs,
  convertImageSize,
  getLargerSize,
  getSmallerSize,
  isValidImageUrl,
  resolveAllCardImages,
  resolveCardImage,
  validateImageRefs,
} from "./images";

describe("Image Resolution", () => {
  describe("buildLorcastUrl", () => {
    it("should build normal size AVIF URL by default", () => {
      const url = buildLorcastUrl("crd_abc123");
      expect(url).toBe("https://cards.lorcast.io/card/digital/normal/crd_abc123.avif");
    });

    it("should build small size URL", () => {
      const url = buildLorcastUrl("crd_abc123", ImageSize.SMALL);
      expect(url).toBe("https://cards.lorcast.io/card/digital/small/crd_abc123.avif");
    });

    it("should build WebP URL", () => {
      const url = buildLorcastUrl("crd_abc123", ImageSize.NORMAL, ImageFormat.WEBP);
      expect(url).toBe("https://cards.lorcast.io/card/digital/normal/crd_abc123.webp");
    });
  });

  describe("buildLorcastUrls", () => {
    it("should build URLs for all sizes", () => {
      const urls = buildLorcastUrls("crd_abc123");
      expect(urls.small).toBe("https://cards.lorcast.io/card/digital/small/crd_abc123.avif");
      expect(urls.normal).toBe("https://cards.lorcast.io/card/digital/normal/crd_abc123.avif");
      expect(urls.large).toBe("https://cards.lorcast.io/card/digital/large/crd_abc123.avif");
      expect(urls.artCrop).toBe("https://cards.lorcast.io/card/digital/art_crop/crd_abc123.avif");
    });
  });

  describe("resolveCardImage", () => {
    it("should prefer Lorcast over Ravensburger", () => {
      const url = resolveCardImage({
        lorcastId: "crd_abc123",
        ravensburgerUrl: "https://ravensburger.example.com/image.jpg",
      });
      expect(url).toContain("cards.lorcast.io");
    });

    it("should fall back to Ravensburger when no Lorcast ID", () => {
      const url = resolveCardImage({
        ravensburgerUrl: "https://ravensburger.example.com/image.jpg",
      });
      expect(url).toBe("https://ravensburger.example.com/image.jpg");
    });

    it("should return undefined when no sources available", () => {
      const url = resolveCardImage({});
      expect(url).toBeUndefined();
    });

    it("should respect source priority order", () => {
      const url = resolveCardImage(
        {
          lorcastId: "crd_abc123",
          ravensburgerUrl: "https://ravensburger.example.com/image.jpg",
        },
        { sourcePriority: [ImageSource.RAVENSBURGER, ImageSource.LORCAST] },
      );
      expect(url).toBe("https://ravensburger.example.com/image.jpg");
    });
  });

  describe("resolveAllCardImages", () => {
    it("should return all sizes for Lorcast ID", () => {
      const urls = resolveAllCardImages({ lorcastId: "crd_abc123" });
      expect(urls.small).toBeDefined();
      expect(urls.normal).toBeDefined();
      expect(urls.large).toBeDefined();
      expect(urls.artCrop).toBeDefined();
    });

    it("should use same URL for all sizes when no Lorcast ID", () => {
      const urls = resolveAllCardImages({
        ravensburgerUrl: "https://example.com/image.jpg",
      });
      expect(urls.small).toBe("https://example.com/image.jpg");
      expect(urls.normal).toBe("https://example.com/image.jpg");
      expect(urls.large).toBe("https://example.com/image.jpg");
    });
  });

  describe("convertImageSize", () => {
    it("should convert Lorcast URL to different size", () => {
      const url = "https://cards.lorcast.io/card/digital/normal/crd_abc123.avif";
      const largeUrl = convertImageSize(url, ImageSize.LARGE);
      expect(largeUrl).toBe("https://cards.lorcast.io/card/digital/large/crd_abc123.avif");
    });

    it("should return original URL for non-Lorcast URLs", () => {
      const url = "https://example.com/image.jpg";
      const result = convertImageSize(url, ImageSize.LARGE);
      expect(result).toBe(url);
    });
  });

  describe("getLargerSize", () => {
    it("should return larger size", () => {
      expect(getLargerSize(ImageSize.SMALL)).toBe(ImageSize.NORMAL);
      expect(getLargerSize(ImageSize.NORMAL)).toBe(ImageSize.LARGE);
    });

    it("should return undefined for largest size", () => {
      expect(getLargerSize(ImageSize.LARGE)).toBeUndefined();
    });
  });

  describe("getSmallerSize", () => {
    it("should return smaller size", () => {
      expect(getSmallerSize(ImageSize.LARGE)).toBe(ImageSize.NORMAL);
      expect(getSmallerSize(ImageSize.NORMAL)).toBe(ImageSize.SMALL);
    });

    it("should return undefined for smallest size", () => {
      expect(getSmallerSize(ImageSize.SMALL)).toBeUndefined();
    });
  });

  describe("isValidImageUrl", () => {
    it("should validate Lorcast URLs", () => {
      expect(isValidImageUrl("https://cards.lorcast.io/card/digital/normal/crd_abc123.avif")).toBe(
        true,
      );
    });

    it("should validate Ravensburger URLs", () => {
      expect(
        isValidImageUrl("https://api.lorcana.ravensburger.com/images/en/set1/1_abc123.jpg"),
      ).toBe(true);
    });

    it("should validate image file extensions", () => {
      expect(isValidImageUrl("https://example.com/image.jpg")).toBe(true);
      expect(isValidImageUrl("https://example.com/image.avif")).toBe(true);
      expect(isValidImageUrl("https://example.com/image.webp")).toBe(true);
    });

    it("should reject invalid URLs", () => {
      expect(isValidImageUrl("https://example.com/page.html")).toBe(false);
      expect(isValidImageUrl(undefined)).toBe(false);
    });
  });

  describe("validateImageRefs", () => {
    it("should validate refs with multiple sources", () => {
      const result = validateImageRefs({
        lorcastId: "crd_abc123",
        ravensburgerUrl: "https://ravensburger.example.com/image.jpg",
      });
      expect(result.isValid).toBe(true);
      expect(result.availableSources).toContain(ImageSource.LORCAST);
      expect(result.availableSources).toContain(ImageSource.RAVENSBURGER);
      expect(result.recommendedSource).toBe(ImageSource.LORCAST);
    });

    it("should invalidate empty refs", () => {
      const result = validateImageRefs({});
      expect(result.isValid).toBe(false);
      expect(result.availableSources).toHaveLength(0);
    });
  });

  describe("buildLorcanaImageRefs", () => {
    it("should extract Lorcast ID from canonical card", () => {
      const card = {
        externalIds: { lorcast: "crd_abc123" },
      };
      const refs = buildLorcanaImageRefs(card);
      expect(refs.lorcastId).toBe("crd_abc123");
    });
  });

  describe("buildRavensburgerImageRefs", () => {
    it("should extract URL from variant", () => {
      const card = {
        variants: [{ detail_image_url: "https://ravensburger.example.com/detail.jpg" }],
        thumbnail_url: "https://ravensburger.example.com/thumb.jpg",
      };
      const refs = buildRavensburgerImageRefs(card);
      expect(refs.ravensburgerUrl).toBe("https://ravensburger.example.com/detail.jpg");
    });

    it("should fall back to thumbnail", () => {
      const card = {
        thumbnail_url: "https://ravensburger.example.com/thumb.jpg",
      };
      const refs = buildRavensburgerImageRefs(card);
      expect(refs.ravensburgerUrl).toBe("https://ravensburger.example.com/thumb.jpg");
    });
  });
});
