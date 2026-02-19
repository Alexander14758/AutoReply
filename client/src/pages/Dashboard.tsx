import { useBotStatus, useTriggerBot } from "@/hooks/use-bot";
import { StatusCard } from "@/components/StatusCard";
import { Activity, Lock, Unlock, Zap, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: status, isLoading } = useBotStatus();
  const { mutate: triggerBot, isPending: isTriggering } = useTriggerBot();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const isReady = status?.isUnlocked && status?.isAuthenticated;

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold font-display text-gradient mb-2">Bot Overview</h1>
        <p className="text-muted-foreground">Monitor and control your Telegram automation instance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatusCard
          title="Bot Status"
          value={status?.isRunning ? "Active" : "Idle"}
          icon={Activity}
          status={status?.isRunning ? "success" : "neutral"}
          description="Current operational state"
        />
        
        <StatusCard
          title="Security"
          value={status?.isUnlocked ? "Unlocked" : "Locked"}
          icon={status?.isUnlocked ? Unlock : Lock}
          status={status?.isUnlocked ? "success" : "warning"}
          description={status?.isUnlocked ? "Password accepted" : "Requires admin password"}
        />

        <StatusCard
          title="Authentication"
          value={status?.isAuthenticated ? "Connected" : "Disconnected"}
          icon={status?.isAuthenticated ? ShieldCheck : AlertCircle}
          status={status?.isAuthenticated ? "success" : "error"}
          description={status?.isAuthenticated ? "Session active" : "Telegram login required"}
        />
      </div>

      <div className="glass-card rounded-2xl p-8 border border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Manual Trigger
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Manually start the comment rotation sequence. This will post comments to configured channels with a 5-second delay.
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => triggerBot()}
            disabled={!isReady || isTriggering}
            className={`
              min-w-[160px] h-12 text-base font-semibold shadow-lg transition-all duration-300
              ${isReady 
                ? "bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-accent/25 hover:-translate-y-0.5" 
                : "opacity-50 cursor-not-allowed"}
            `}
          >
            {isTriggering ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              "Trigger Now"
            )}
          </Button>
        </div>
        
        {!isReady && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3"
          >
            <Lock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-500 text-sm">Action Required</h4>
              <p className="text-sm text-amber-200/80 mt-1">
                You must unlock the bot with the password and complete Telegram authentication before you can trigger actions manually.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
