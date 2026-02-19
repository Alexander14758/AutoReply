import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  status: "success" | "warning" | "error" | "neutral";
  description?: string;
  className?: string;
}

export function StatusCard({ title, value, icon: Icon, status, description, className }: StatusCardProps) {
  const statusStyles = {
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    error: "bg-red-500/10 text-red-500 border-red-500/20",
    neutral: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <div className={cn("glass-card rounded-2xl p-6 transition-all hover:border-white/10", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-display font-bold text-foreground">{value}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl border", statusStyles[status])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
