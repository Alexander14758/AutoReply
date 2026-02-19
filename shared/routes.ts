import { z } from 'zod';
import { insertCommentSchema, comments, settings, insertSettingSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  comments: {
    list: {
      method: 'GET' as const,
      path: '/api/comments' as const,
      responses: {
        200: z.array(z.custom<typeof comments.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/comments' as const,
      input: insertCommentSchema,
      responses: {
        201: z.custom<typeof comments.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/comments/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  settings: {
    list: {
      method: 'GET' as const,
      path: '/api/settings' as const,
      responses: {
        200: z.array(z.custom<typeof settings.$inferSelect>()),
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/settings' as const,
      input: z.object({
        key: z.string(),
        value: z.string()
      }),
      responses: {
        200: z.custom<typeof settings.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
  bot: {
    status: {
      method: 'GET' as const,
      path: '/api/bot/status' as const,
      responses: {
        200: z.object({
          isUnlocked: z.boolean(),
          isAuthenticated: z.boolean(),
          isRunning: z.boolean()
        })
      }
    },
    trigger: {
      method: 'POST' as const,
      path: '/api/bot/trigger' as const,
      responses: {
        200: z.object({ success: z.boolean(), message: z.string() }),
        400: errorSchemas.validation
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type CommentInput = z.infer<typeof api.comments.create.input>;
export type CommentResponse = z.infer<typeof api.comments.create.responses[201]>;
export type CommentsListResponse = z.infer<typeof api.comments.list.responses[200]>;
