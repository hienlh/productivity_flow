import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all tasks for a user
export const list = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    return tasks.sort((a, b) => a.createdAt - b.createdAt);
  },
});

// Add a new task
export const add = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    duration: v.number(),
    priority: v.string(),
    deadline: v.optional(v.string()),
    fixedTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      ...args,
      createdAt: Date.now(),
    });
    return taskId;
  },
});

// Remove a task
export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Clear all tasks for a user
export const clearAll = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }
  },
});

// Sync tasks from client (replace all)
export const sync = mutation({
  args: {
    userId: v.string(),
    tasks: v.array(v.object({
      id: v.string(),
      title: v.string(),
      duration: v.number(),
      priority: v.string(),
      deadline: v.optional(v.string()),
      fixedTime: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    // Clear existing tasks
    const existing = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    for (const task of existing) {
      await ctx.db.delete(task._id);
    }
    
    // Insert new tasks
    for (const task of args.tasks) {
      await ctx.db.insert("tasks", {
        userId: args.userId,
        title: task.title,
        duration: task.duration,
        priority: task.priority,
        deadline: task.deadline,
        fixedTime: task.fixedTime,
        createdAt: Date.now(),
      });
    }
  },
});

