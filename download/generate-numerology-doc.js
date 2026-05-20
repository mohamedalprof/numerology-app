const { Document, Packer, Paragraph, TextRun, Header, Footer,
        AlignmentType, HeadingLevel, PageNumber, Table, TableRow, TableCell,
        WidthType, BorderStyle, ShadingType, PageBreak } = require("docx");
const fs = require("fs");

// Palette - DM-1 Deep Cyan (AI/Tech)
const P = {
  primary: "162235",
  body: "000000",
  secondary: "5A6080",
  accent: "37DCF2",
  surface: "F8F9FF",
};
const c = (hex) => hex.replace("#","");

// Arabic font config
const fontAr = { ascii: "Calibri", eastAsia: "Microsoft YaHei" };
const fontArHead = { ascii: "Calibri", eastAsia: "SimHei" };

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 360 : 240, after: 120 },
    children: [new TextRun({ text, bold: true, color: P.primary, font: fontArHead, size: level === HeadingLevel.HEADING_1 ? 32 : 28 })]
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    indent: opts.indent ? { firstLine: 420 } : undefined,
    spacing: { line: 312, after: 80 },
    children: [new TextRun({ text, size: 22, color: P.body, font: fontAr })],
  });
}

function bodyBold(label, text) {
  return new Paragraph({
    spacing: { line: 312, after: 80 },
    children: [
      new TextRun({ text: label, bold: true, size: 22, color: P.primary, font: fontAr }),
      new TextRun({ text, size: 22, color: P.body, font: fontAr }),
    ],
  });
}

function bullet(text) {
  return new Paragraph({
    spacing: { line: 312, after: 60 },
    indent: { left: 720 },
    children: [new TextRun({ text: `\u2022  ${text}`, size: 22, color: P.body, font: fontAr })],
  });
}

function codeBlock(text) {
  return new Paragraph({
    spacing: { line: 276, after: 60 },
    indent: { left: 360 },
    shading: { type: ShadingType.CLEAR, fill: "F0F4F8" },
    children: [new TextRun({ text, size: 20, color: "1A1A2E", font: { ascii: "Courier New", eastAsia: "Courier New" } })],
  });
}

function spacer(twips = 200) {
  return new Paragraph({ spacing: { before: twips } });
}

const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

// ── Cover Section ──
function buildCover() {
  const config = { title: "\u0623\u0639\u062f\u0627\u062f \u0648\u0628\u0635\u064a\u0631\u0629", subtitle: "Numerology App", metaLines: ["Project Documentation", "May 2026"] };
  
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      children: [new TableCell({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: allNoBorders,
        shading: { type: ShadingType.CLEAR, fill: "162235" },
        verticalAlign: "top",
        children: [
          new Paragraph({ spacing: { before: 4000 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 800, after: 200 },
            children: [new TextRun({ text: "\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640", size: 28, color: "37DCF2", font: fontAr })]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 100 },
            children: [new TextRun({ text: config.title, bold: true, size: 72, color: "FFFFFF", font: fontArHead })]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: config.subtitle, size: 36, color: "37DCF2", font: { ascii: "Orbitron", eastAsia: "Calibri" } })]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [new TextRun({ text: "\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640\u0640", size: 28, color: "37DCF2", font: fontAr })]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 600 },
            children: [new TextRun({ text: "Project Documentation", size: 24, color: "B0B8C0", font: fontAr })]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100 },
            children: [new TextRun({ text: "May 2026", size: 22, color: "90989F", font: fontAr })]
          }),
        ]
      })]
    })]
  });
}

