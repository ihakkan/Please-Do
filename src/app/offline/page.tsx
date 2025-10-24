
import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <main className="dark min-h-screen flex items-center justify-center">
      <div className="text-center text-foreground">
        <div className="inline-block bg-primary/20 p-6 rounded-2xl mb-6">
          <WifiOff className="h-20 w-20 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-2">You're offline</h1>
        <p className="text-lg text-muted-foreground">
          Please check your internet connection and try again.
        </p>
      </div>
    </main>
  );
}
