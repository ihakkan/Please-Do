import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="dark min-h-screen">
       <div className="absolute top-4 left-4 z-10">
        <Link href="/" passHref>
          <Button variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Todos
          </Button>
        </Link>
      </div>
      <AnalyticsDashboard />
    </main>
  );
}