// ── Body Content ──
function buildBody() {
  const children = [];
  
  children.push(heading("\u0640 1. \u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629 \u0639\u0644\u0649 \u0627\u0644\u0645\u0634\u0631\u0648\u0639"));
  children.push(body("\u0645\u0648\u0642\u0639 \u0623\u0639\u062f\u0627\u062f \u0648\u0628\u0635\u064a\u0631\u0629 (Numbers & Insight) \u0647\u0648 \u062d\u0627\u0633\u0628\u0629 \u062a\u0648\u0627\u0641\u0642 \u0628\u0627\u0644\u0623\u0631\u0642\u0627\u0645 \u0645\u062f\u0639\u0648\u0645\u0629 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a\u060c \u062a\u062d\u0644\u0644 \u0637\u0627\u0642\u0629 \u0627\u0644\u0623\u0631\u0642\u0627\u0645 \u0627\u0644\u0642\u062f\u064a\u0645\u0629 \u0628\u0646\u0627\u0621\u064b \u0639\u0644\u0649 \u062a\u0648\u0627\u0631\u064a\u062e \u0627\u0644\u0645\u064a\u0644\u0627\u062f. \u064a\u062f\u0639\u0645 \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0644\u063a\u062a\u064a\u0646 \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0648\u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629 \u0645\u0639 \u0628\u0648\u0627\u0628\u0629 \u062f\u0641\u0639 Spaceremit \u0648\u062f\u0631\u062f\u0634\u0629 \u0645\u0628\u0627\u0634\u0631\u0629 Tawk.to.", {indent: true}));
  children.push(spacer(100));
  
  children.push(bodyBold("\u0627\u0633\u0645 \u0627\u0644\u0645\u0634\u0631\u0648\u0639: ", "\u0623\u0639\u062f\u0627\u062f \u0648\u0628\u0635\u064a\u0631\u0629 | Numbers & Insight"));
  children.push(bodyBold("\u0627\u0644\u0631\u0627\u0628\u0637: ", "https://numerology-app-delta.vercel.app"));
  children.push(bodyBold("\u0627\u0644\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627: ", "Next.js 16 + TypeScript + Tailwind CSS"));
  children.push(bodyBold("\u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u062f\u0641\u0639: ", "Spaceremit"));
  children.push(bodyBold("\u0627\u0644\u062f\u0631\u062f\u0634\u0629 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629: ", "Tawk.to"));
  children.push(bodyBold("\u0627\u0644\u0627\u0633\u062a\u0636\u0627\u0641\u0629: ", "Vercel (https://vercel.com)"));
  children.push(bodyBold("GitHub: ", "https://github.com/mohamedalprof/numerology-app"));
  children.push(bodyBold("\u0627\u0644\u0633\u0639\u0631: ", "5 \u062f\u0648\u0644\u0627\u0631 \u0623\u0645\u0631\u064a\u0643\u064a (USD)"));

  children.push(spacer(200));
  children.push(heading("\u0640 2. \u062e\u0648\u0627\u0631\u0632\u0645\u064a\u0629 \u0627\u0644\u062d\u0633\u0627\u0628"));
  children.push(body("\u062a\u0639\u0645\u0644 \u0627\u0644\u062e\u0648\u0627\u0631\u0632\u0645\u064a\u0629 \u0628\u062c\u0645\u0639 \u0643\u0644 \u0623\u0631\u0642\u0627\u0645 \u062a\u0648\u0627\u0631\u064a\u062e \u0627\u0644\u0645\u064a\u0644\u0627\u062f \u0644\u0644\u0634\u062e\u0635\u064a\u0646\u060c \u062b\u0645 \u0637\u0631\u062d 22 \u0628\u0634\u0643\u0644 \u0645\u062a\u0643\u0631\u0631 \u062d\u062a\u0649 \u0627\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0631\u0642\u0645 \u0623\u0642\u0644 \u0645\u0646 22. \u0627\u0644\u0635\u0641\u0631 \u0644\u0627 \u064a\u0648\u062c\u062f \u0641\u064a \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0644\u062d\u0633\u0627\u0628\u064a\u0629 \u0648\u064a\u062a\u062d\u0648\u0644 \u0625\u0644\u0649 22.", {indent: true}));
  children.push(spacer(100));
  children.push(bodyBold("\u0627\u0644\u062e\u0637\u0648\u0629 1: ", "\u062c\u0645\u0639 \u0643\u0644 \u0623\u0631\u0642\u0627\u0645 \u062a\u0648\u0627\u0631\u064a\u062e \u0627\u0644\u0645\u064a\u0644\u0627\u062f (1+2+9+1+9+7+0 = 28)"));
  children.push(bodyBold("\u0627\u0644\u062e\u0637\u0648\u0629 2: ", "\u0637\u0631\u062d 22 \u0628\u0634\u0643\u0644 \u0645\u062a\u0643\u0631\u0631 (28 - 22 = 6)"));
  children.push(bodyBold("\u0627\u0644\u0646\u062a\u064a\u062c\u0629: ", "\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0646\u0647\u0627\u0626\u064a \u0647\u0648 \u0645\u0624\u0634\u0631 \u0627\u0644\u062a\u0648\u0627\u0641\u0642 (1-22)"));
  
  children.push(spacer(200));
  children.push(heading("\u0640 3. \u062a\u0635\u0646\u064a\u0641 \u0627\u0644\u062a\u0648\u0627\u0641\u0642"));
  children.push(body("\u064a\u062a\u0645 \u062a\u0635\u0646\u064a\u0641 \u0645\u0624\u0634\u0631 \u0627\u0644\u062a\u0648\u0627\u0641\u0642 \u0625\u0644\u0649 \u062b\u0644\u0627\u062b \u0641\u0626\u0627\u062a \u062d\u0633\u0628 \u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0646\u0627\u062a\u062c:", {indent: true}));
  children.push(spacer(100));
  
  // Positive
  children.push(new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: "\u2705 \u0625\u064a\u062c\u0627\u0628\u064a (Positive):", bold: true, size: 24, color: "008F72", font: fontAr })]
  }));
  children.push(body("2, 3, 5, 6, 10, 14, 17, 19, 21"));
  
  // Medium
  children.push(new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: "\u26a0\ufe0f \u0645\u062a\u0648\u0633\u0637 (Medium):", bold: true, size: 24, color: "D4A030", font: fontAr })]
  }));
  children.push(body("1, 4, 7, 8, 11, 20"));
  
  // Negative
  children.push(new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: "\u274c \u0633\u0644\u0628\u064a (Negative):", bold: true, size: 24, color: "CC3333", font: fontAr })]
  }));
  children.push(body("9, 12, 13, 15, 16, 18, 22"));

  children.push(spacer(200));
  children.push(heading("\u0640 4. \u062a\u0641\u0633\u064a\u0631\u0627\u062a \u0627\u0644\u0623\u0631\u0642\u0627\u0645 \u0627\u0644ـ 22"));
  children.push(body("\u0643\u0644 \u0631\u0642\u0645 \u0645\u0646 1 \u0625\u0644\u0649 22 \u0644\u0647 \u062a\u0641\u0633\u064a\u0631 \u0645\u0641\u0635\u0644 \u0644\u0637\u0628\u064a\u0639\u0629 \u0627\u0644\u0639\u0644\u0627\u0642\u0629. \u0627\u0644\u062a\u0641\u0633\u064a\u0631\u0627\u062a \u0645\u0643\u062a\u0648\u0628\u0629 \u0628\u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0648\u062a\u063a\u0637\u064a \u062c\u0648\u0627\u0646\u0628 \u0645\u062a\u0639\u062f\u062f\u0629 \u0645\u062b\u0644 \u0627\u0644\u062d\u0628 \u0648\u0627\u0644\u063a\u064a\u0631\u0629 \u0648\u0627\u0644\u062e\u064a\u0627\u0646\u0629 \u0648\u0627\u0644\u0637\u0644\u0627\u0642 \u0648\u0627\u0644\u0633\u062d\u0631 \u0627\u0644\u0623\u0633\u0648\u062f \u0648\u063a\u064a\u0631\u0647\u0627. \u0627\u0644\u0631\u0642\u0645 22 \u0647\u0648 \u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0623\u0633\u0627\u0633\u064a \u0648\u064a\u0639\u062a\u0628\u0631 \u0633\u0644\u0628\u064a\u0627\u064b (\u064a\u0634\u064a\u0631 \u0625\u0644\u0649 \u0627\u062d\u062a\u0645\u0627\u0644\u064a\u0629 \u0627\u0644\u0637\u0644\u0627\u0642).", {indent: true}));

  children.push(spacer(200));
  children.push(heading("\u0640 5. \u0628\u0648\u0627\u0628\u0629 \u062f\u0641\u0639 Spaceremit"));
  children.push(body("\u062a\u0645 \u062f\u0645\u062c \u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u062f\u0641\u0639 Spaceremit \u0644\u0641\u062a\u062d \u0627\u0644\u0642\u0633\u0645 \u0627\u0644\u0645\u0645\u064a\u0632 (\u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u062d\u0633\u0627\u0628 + \u062f\u0644\u064a\u0644 \u0627\u0644\u0634\u0641\u0627\u0621 \u0627\u0644\u0639\u0627\u0637\u0641\u064a) \u0645\u0642\u0627\u0628\u0644 5 \u062f\u0648\u0644\u0627\u0631.", {indent: true}));
  children.push(spacer(100));
  
  children.push(bodyBold("\u0627\u0644\u0645\u0641\u062a\u0627\u062d \u0627\u0644\u0639\u0627\u0645 (Live): ", "pkO7UH3TAESAQEOARU9E86IZF8TFQ1Q3VZOB05226Z05YRV23MOO"));
  children.push(bodyBold("\u0627\u0644\u0645\u0641\u062a\u0627\u062d \u0627\u0644\u0633\u0631\u064a (Live): ", "skJAZMJDRAR0PEI8Z7HCY9OHMYYELKGOBKVSH6PZDJEL1W369QKP"));
  children.push(bodyBold("Spaceseller ID: ", "6a052c0cbc0bfd419925038d"));
  children.push(bodyBold("Verification: ", "3VAEBQG0VCI89LTFVLVAXRPBSMC3UAVF2EH0ABNQJHJHWV1C7G"));
  children.push(bodyBold("Callback URL: ", "https://numerology-app-delta.vercel.app/api/spaceremit-callback"));
  children.push(bodyBold("\u0627\u0644\u062f\u0648\u0645\u064a\u0646 \u0627\u0644\u0642\u062f\u064a\u0645: ", "numberandinsight.space-z.ai"));
  children.push(bodyBold("\u0627\u0644\u062f\u0648\u0645\u064a\u0646 \u0627\u0644\u062c\u062f\u064a\u062f: ", "numerology-app-delta.vercel.app (\u0641\u064a \u0627\u0646\u062a\u0638\u0627\u0631 \u0627\u0644\u062a\u062d\u0642\u0642)"));

  children.push(spacer(100));
  children.push(body("\u0627\u0644\u0648\u0638\u0627\u0626\u0641 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u0629 \u0641\u064a \u0627\u0644\u0643\u0648\u062f:", {indent: true}));
  children.push(bullet("SP_SUCCESSFUL_PAYMENT - \u0627\u0644\u062f\u0641\u0639 \u0627\u0644\u0646\u0627\u062c\u062d"));
  children.push(bullet("SP_FAILD_PAYMENT - \u0641\u0634\u0644 \u0627\u0644\u062f\u0641\u0639"));
  children.push(bullet("SP_RECIVED_MESSAGE - \u0631\u0633\u0627\u0644\u0629 \u0645\u0646 Spaceremit"));
  children.push(bullet("SP_NEED_AUTH - \u064a\u062d\u062a\u0627\u062c \u062a\u0633\u062c\u064a\u0644 \u062f\u062e\u0648\u0644"));

  children.push(spacer(200));
  children.push(heading("\u0640 6. \u0627\u0644\u062f\u0631\u062f\u0634\u0629 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629 Tawk.to"));
  children.push(body("\u062a\u0645 \u062f\u0645\u062c Tawk.to \u0644\u0644\u062f\u0631\u062f\u0634\u0629 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629 \u0645\u0639 \u0627\u0644\u0639\u0645\u0644\u0627\u0621. \u064a\u0638\u0647\u0631 \u0623\u064a\u0642\u0648\u0646\u0629 \u0627\u0644\u062f\u0631\u062f\u0634\u0629 \u0641\u064a \u0623\u0633\u0641\u0644 \u0627\u0644\u0635\u0641\u062d\u0629.", {indent: true}));
  children.push(spacer(100));
  children.push(bodyBold("Property ID: ", "6a0e11de2370201c349f28e6"));
  children.push(bodyBold("Widget ID: ", "1jp3fbk93"));
  children.push(bodyBold("JavaScript API Key: ", "1119ae6ccf3378ec46b92"));
  children.push(bodyBold("Ticket Email: ", "tickets@aadd-wbsyr.p.tawk.email"));

  children.push(spacer(200));
  children.push(heading("\u0640 7. \u0647\u064a\u0643\u0644 \u0627\u0644\u0645\u0644\u0641\u0627\u062a"));
  children.push(body("\u0647\u064a\u0643\u0644 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0641\u064a Next.js:", {indent: true}));
  children.push(spacer(100));
  
  const files = [
    ["src/app/page.tsx", "\u0627\u0644\u0635\u0641\u062d\u0629 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629 - \u062d\u0627\u0633\u0628\u0629 \u0627\u0644\u062a\u0648\u0627\u0641\u0642 + \u0627\u0644\u062f\u0641\u0639"],
    ["src/app/layout.tsx", "\u0627\u0644\u062a\u062e\u0637\u064a\u0637 \u0627\u0644\u0639\u0627\u0645 - \u0627\u0644\u062e\u0637\u0648\u0637 + Spaceremit + Tawk.to"],
    ["src/app/globals.css", "\u0623\u0646\u0645\u0627\u0637 CSS - \u0627\u0644\u062a\u0635\u0645\u064a\u0645 \u0627\u0644\u063a\u0627\u0645\u0636"],
    ["src/lib/numerology.ts", "\u0645\u062d\u0631\u0643 \u0627\u0644\u062d\u0633\u0627\u0628\u0627\u062a - sumDigits, reduceNumber, getCategory"],
    ["src/app/api/spaceremit-callback/route.ts", "API Route \u0644\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u062f\u0641\u0639"],
    [".env", "\u0645\u062a\u063a\u064a\u0631\u0627\u062a \u0627\u0644\u0628\u064a\u0626\u0629 - \u0645\u0641\u0627\u062a\u064a\u062d Spaceremit"],
    ["jest.config.ts", "\u0625\u0639\u062f\u0627\u062f\u0627\u062a Jest \u0644\u0644\u0627\u062e\u062a\u0628\u0627\u0631"],
    ["next.config.ts", "\u0625\u0639\u062f\u0627\u062f\u0627\u062a Next.js"],
  ];

  files.forEach(([file, desc]) => {
    children.push(bodyBold(file + "  ", "- " + desc));
  });

  children.push(spacer(200));
  children.push(heading("\u0640 8. \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631\u0627\u062a \u0627\u0644\u0622\u0644\u064a\u0629"));
  children.push(body("\u062a\u0645 \u062a\u0646\u0641\u064a\u0630 159 \u0627\u062e\u062a\u0628\u0627\u0631 \u0622\u0644\u064a \u0628\u0646\u062c\u0627\u062d \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 Jest + React Testing Library:", {indent: true}));
  children.push(spacer(100));
  children.push(bodyBold("src/lib/__tests__/numerology.test.ts", " - 78 \u0627\u062e\u062a\u0628\u0627\u0631 \u0644\u0644\u062e\u0648\u0627\u0631\u0632\u0645\u064a\u0629"));
  children.push(bodyBold("src/app/__tests__/page.test.tsx", " - 64 \u0627\u062e\u062a\u0628\u0627\u0631 \u0644\u0644\u0648\u0627\u062c\u0647\u0629"));
  children.push(bodyBold("src/app/api/spaceremit-callback/__tests__/route.test.ts", " - 17 \u0627\u062e\u062a\u0628\u0627\u0631 \u0644\u0644\u0640 API"));

  children.push(spacer(200));
  children.push(heading("\u0640 9. \u0627\u0644\u0646\u0634\u0631 \u0639\u0644\u0649 Vercel"));
  children.push(body("\u062a\u0645 \u0646\u0634\u0631 \u0627\u0644\u0645\u0648\u0642\u0639 \u0639\u0644\u0649 Vercel \u0645\u062c\u0627\u0646\u0627\u064b \u0645\u0639 \u0627\u0644\u0646\u0634\u0631 \u0627\u0644\u062a\u0644\u0642\u0627\u0626\u064a \u0639\u0646\u062f \u0627\u0644\u062f\u0641\u0639 \u0639\u0644\u0649 GitHub. \u0627\u0644\u0645\u062a\u063a\u064a\u0631\u0627\u062a \u0627\u0644\u0628\u064a\u0626\u064a\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0641\u064a Vercel:", {indent: true}));
  children.push(spacer(100));
  
  const envVars = [
    "SPACEREMIT_PUBLIC_KEY",
    "SPACEREMIT_SECRET_KEY",
    "SPACEREMIT_AMOUNT",
    "SPACEREMIT_CURRENCY",
    "NEXT_PUBLIC_SPACEREMIT_PUBLIC_KEY",
    "NEXT_PUBLIC_SPACEREMIT_AMOUNT",
    "NEXT_PUBLIC_SPACEREMIT_CURRENCY"
  ];
  envVars.forEach(v => children.push(bullet(v)));

  children.push(spacer(200));
  children.push(heading("\u0640 10. \u0627\u0644\u0645\u0634\u0627\u0643\u0644 \u0627\u0644\u062a\u064a \u062a\u0645 \u062d\u0644\u0647\u0627"));
  children.push(spacer(100));
  children.push(bodyBold("2$ \u0628\u062f\u0644\u0627\u064b \u0645\u0646 5$: ", "\u0643\u0627\u0646\u062a \u0645\u0634\u0643\u0644\u0629 \u0643\u0627\u0634 \u0645\u062a\u0635\u0641\u062d\u060c \u0627\u0644\u0643\u0648\u062f \u0643\u0627\u0646 \u0635\u062d\u064a\u062d\u0627\u064b"));
  children.push(bodyBold("\u0627\u0644\u0646\u062a\u064a\u062c\u0629 0: ", "\u062a\u0645 \u062d\u0644\u0647\u0627 \u0628\u062a\u062d\u0648\u064a\u0644 0 \u0625\u0644\u0649 22 \u0641\u064a reduceNumber()"));
  children.push(bodyBold("\u0627\u0644\u0631\u0642\u0645 22 \u0625\u064a\u062c\u0627\u0628\u064a: ", "\u062a\u0645 \u062a\u0635\u062d\u064a\u062d\u0647 \u0625\u0644\u0649 \u0633\u0644\u0628\u064a (\u064a\u0634\u064a\u0631 \u0625\u0644\u0649 \u0627\u0644\u0637\u0644\u0627\u0642)"));
  children.push(bodyBold("\u0627\u0644\u062a\u0635\u0646\u064a\u0641 \u0627\u0644\u062e\u0627\u0637\u0626: ", "\u062a\u0645 \u062a\u063a\u064a\u064a\u0631\u0647 \u0645\u0646 \u0646\u0637\u0627\u0642\u0627\u062a \u0631\u0642\u0645\u064a\u0629 \u0625\u0644\u0649 \u0628\u062d\u062b \u062f\u0642\u064a\u0642 \u0644\u0643\u0644 \u0631\u0642\u0645"));
  children.push(bodyBold("\u062e\u064a\u0627\u0631\u0627\u062a \u0627\u0644\u062f\u0641\u0639 \u0644\u0627 \u062a\u0639\u0645\u0644: ", "\u0627\u0644\u062f\u0648\u0645\u064a\u0646 \u0641\u064a Spaceremit \u0644\u0627 \u064a\u0637\u0627\u0628\u0642 - \u062a\u0645 \u0625\u0636\u0627\u0641\u0629 \u062f\u0648\u0645\u064a\u0646 \u062c\u062f\u064a\u062f (\u0641\u064a \u0627\u0646\u062a\u0638\u0627\u0631 \u0627\u0644\u062a\u062d\u0642\u0642)"));
  children.push(bodyBold("\u0627\u0644\u0645\u0648\u062f\u0627\u0644 display:none: ", "\u062a\u0645 \u062a\u063a\u064a\u064a\u0631\u0647 \u0625\u0644\u0649 visibility:hidden \u0644\u064a\u0633\u0645\u062d \u0644\u0640 Spaceremit SDK \u0628\u0627\u0644\u062a\u0647\u064a\u0626\u0629"));

  children.push(spacer(200));
  children.push(heading("\u0640 11. \u0627\u0644\u062e\u0637\u0648\u0627\u062a \u0627\u0644\u0645\u062a\u0628\u0642\u064a\u0629"));
  children.push(spacer(100));
  children.push(bullet("\u0627\u0646\u062a\u0638\u0627\u0631 \u062a\u062d\u0642\u0642 Spaceremit \u0645\u0646 \u0627\u0644\u062f\u0648\u0645\u064a\u0646 \u0627\u0644\u062c\u062f\u064a\u062f (numerology-app-delta.vercel.app)"));
  children.push(bullet("\u0627\u0633\u062a\u0644\u0627\u0645 \u0645\u0641\u0627\u062a\u064a\u062d API \u0627\u0644\u062c\u062f\u064a\u062f\u0629 \u0648\u062a\u062d\u062f\u064a\u062b\u0647\u0627 \u0641\u064a \u0627\u0644\u0645\u0648\u0642\u0639"));
  children.push(bullet("\u062a\u0641\u0639\u064a\u0644 \u0627\u0644\u0631\u062f \u0627\u0644\u0622\u0644\u064a \u0641\u064a Tawk.to"));
  children.push(bullet("\u0631\u0628\u0637 \u062f\u0648\u0645\u064a\u0646 \u062e\u0627\u0635 (\u0645\u062b\u0644 adad-wabaseera.com) \u0641\u064a Vercel"));

  children.push(spacer(200));
  children.push(heading("\u0640 12. \u0631\u0648\u0627\u0628\u0637 \u0645\u0647\u0645\u0629"));
  children.push(spacer(100));
  children.push(bodyBold("\u0627\u0644\u0645\u0648\u0642\u0639: ", "https://numerology-app-delta.vercel.app"));
  children.push(bodyBold("GitHub: ", "https://github.com/mohamedalprof/numerology-app"));
  children.push(bodyBold("Vercel Dashboard: ", "https://vercel.com/dashboard"));
  children.push(bodyBold("Spaceremit: ", "https://spaceremit.com"));
  children.push(bodyBold("Tawk.to Dashboard: ", "https://dashboard.tawk.to"));
  children.push(bodyBold("Callback API: ", "https://numerology-app-delta.vercel.app/api/spaceremit-callback"));

  return children;
}

// ── Build Document ──
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }, size: 22, color: P.body },
        paragraph: { spacing: { line: 312 } },
      },
    },
  },
  sections: [
    // Cover
    {
      properties: {
        page: { margin: { top: 0, bottom: 0, left: 0, right: 0 } },
      },
      children: [buildCover()],
    },
    // Body
    {
      properties: {
        page: { margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 } },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: P.secondary }),
              ],
            }),
          ],
        }),
      },
      children: buildBody(),
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("/home/z/my-project/download/numerology-app-documentation.docx", buf);
  console.log("Document created successfully!");
});
