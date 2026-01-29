/**
 * Extraction Service Registry
 *
 * Central registry for managing extraction service adapters.
 * Provides a unified interface for registering and retrieving
 * extraction services based on source type or URL.
 */

import type { ExtractionServiceAdapter, SourceType } from "../../types";

/**
 * Registry for extraction service adapters
 *
 * @example
 * ```typescript
 * const registry = new ExtractionServiceRegistry();
 * registry.register(new SuperdataExtractionAdapter());
 * registry.register(new TabstackExtractionAdapter());
 *
 * const adapter = registry.getAdapterForUrl('https://youtube.com/watch?v=abc123');
 * ```
 */
export class ExtractionServiceRegistry {
  private adapters: Map<string, ExtractionServiceAdapter> = new Map();
  private sourceTypeToAdapter: Map<SourceType, ExtractionServiceAdapter> =
    new Map();

  /**
   * Register an extraction service adapter
   *
   * @param adapter - The adapter to register
   * @throws Error if an adapter with the same serviceId is already registered
   */
  register(adapter: ExtractionServiceAdapter): void {
    if (this.adapters.has(adapter.serviceId)) {
      throw new Error(
        `Extraction service adapter '${adapter.serviceId}' is already registered`,
      );
    }

    this.adapters.set(adapter.serviceId, adapter);

    // Map source types to this adapter
    for (const sourceType of adapter.supportedSourceTypes) {
      if (this.sourceTypeToAdapter.has(sourceType)) {
        const existing = this.sourceTypeToAdapter.get(sourceType);
        throw new Error(
          `Source type '${sourceType}' is already handled by adapter '${existing?.serviceId}'`,
        );
      }
      this.sourceTypeToAdapter.set(sourceType, adapter);
    }
  }

  /**
   * Unregister an extraction service adapter
   *
   * @param serviceId - The service ID to unregister
   * @returns true if the adapter was unregistered, false if not found
   */
  unregister(serviceId: string): boolean {
    const adapter = this.adapters.get(serviceId);
    if (!adapter) {
      return false;
    }

    // Remove source type mappings
    for (const sourceType of adapter.supportedSourceTypes) {
      this.sourceTypeToAdapter.delete(sourceType);
    }

    this.adapters.delete(serviceId);
    return true;
  }

  /**
   * Get an adapter by its service ID
   *
   * @param serviceId - The service ID to look up
   * @returns The adapter or undefined if not found
   */
  getAdapter(serviceId: string): ExtractionServiceAdapter | undefined {
    return this.adapters.get(serviceId);
  }

  /**
   * Get an adapter by source type
   *
   * @param sourceType - The source type to look up
   * @returns The adapter or undefined if not found
   */
  getAdapterBySourceType(
    sourceType: SourceType,
  ): ExtractionServiceAdapter | undefined {
    return this.sourceTypeToAdapter.get(sourceType);
  }

  /**
   * Get an adapter that can handle the given URL
   *
   * @param url - The URL to find an adapter for
   * @returns The adapter or undefined if no adapter can handle the URL
   */
  getAdapterForUrl(url: string): ExtractionServiceAdapter | undefined {
    for (const adapter of this.adapters.values()) {
      if (adapter.canHandle(url)) {
        return adapter;
      }
    }
    return undefined;
  }

  /**
   * Check if any adapter can handle the given URL
   *
   * @param url - The URL to check
   * @returns true if an adapter can handle the URL
   */
  canHandle(url: string): boolean {
    return this.getAdapterForUrl(url) !== undefined;
  }

  /**
   * Get all registered service IDs
   *
   * @returns Array of registered service IDs
   */
  getRegisteredServices(): string[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Get all supported source types
   *
   * @returns Array of supported source types
   */
  getSupportedSourceTypes(): SourceType[] {
    return Array.from(this.sourceTypeToAdapter.keys());
  }

  /**
   * Get the number of registered adapters
   */
  get size(): number {
    return this.adapters.size;
  }

  /**
   * Clear all registered adapters
   */
  clear(): void {
    this.adapters.clear();
    this.sourceTypeToAdapter.clear();
  }
}

/**
 * Global extraction service registry instance
 *
 * Use this singleton for application-wide adapter registration.
 * Adapters should be registered during application startup.
 */
export const extractionServiceRegistry = new ExtractionServiceRegistry();

/**
 * Register an extraction service adapter with the global registry
 *
 * @param adapter - The adapter to register
 */
export function registerExtractionService(
  adapter: ExtractionServiceAdapter,
): void {
  extractionServiceRegistry.register(adapter);
}

/**
 * Get an extraction service adapter from the global registry
 *
 * @param serviceId - The service ID to look up
 * @returns The adapter or undefined if not found
 */
export function getExtractionService(
  serviceId: string,
): ExtractionServiceAdapter | undefined {
  return extractionServiceRegistry.getAdapter(serviceId);
}

/**
 * Get an extraction service adapter that can handle the given URL
 *
 * @param url - The URL to find an adapter for
 * @returns The adapter or undefined if no adapter can handle the URL
 */
export function getExtractionServiceForUrl(
  url: string,
): ExtractionServiceAdapter | undefined {
  return extractionServiceRegistry.getAdapterForUrl(url);
}
