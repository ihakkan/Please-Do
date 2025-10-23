import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { playSound } from "@/lib/sounds";

export default function DashboardPage() {
  return (
    <main className="dark min-h-screen">
       <div className="absolute top-4 left-4 z-10">
        <Link href="/" passHref>
          <Button onClick={() => playSound("navigate")} variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary">
            <Undo2 className="mr-2 h-5 w-5" />
            Back to Todos
          </Button>
        </Link>
      </div>
      <AnalyticsDashboard />
    </main>
  );
}
