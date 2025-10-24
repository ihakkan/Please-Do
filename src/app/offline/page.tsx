
import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <main className="dark min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="text-center">
        <div className="inline-block bg-primary/10 p-6 rounded-2xl mb-6 border border-primary/20">
          <WifiOff className="h-20 w-20 text-primary animate-pulse-slow" />
        </div>
        <h1 className="text-4xl font-bold mb-2">You're Offline</h1>
        <p className="text-lg text-muted-foreground">
          It seems you've lost your connection. Don't worry, your tasks are saved locally.
        </p>
      </div>
    </main>
  );
}
