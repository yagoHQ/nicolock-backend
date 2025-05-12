const allowedOrigins = [
  'http://localhost:5173',
  'https://nickolockfe.vercel.app/',
];

interface CorsOptions {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow: boolean) => void
  ) => void;
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean; // Allow credentials (cookies, authorization headers, etc.)
}

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    console.log('[CORS]', origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

export { corsOptions };
