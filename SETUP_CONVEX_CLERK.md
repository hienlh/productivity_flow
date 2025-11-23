# 🚀 Setup Guide: Clerk + Convex

## 📋 Prerequisites
- [x] Packages installed (`convex`, `@clerk/clerk-react`)
- [x] Convex schema and functions created
- [x] App.tsx integrated

## 🔧 Step-by-Step Setup

### 1️⃣ Create Clerk Account (5 minutes)

1. Visit https://dashboard.clerk.com/
2. Sign up (free)
3. Create a new application
   - Name: `PlanningMind`
   - Enable: **Google OAuth**
4. Copy your **Publishable Key**:
   ```
   pk_test_...
   ```

### 2️⃣ Create Convex Account (5 minutes)

1. Visit https://dashboard.convex.dev/
2. Sign up (free, use same Google account if you want)

### 3️⃣ Initialize Convex (2 minutes)

Open terminal in project root:

```bash
npx convex dev
```

This will:
- Prompt you to login (use browser)
- Create a new Convex project
- Generate `.env.local` file
- Generate `convex/_generated/` folder
- Start dev server

**Keep this terminal running!** It watches for changes.

### 4️⃣ Setup Environment Variables

Create/edit `.env.local` file:

```bash
# Convex (auto-generated)
VITE_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk (copy from Clerk dashboard)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### 5️⃣ Configure Clerk for Convex

In Clerk Dashboard:

1. Go to **JWT Templates**
2. Create **Convex** template (they have it built-in!)
3. Copy the **Issuer URL** (looks like: `https://your-app.clerk.accounts.dev`)

In Convex Dashboard:

1. Go to **Settings** → **Auth**
2. Add **Clerk** as auth provider
3. Paste the Issuer URL
4. Save

### 6️⃣ Test the App

```bash
# Terminal 1: Convex dev (should already be running)
npx convex dev

# Terminal 2: App dev server
npm run dev
```

Visit http://localhost:5173

### 7️⃣ Test Sync Flow

1. **Click "Sign In"** → Login with Google
2. **Add some tasks**
3. **Generate schedule**
4. **Open on mobile** (or another browser)
5. **Sign in with same Google account**
6. ✅ **See synced data!**

## 📱 Mobile Testing

### Option 1: Same Network

```bash
# Find your local IP
ipconfig getifaddr en0  # Mac
# or
hostname -I  # Linux

# Access from mobile
http://192.168.x.x:5173
```

### Option 2: Deploy (Production)

```bash
# Deploy Convex
npx convex deploy

# Deploy app (Vercel/Netlify)
# Add env vars in deployment dashboard
```

## 🐛 Troubleshooting

### Error: "Cannot find module '../convex/_generated/api'"

**Solution**: Run `npx convex dev` first. It generates the API types.

### Error: "Clerk publishable key missing"

**Solution**: Add `VITE_CLERK_PUBLISHABLE_KEY` to `.env.local`

### Error: "Unauthorized" in Convex

**Solution**: 
1. Check Clerk JWT template is created
2. Verify Issuer URL is correct in Convex dashboard
3. Sign out and sign in again

### Tasks not syncing

**Solution**:
1. Check Convex dev server is running
2. Open browser console for errors
3. Verify you're signed in
4. Check network tab for Convex requests

## 📊 How It Works

### Data Flow

```
User Actions → Local State → Convex Mutations → Convex DB
                    ↓                              ↓
                Save to           Real-time sync to
              localStorage        other devices
```

### Sync Logic

**When Signed Out:**
- ✅ App works normally
- ✅ Data saved to localStorage only
- ❌ No sync between devices

**When Signed In:**
- ✅ Data loads from Convex
- ✅ Changes sync to Convex
- ✅ Real-time updates across devices
- ✅ localStorage as backup

### Security

- 🔐 **Clerk** handles authentication
- 🔐 **Convex** handles authorization (by userId)
- 🔐 Row-level security: Users can only access their own data
- 🔐 API keys stored locally (never sent to Convex)

## 🎉 Success Checklist

- [ ] Clerk account created
- [ ] Convex account created
- [ ] `npx convex dev` running
- [ ] `.env.local` configured
- [ ] Clerk JWT template created
- [ ] Convex auth configured
- [ ] App starts without errors
- [ ] Can sign in with Google
- [ ] Tasks sync to Convex
- [ ] Data persists after refresh
- [ ] Syncs to another device/browser

## 💡 Tips

1. **Keep `npx convex dev` running** during development
2. **Check Convex dashboard** to see your data
3. **Use Clerk dashboard** to manage users
4. **Deploy early** to test on real mobile device
5. **Check browser console** for sync errors

## 🆓 Free Tier Limits

**Clerk:**
- ✅ 10,000 monthly active users
- ✅ Google OAuth included
- ✅ Unlimited sign-ins

**Convex:**
- ✅ 1 million function calls/month
- ✅ 1 GB storage
- ✅ Unlimited projects
- ✅ Real-time subscriptions

**Total cost: $0/month** 🎉

## 🚀 Next Steps

After setup works:

1. **Add more OAuth providers** (GitHub, Facebook, etc.)
2. **Deploy to production** (Vercel + Convex deploy)
3. **Add offline-first logic** (better localStorage sync)
4. **Add sync status indicator** (show when syncing)
5. **Add conflict resolution** (if editing on 2 devices)

---

Need help? Check:
- Clerk docs: https://clerk.com/docs
- Convex docs: https://docs.convex.dev
- Convex + Clerk guide: https://docs.convex.dev/auth/clerk

