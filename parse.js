import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

async function run() {
  try {
     const m = await pdf(fs.readFileSync('menu_bamboo_digital.pdf'));
     fs.writeFileSync('parsed_menu.txt', m.text);
     console.log('Menu OK');
  } catch (e) {
     console.error('Menu Error:', e);
  }
  
  try {
     const p = await pdf(fs.readFileSync('Pantina_tavoli_bamboo.pdf'));
     fs.writeFileSync('parsed_pantina.txt', p.text);
     console.log('Pantina OK');
  } catch (e) {
     console.error('Pantina Error:', e);
  }
}
run();
