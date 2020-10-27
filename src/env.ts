require('dotenv').config();

export const PORT = process.env['PORT'] || 3333;
export const DATA_DIR = process.env['DATA_DIR'] || './db';