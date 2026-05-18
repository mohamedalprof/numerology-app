const ZAI = require('z-ai-web-dev-sdk').default;
const fs = require('fs');

const PROGRESS = '/home/z/my-project/upload/translated/progress.json';
const OUTPUT = '/home/z/my-project/upload/translated/book_arabic.txt';

async function main() {
  const zai = await ZAI.create();
  
  // Read source
  const fullText = fs.readFileSync('/home/z/my-project/upload/book_text.txt', 'utf-8');
  const parts = fullText.split(/=== PAGE (\d+) ===/);
  const pages = [];
  for (let i = 1; i < parts.length; i += 2) {
    pages.push({ num: parseInt(parts[i]), text: parts[i+1].trim() });
  }
  console.log(`Loaded ${pages.length} pages`);
  
  // Load progress
  let done = {};
  if (fs.existsSync(PROGRESS)) {
    done = JSON.parse(fs.readFileSync(PROGRESS, 'utf-8'));
    console.log(`Resuming: ${Object.keys(done).length} pages already done`);
  }
  
  // Translate page by page (batch of 1 for reliability)
  let count = Object.keys(done).length;
  for (const page of pages) {
    if (done[page.num]) continue;
    if (page.text.length < 20) { done[page.num] = page.text; continue; }
    
    try {
      const r = await zai.chat.completions.create({
        messages: [
          {role: 'system', content: 'أنت مترجم أكاديمي محترف من الإنجليزية للعربية. ترجم بدقة مع الحفاظ على المصطلحات الطبية. فقط الترجمة بدون تعليقات.'},
          {role: 'user', content: page.text.substring(0, 3000)}
        ],
        temperature: 0.2, max_tokens: 2000
      });
      done[page.num] = r.choices[0]?.message?.content || page.text;
      count++;
    } catch(e) {
      console.error(`Page ${page.num} error: ${e.message}`);
      done[page.num] = page.text;
      count++;
    }
    
    // Save every 10 pages
    if (count % 10 === 0) {
      fs.writeFileSync(PROGRESS, JSON.stringify(done));
      console.log(`Progress: ${count}/${pages.length}`);
    }
  }
  
  // Final save
  const finalText = pages.map(p => `=== صفحة ${p.num} ===\n${done[p.num] || p.text}`).join('\n\n');
  fs.writeFileSync(OUTPUT, finalText);
  fs.writeFileSync(PROGRESS, JSON.stringify(done));
  console.log(`Done! ${count} pages translated`);
}

main().catch(e => { console.error(e); process.exit(1); });
