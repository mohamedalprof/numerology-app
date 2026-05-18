import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const zai = await ZAI.create();

// Read the extracted text
const fullText = fs.readFileSync('/home/z/my-project/upload/book_text.txt', 'utf-8');
const pages = fullText.split(/=== PAGE \d+ ===/).filter(p => p.trim().length > 0);

console.log(`Total pages to translate: ${pages.length}`);

// Translate in batches of pages
const BATCH_SIZE = 3;
const translatedPages = [];

for (let i = 0; i < pages.length; i += BATCH_SIZE) {
  const batch = pages.slice(i, i + BATCH_SIZE);
  const batchText = batch.map((text, idx) => `--- Page ${i + idx + 1} ---\n${text.trim()}`).join('\n\n');
  
  // Skip very short pages (likely blank or just headers)
  if (batchText.trim().length < 50) {
    for (let j = 0; j < batch.length; j++) {
      translatedPages.push({ page: i + j + 1, text: batch[j].trim(), translated: batch[j].trim() });
    }
    continue;
  }

  try {
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `أنت مترجم محترف متخصص في الترجمة الأكاديمية من الإنجليزية إلى العربية. ترجم النص التالي بدقة مع الحفاظ على المعنى الأكاديمي والمصطلحات الطبية والعلمية. استخدم لغة عربية فصحى رصينة. حافظ على تنسيق الصفحات كما هو. لا تضف أي تعليقات أو ملاحظات، فقط الترجمة. حافظ على العناوين والترقيم كما هي.`
        },
        {
          role: 'user',
          content: `ترجم النص التالي من الإنجليزية إلى العربية:\n\n${batchText}`
        }
      ],
      temperature: 0.3,
      max_tokens: 4096
    });

    const translated = completion.choices[0]?.message?.content || batchText;
    
    // Split translated text back into pages
    const translatedParts = translated.split(/--- Page \d+ ---/).filter(p => p.trim().length > 0);
    
    for (let j = 0; j < batch.length; j++) {
      translatedPages.push({ 
        page: i + j + 1, 
        text: batch[j].trim(), 
        translated: translatedParts[j]?.trim() || batch[j].trim() 
      });
    }
    
    console.log(`Translated pages ${i + 1}-${Math.min(i + BATCH_SIZE, pages.length)} / ${pages.length}`);
  } catch (error) {
    console.error(`Error translating pages ${i + 1}-${i + BATCH_SIZE}: ${error.message}`);
    // Keep original text on error
    for (let j = 0; j < batch.length; j++) {
      translatedPages.push({ page: i + j + 1, text: batch[j].trim(), translated: batch[j].trim() });
    }
  }
  
  // Save progress every 30 pages
  if ((i + BATCH_SIZE) % 30 === 0 || i + BATCH_SIZE >= pages.length) {
    const progressPath = `/home/z/my-project/upload/translated/progress_${i + BATCH_SIZE}.json`;
    fs.writeFileSync(progressPath, JSON.stringify(translatedPages, null, 2));
    console.log(`Progress saved: ${progressPath}`);
  }
}

// Save final translated text
const finalText = translatedPages.map(p => `=== PAGE ${p.page} ===\n${p.translated}`).join('\n\n');
fs.writeFileSync('/home/z/my-project/upload/translated/book_arabic.txt', finalText);
console.log(`Translation complete! Total pages: ${translatedPages.length}`);
