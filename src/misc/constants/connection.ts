export type Connection = {
  CONNECTION_STRING: string;
  DB: string;
  DBNAME: string;
};

export const connection: Connection = {
  CONNECTION_STRING: 'CONNECTION_STRING',
  DB: 'Postgres',
  DBNAME: 'nest_js',
};
