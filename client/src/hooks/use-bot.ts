import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CommentInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// ============================================
// BOT STATUS
// ============================================

export function useBotStatus() {
  return useQuery({
    queryKey: [api.bot.status.path],
    queryFn: async () => {
      const res = await fetch(api.bot.status.path);
      if (!res.ok) throw new Error("Failed to fetch bot status");
      return api.bot.status.responses[200].parse(await res.json());
    },
    refetchInterval: 5000, // Poll every 5s for live status
  });
}

export function useTriggerBot() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.bot.trigger.path, {
        method: api.bot.trigger.method,
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to trigger bot");
      }
      return api.bot.trigger.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      toast({
        title: "Bot Triggered",
        description: data.message,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// ============================================
// COMMENTS
// ============================================

export function useComments() {
  return useQuery({
    queryKey: [api.comments.list.path],
    queryFn: async () => {
      const res = await fetch(api.comments.list.path);
      if (!res.ok) throw new Error("Failed to fetch comments");
      return api.comments.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: CommentInput) => {
      const validated = api.comments.create.input.parse(data);
      const res = await fetch(api.comments.create.path, {
        method: api.comments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create comment");
      }
      return api.comments.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.comments.list.path] });
      toast({ title: "Success", description: "Comment added to rotation" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.comments.delete.path, { id });
      const res = await fetch(url, { method: api.comments.delete.method });
      if (!res.ok) throw new Error("Failed to delete comment");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.comments.list.path] });
      toast({ title: "Deleted", description: "Comment removed successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

// ============================================
// SETTINGS
// ============================================

export function useSettings() {
  return useQuery({
    queryKey: [api.settings.list.path],
    queryFn: async () => {
      const res = await fetch(api.settings.list.path);
      if (!res.ok) throw new Error("Failed to fetch settings");
      return api.settings.list.responses[200].parse(await res.json());
    },
  });
}
