import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Tasks table
  tasks: defineTable({
    userId: v.string(),
    title: v.string(),
    duration: v.number(),
    priority: v.string(), // "Cao" | "Trung bình" | "Thấp"
    deadline: v.optional(v.string()),
    fixedTime: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_created", ["userId", "createdAt"]),

  // Plans table
  plans: defineTable({
    userId: v.string(),
    morning: v.array(v.any()),
    afternoon: v.array(v.any()),
    evening: v.array(v.any()),
    tips: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_updated", ["userId", "updatedAt"]),

  // History table
  history: defineTable({
    userId: v.string(),
    plan: v.any(), // DayPlan object
    tasksCount: v.number(),
    tokenUsage: v.object({
      promptTokens: v.number(),
      candidatesTokens: v.number(),
      totalTokens: v.number(),
      estimatedCost: v.number(),
    }),
    modelUsed: v.string(),
    tasksText: v.string(),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_timestamp", ["userId", "timestamp"]),

  // User Settings table
  userSettings: defineTable({
    userId: v.string(),
    language: v.string(), // 'vi' | 'en'
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),
});

