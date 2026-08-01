import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const outputPath = path.resolve(process.cwd(), 'config.js');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Warning: SUPABASE_URL or SUPABASE_ANON_KEY is not set.');
  console.warn('config.js will be generated with empty values.');
}

const contents = `window.__SUPABASE__ = {
  url: ${JSON.stringify(supabaseUrl)},
  anonKey: ${JSON.stringify(supabaseAnonKey)}
};\n`;

fs.writeFileSync(outputPath, contents, 'utf8');
console.log(`Generated ${path.basename(outputPath)}.`);
