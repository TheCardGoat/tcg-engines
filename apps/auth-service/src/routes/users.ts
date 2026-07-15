import { Elysia, t } from "elysia";
import { betterAuthMacro, requireAuth } from "../plugins/auth";
import { userRateLimiter } from "../plugins/rate-limit";
import {
  getDigestPreferences,
  getUserSubscriptions,
  updateDigestPreferences,
} from "../services/subscriptions";
import { getUserById, updateUserProfile } from "../services/users";

/**
 * User routes for the Auth Service
 *
 * All routes require authentication.
 */
const rateLimiter = userRateLimiter();

export const usersRoutes = new Elysia({ prefix: "/users" })
  // Apply Better Auth macro for auth context
  .use(betterAuthMacro)
  // Apply user rate limiting if enabled
  .use(rateLimiter ?? new Elysia())

  /**
   * GET /v1/users/me - Get current user profile
   */
  .get(
    "/me",
    async ({ user, set }) => {
      const authenticatedUser = requireAuth(user, set);

      const fullUser = await getUserById(authenticatedUser.id);
      if (!fullUser) {
        set.status = 404;
        return {
          error: "NOT_FOUND",
          message: "User not found",
        };
      }

      return {
        id: fullUser.id,
        email: fullUser.email,
        name: fullUser.name,
        username: fullUser.username,
        displayUsername: fullUser.displayUsername,
        image: fullUser.image,
        emailVerified: fullUser.emailVerified,
        subscriptionTier: fullUser.subscriptionTier,
        subscriptionExpiresAt: fullUser.subscriptionExpiresAt,
        createdAt: fullUser.createdAt,
        updatedAt: fullUser.updatedAt,
      };
    },
    { auth: true },
  )

  /**
   * PUT /v1/users/me - Update current user profile
   */
  .put(
    "/me",
    async ({ user, set, body }) => {
      const authenticatedUser = requireAuth(user, set);

      const updatedUser = await updateUserProfile(authenticatedUser.id, body);
      if (!updatedUser) {
        set.status = 404;
        return {
          error: "NOT_FOUND",
          message: "User not found",
        };
      }

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        username: updatedUser.username,
        displayUsername: updatedUser.displayUsername,
        image: updatedUser.image,
        emailVerified: updatedUser.emailVerified,
        subscriptionTier: updatedUser.subscriptionTier,
        subscriptionExpiresAt: updatedUser.subscriptionExpiresAt,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };
    },
    {
      auth: true,
      body: t.Object({
        name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
        username: t.Optional(t.String({ minLength: 3, maxLength: 30 })),
        displayUsername: t.Optional(t.String({ minLength: 1, maxLength: 50 })),
        image: t.Optional(t.String({ format: "uri" })),
      }),
    },
  )

  /**
   * GET /v1/users/me/subscriptions - Get user's creator subscriptions
   */
  .get(
    "/me/subscriptions",
    async ({ user, set }) => {
      const authenticatedUser = requireAuth(user, set);

      const subscriptions = await getUserSubscriptions(authenticatedUser.id);

      return {
        subscriptions: subscriptions.map((sub) => ({
          id: sub.id,
          creatorId: sub.creatorId,
          gameId: sub.gameId,
          createdAt: sub.createdAt,
        })),
        count: subscriptions.length,
      };
    },
    { auth: true },
  )

  /**
   * GET /v1/users/me/digest - Get user's digest preferences
   */
  .get(
    "/me/digest",
    async ({ user, set }) => {
      const authenticatedUser = requireAuth(user, set);

      const preferences = await getDigestPreferences(authenticatedUser.id);

      if (!preferences) {
        // Return default preferences if none exist
        return {
          frequency: "daily",
          deliveryTime: "09:00:00",
          isActive: false,
          createdAt: null,
          updatedAt: null,
        };
      }

      return {
        frequency: preferences.frequency,
        deliveryTime: preferences.deliveryTime,
        isActive: preferences.isActive,
        createdAt: preferences.createdAt,
        updatedAt: preferences.updatedAt,
      };
    },
    { auth: true },
  )

  /**
   * PUT /v1/users/me/digest - Update user's digest preferences
   */
  .put(
    "/me/digest",
    async ({ user, set, body }) => {
      const authenticatedUser = requireAuth(user, set);

      const preferences = await updateDigestPreferences(
        authenticatedUser.id,
        body,
      );

      return {
        frequency: preferences.frequency,
        deliveryTime: preferences.deliveryTime,
        isActive: preferences.isActive,
        createdAt: preferences.createdAt,
        updatedAt: preferences.updatedAt,
      };
    },
    {
      auth: true,
      body: t.Object({
        frequency: t.Optional(
          t.Union([t.Literal("daily"), t.Literal("weekly")]),
        ),
        deliveryTime: t.Optional(
          t.String({
            pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$",
          }),
        ),
        isActive: t.Optional(t.Boolean()),
      }),
    },
  );
