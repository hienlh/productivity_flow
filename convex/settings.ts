import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user settings
export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    
    return settings;
  },
});

// Update user settings
export const update = mutation({
  args: {
    userId: v.string(),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      // Update existing settings
      await ctx.db.patch(existing._id, {
        language: args.language,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      // Create new settings
      const id = await ctx.db.insert("userSettings", {
        userId: args.userId,
        language: args.language,
        updatedAt: Date.now(),
      });
      return id;
    }
  },
});

