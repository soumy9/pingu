declare namespace NodeJS {
  interface ProcessEnv {
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    PUSHER_APP_ID: string;
    NEXT_PUBLIC_PUSHER_APP_KEY: string;
    PUSHER_APP_SECRET: string;
  }
}
