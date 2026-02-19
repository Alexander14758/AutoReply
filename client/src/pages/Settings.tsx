import { useSettings } from "@/hooks/use-bot";
import { Settings as SettingsIcon, Terminal, Hash, Key } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Settings() {
  const { data: settings, isLoading } = useSettings();

  return (
    <div className="space-y-8 animate-in max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-display text-gradient mb-2">System Configuration</h1>
        <p className="text-muted-foreground">View technical parameters and system constants.</p>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary" />
            Environment Variables
          </h2>
        </div>
        
        <div className="divide-y divide-white/5">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="p-6 flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-48" />
              </div>
            ))
          ) : settings?.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No public settings available to display.
            </div>
          ) : (
            settings?.map((setting) => (
              <div key={setting.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{setting.key}</p>
                    <p className="text-xs text-muted-foreground font-mono">ID: {setting.id}</p>
                  </div>
                </div>
                <code className="px-3 py-1.5 rounded-md bg-black/20 text-accent font-mono text-sm border border-white/5">
                  {setting.value}
                </code>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">Admin Access</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Bot requires the unlock password <code className="text-accent bg-accent/10 px-1 rounded">/admin14758</code> to be sent in Telegram chat before it accepts commands.
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">Bot Behavior</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Automated comments are sent with a 5-second delay between posts to prevent rate-limiting by Telegram.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
