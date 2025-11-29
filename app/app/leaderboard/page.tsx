```
"use client";

import dynamic from "next/dynamic";

const Kitchen = dynamic(() => import("@/components/Kitchen"), { 
  ssr: false,
  loading: () => <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Leaderboard...</div>
});

export default function LeaderboardPage() {
  return (
    <Kitchen initialTab="leaderboard" />
  );
}
```
