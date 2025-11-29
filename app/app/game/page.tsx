"use client";

import dynamic from "next/dynamic";

const Kitchen = dynamic(() => import("@/components/Kitchen"), {
    ssr: false,
    loading: () => <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Trap Wars...</div>
});

export default function GamePage() {
    return (
        <Kitchen />
    );
}
