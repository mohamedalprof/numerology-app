const ZAI = require('z-ai-web-dev-sdk').default;
const fs = require('fs');

const PROGRESS = '/home/z/my-project/upload/translated/progress.json';

async function main() {
  const zai = await ZAI.create();
  const fullText = fs.readFileSync('/home/z/my-project/upload/book_text.txt', 'utf-8');
  const parts = fullText.split(/=== PAGE (\d+) ===/);
  const pages = [];
  for (let i = 1; i < parts.length; i += 2) {
    pages.push({ num: parseInt(parts[i]), text: parts[i+1].trim() });
  }
  
  let done = {};
  if (fs.existsSync(PROGRESS)) {
    done = JSON.parse(fs.readFileSync(PROGRESS, 'utf-8'));
  }
  
  // Focus on pages 1-50 first (cover, TOC, preface, chapters 1-2)
  const TARGET = 50;
  let count = Object.keys(done).length;
  
  for (const page of pages) {
    if (page.num > TARGET) break;
    if (done[page.num]) continue;
    if (page.text.length < 20) { done[page.num] = page.text; count++; continue; }
    
    try {
      const r = await zai.chat.completions.create({
        messages: [
          {role: 'system', content: 'ترجم من الإنجليزية للعربية بدقة أكاديمية. فقط الترجمة.'},
          {role: 'user', content: page.text.substring(0, 3000)}
        ],
        temperature: 0.2, max_tokens: 2000
      });
      done[page.num] = r.choices[0]?.message?.content || page.text;
      count++;
    } catch(e) {
      console.error(`Page ${page.num}: ${e.message}`);
      done[page.num] = page.text;
    }
    
    if (count % 5 === 0) {
      fs.writeFileSync(PROGRESS, JSON.stringify(done));
      console.log(`${count}/${TARGET} pages done`);
    }
  }
  
  fs.writeFileSync(PROGRESS, JSON.stringify(done));
  console.log(`Batch complete: ${count} pages translated`);
}

main().catch(e => { console.error(e); process.exit(1); });
