export type HealthResponse = {
  status: 'ok';
  application: string;
  version: string;
  database: 'connected';
  cardCount: number;
  timestamp: string;
};
