import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="glass-card p-12 rounded-2xl text-center border border-white/10 max-w-md mx-4">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-4xl font-display font-bold mb-4 text-foreground">404</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary/20 hover:translate-y-[-2px]">
            Return Home
          </button>
        </Link>
      </div>
    </div>
  );
}
