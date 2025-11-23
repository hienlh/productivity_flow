import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all history for a user
export const list = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const history = await ctx.db
      .query("history")
      .withIndex("by_user_timestamp", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
    
    return history;
  },
});

// Add history entry
export const add = mutation({
  args: {
    userId: v.string(),
    plan: v.any(),
    tasksCount: v.number(),
    tokenUsage: v.object({
      promptTokens: v.number(),
      candidatesTokens: v.number(),
      totalTokens: v.number(),
      estimatedCost: v.number(),
    }),
    modelUsed: v.string(),
    tasksText: v.string(),
  },
  handler: async (ctx, args) => {
    const historyId = await ctx.db.insert("history", {
      ...args,
      timestamp: Date.now(),
    });
    return historyId;
  },
});

// Clear all history
export const clearAll = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const history = await ctx.db
      .query("history")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    for (const entry of history) {
      await ctx.db.delete(entry._id);
    }
  },
});

