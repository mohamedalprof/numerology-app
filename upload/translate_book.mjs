import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const PROGRESS_FILE = '/home/z/my-project/upload/translated/progress.json';
const OUTPUT_FILE = '/home/z/my-project/upload/translated/book_arabic.txt';
const SOURCE_FILE = '/home/z/my-project/upload/book_text.txt';

async function main() {
  const zai = await ZAI.create();
  
  // Read source
  const fullText = fs.readFileSync(SOURCE_FILE, 'utf-8');
  const pageMarkers = fullText.split(/(=== PAGE \d+ ===)/);
  const pages = [];
  let currentPage = null;
  
  for (const part of pageMarkers) {
    if (part.match(/=== PAGE (\d+) ===/)) {
      if (currentPage) pages.push(currentPage);
      currentPage = { num: parseInt(part.match(/PAGE (\d+)/)[1]), text: '' };
    } else if (currentPage) {
      currentPage.text += part;
    }
  }
  if (currentPage) pages.push(currentPage);
  
  console.log(`Loaded ${pages.length} pages`);
  
  // Load progress if exists
  let translated = {};
  if (fs.existsSync(PROGRESS_FILE)) {
    translated = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
    console.log(`Resuming from page ${Object.keys(translated).length} already translated`);
  }
  
  // Process pages in batches of 2
  const BATCH = 2;
  for (let i = 0; i < pages.length; i += BATCH) {
    const batchPages = pages.slice(i, i + BATCH);
    
    // Skip already translated
    if (batchPages.every(p => translated[p.num])) continue;
    
    const batchText = batchPages.map(p => `--- صفحة ${p.num} ---\n${p.text.trim()}`).join('\n\n');
    
    // Skip very short pages
    if (batchText.replace(/--- صفحة \d+ ---/g, '').trim().length < 30) {
      for (const p of batchPages) {
        translated[p.num] = p.text.trim();
      }
      continue;
    }
    
    try {
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `أنت مترجم أكاديمي محترف. ترجم النص الإنجليزي التالي إلى العربية الفصحى بدقة عالية مع:
- الحفاظ على المصطلحات الطبية والعلمية الدقيقة
- استخدام لغة عربية فصحى رصينة
- الحفاظ على ترقيم الصفحات (--- صفحة X ---)
- عدم إضافة تعليقات أو ملاحظات
- ترجمة العناوين والمراجع
- فقط الترجمة، لا شيء آخر`
          },
          {
            role: 'user',
            content: batchText
          }
        ],
        temperature: 0.2,
        max_tokens: 4096
      });
      
      const result = completion.choices[0]?.message?.content || '';
      
      // Parse translated pages
      const parts = result.split(/--- صفحة \d+ ---/).filter(p => p.trim());
      
      for (let j = 0; j < batchPages.length; j++) {
        if (parts[j]) {
          translated[batchPages[j].num] = parts[j].trim();
        } else {
          translated[batchPages[j].num] = batchPages[j].text.trim();
        }
      }
      
      const done = Object.keys(translated).length;
      if (done % 10 === 0 || done >= pages.length) {
        console.log(`Progress: ${done}/${pages.length} pages translated`);
        fs.writeFileSync(PROGRESS_FILE, JSON.stringify(translated, null, 2));
      }
      
    } catch (error) {
      console.error(`Error at pages ${i+1}-${i+BATCH}: ${error.message}`);
      for (const p of batchPages) {
        if (!translated[p.num]) translated[p.num] = p.text.trim();
      }
    }
  }
  
  // Save final output
  const finalText = pages.map(p => `=== صفحة ${p.num} ===\n${translated[p.num] || p.text}`).join('\n\n');
  fs.writeFileSync(OUTPUT_FILE, finalText);
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(translated, null, 2));
  
  console.log(`Translation complete! ${Object.keys(translated).length} pages saved to ${OUTPUT_FILE}`);
}

main().catch(e => { console.error(e); process.exit(1); });
