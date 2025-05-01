const allowedOrigins = ['http://yourfrontend.com', 'http://anothertrusted.com'];

interface CorsOptions {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => void;
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
}

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin || '') !== -1 || !origin) {
      callback(null, true); // Allows requests from allowedOrigins or no origin (non-browser clients)
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allows cookies and auth headers
};

export { corsOptions };
