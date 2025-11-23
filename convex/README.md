# Convex Setup Instructions

## 1. Create Convex Account
Visit https://dashboard.convex.dev/ and sign up (free)

## 2. Initialize Convex
```bash
npx convex dev
```

This will:
- Prompt you to login
- Create a new project
- Generate `.env.local` with `VITE_CONVEX_URL`
- Start the dev server

## 3. Keep Convex Running
In development, keep `npx convex dev` running in a terminal.
It will watch for changes and sync your functions.

## 4. Deploy (Optional)
```bash
npx convex deploy
```

## Schema Overview

### Tasks Table
- Stores user's tasks with duration, priority, deadline, fixedTime
- Indexed by userId for fast queries

### Plans Table
- Stores generated day plans (morning, afternoon, evening)
- One active plan per user

### History Table
- Stores history of generated schedules
- Includes token usage and cost tracking

## Functions

### tasks.ts
- `list(userId)` - Get all tasks
- `add(...)` - Add new task
- `remove(id)` - Delete task
- `clearAll(userId)` - Clear all tasks
- `sync(userId, tasks)` - Sync tasks from client

### plans.ts
- `get(userId)` - Get current plan
- `save(...)` - Save/update plan
- `clear(userId)` - Clear plan

### history.ts
- `list(userId)` - Get all history
- `add(...)` - Add history entry
- `clearAll(userId)` - Clear history

