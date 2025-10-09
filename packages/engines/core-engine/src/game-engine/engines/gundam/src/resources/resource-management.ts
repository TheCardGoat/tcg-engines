import type { Result } from "../shared/result";

/**
 * Resource pool state container
 * Tracks all resources in the resource area and their states (active/rested)
 *
 * Rule 3-4-2: Maximum 15 Resources in resource area
 * Rule 4-4-4: When card placed into resource area, generally placed in active state
 */
export type ResourcePool = {
	/** All resource IDs in the resource area */
	resources: string[];
	/** IDs of resources in active state (vertical, ready to use) */
	activeResources: string[];
	/** IDs of resources in rested state (horizontal, already used) */
	restedResources: string[];
};

/**
 * Resource operation error types
 */
export type ResourceError =
	| {
			type: "resourceAreaFull";
			currentCount: number;
			maxCapacity: number;
	  }
	| {
			type: "insufficientResources";
			required: number;
			available: number;
	  }
	| {
			type: "invalidCost";
			cost: number;
	  }
	| {
			type: "invalidResourceId";
			resourceId: string;
	  }
	| {
			type: "duplicateResource";
			resourceId: string;
	  };

/**
 * Maximum capacity of resource area (Rule 3-4-2)
 */
const MAX_RESOURCE_CAPACITY = 15;

/**
 * Create a deep clone of a resource pool (maintains immutability)
 * @internal
 */
const clonePool = (pool: ResourcePool): ResourcePool => ({
	resources: [...pool.resources],
	activeResources: [...pool.activeResources],
	restedResources: [...pool.restedResources],
});

/**
 * Create a new resource pool
 *
 * @param initialCount - Number of active resources to start with (default 0)
 * @returns New ResourcePool instance
 */
export const createResourcePool = (initialCount = 0): ResourcePool => {
	const resources = Array.from({ length: initialCount }, (_, i) => `res${i}`);
	return {
		resources: [...resources],
		activeResources: [...resources],
		restedResources: [],
	};
};

/**
 * Place a resource from resource deck into resource area (Rule 6-4-1)
 * Resources are placed in active state (Rule 4-4-4)
 *
 * @param pool - Current resource pool
 * @param resourceId - ID of resource to place
 * @returns Result with updated pool or error if area is full
 */
export const placeResource = (
	pool: ResourcePool,
	resourceId: string,
): Result<ResourcePool, ResourceError> => {
	// Validate resource ID is not empty
	if (!resourceId || resourceId.trim().length === 0) {
		return {
			success: false,
			error: {
				type: "invalidResourceId",
				resourceId,
			},
		};
	}

	// Check for duplicate resource ID
	if (pool.resources.includes(resourceId)) {
		return {
			success: false,
			error: {
				type: "duplicateResource",
				resourceId,
			},
		};
	}

	// Check capacity (Rule 3-4-2: Maximum 15 Resources)
	if (pool.resources.length >= MAX_RESOURCE_CAPACITY) {
		return {
			success: false,
			error: {
				type: "resourceAreaFull",
				currentCount: pool.resources.length,
				maxCapacity: MAX_RESOURCE_CAPACITY,
			},
		};
	}

	// Place resource in active state (Rule 4-4-4)
	return {
		success: true,
		data: {
			resources: [...pool.resources, resourceId],
			activeResources: [...pool.activeResources, resourceId],
			restedResources: [...pool.restedResources],
		},
	};
};

/**
 * Pay resource cost by resting active resources (Rule 2-9-1)
 * "You can pay this cost by resting the necessary number of active Resources"
 *
 * @param pool - Current resource pool
 * @param cost - Amount of resources to pay
 * @returns Result with updated pool or error if insufficient resources
 */
export const payResourceCost = (
	pool: ResourcePool,
	cost: number,
): Result<ResourcePool, ResourceError> => {
	// Validate cost is non-negative
	if (cost < 0) {
		return {
			success: false,
			error: {
				type: "invalidCost",
				cost,
			},
		};
	}

	// Cost of 0 requires no payment (but still return new object for immutability)
	if (cost === 0) {
		return {
			success: true,
			data: clonePool(pool),
		};
	}

	// Check if enough active resources available
	if (pool.activeResources.length < cost) {
		return {
			success: false,
			error: {
				type: "insufficientResources",
				required: cost,
				available: pool.activeResources.length,
			},
		};
	}

	// Rest the required number of active resources
	const resourcesToRest = pool.activeResources.slice(0, cost);
	const remainingActive = pool.activeResources.slice(cost);

	return {
		success: true,
		data: {
			resources: [...pool.resources],
			activeResources: remainingActive,
			restedResources: [...pool.restedResources, ...resourcesToRest],
		},
	};
};

/**
 * Check if pool has enough active resources to pay cost
 *
 * @param pool - Resource pool to check
 * @param cost - Cost to validate
 * @returns True if pool can pay the cost
 */
export const canPayCost = (pool: ResourcePool, cost: number): boolean => {
	if (cost < 0) return false;
	return pool.activeResources.length >= cost;
};

/**
 * Activate all rested resources (typically at start of turn)
 * Resets all resources to active state
 *
 * @param pool - Current resource pool
 * @returns New pool with all resources active
 */
export const activateAllResources = (pool: ResourcePool): ResourcePool => {
	return {
		resources: [...pool.resources],
		activeResources: [...pool.resources],
		restedResources: [],
	};
};

/**
 * Get total count of resources in pool
 */
export const getTotalResourceCount = (pool: ResourcePool): number => {
	return pool.resources.length;
};

/**
 * Get count of active resources in pool
 */
export const getActiveResourceCount = (pool: ResourcePool): number => {
	return pool.activeResources.length;
};

/**
 * Get count of rested resources in pool
 */
export const getRestedResourceCount = (pool: ResourcePool): number => {
	return pool.restedResources.length;
};
