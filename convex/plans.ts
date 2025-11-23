import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get current plan for a user
export const get = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db
      .query("plans")
      .withIndex("by_user_updated", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();
    
    return plan;
  },
});

// Save/update plan
export const save = mutation({
  args: {
    userId: v.string(),
    morning: v.array(v.any()),
    afternoon: v.array(v.any()),
    evening: v.array(v.any()),
    tips: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Delete old plan
    const existingPlan = await ctx.db
      .query("plans")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    
    if (existingPlan) {
      await ctx.db.delete(existingPlan._id);
    }
    
    // Insert new plan
    const planId = await ctx.db.insert("plans", {
      userId: args.userId,
      morning: args.morning,
      afternoon: args.afternoon,
      evening: args.evening,
      tips: args.tips,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return planId;
  },
});

// Clear plan
export const clear = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db
      .query("plans")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    
    if (plan) {
      await ctx.db.delete(plan._id);
    }
  },
});

