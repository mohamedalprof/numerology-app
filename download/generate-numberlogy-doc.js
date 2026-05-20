const { Document, Packer, Paragraph, TextRun, Header, Footer,
        AlignmentType, HeadingLevel, PageNumber, Table, TableRow, TableCell,
        WidthType, BorderStyle, ShadingType, PageBreak, SectionType } = require("docx");
const fs = require("fs");

// Palette - Warm Teal (WM-1) for education/tech
const P = {
  primary: "15857A",
  body: "1C2A3D",
  secondary: "5B6B7D",
  accent: "15857A",
  surface: "F0EDE5",
  bg: "F4F1E9",
};

const c = (hex) => hex.replace("#", "");

// Cover palette
const coverP = {
  titleColor: "15857A",
  subtitleColor: "606060",
  metaColor: "707070",
  footerColor: "A0A0A0",
};

// Borders
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

// Helper: heading
function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 360 : 240, after: 120 },
    children: [new TextRun({ text, bold: true, color: c(P.primary), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })]
  });
}

// Helper: body paragraph
function body(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
    spacing: { line: 312 },
    children: [new TextRun({ text, size: 24, color: c(P.body), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
  });
}

// Helper: body without indent
function bodyNoIndent(text) {
  return new Paragraph({
    spacing: { line: 312 },
    children: [new TextRun({ text, size: 24, color: c(P.body), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
  });
}

// Helper: bold label + normal value
function labelValue(label, value) {
  return new Paragraph({
    spacing: { line: 312 },
    children: [
      new TextRun({ text: label, bold: true, size: 24, color: c(P.primary), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
      new TextRun({ text: value, size: 24, color: c(P.body), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
    ],
  });
}

// Helper: bullet point
function bullet(text) {
  return new Paragraph({
    spacing: { line: 312 },
    indent: { left: 720 },
    children: [
      new TextRun({ text: "\u2022 ", size: 24, color: c(P.accent), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
      new TextRun({ text, size: 24, color: c(P.body), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
    ],
  });
}

// Helper: URL/code style
function codeLine(text) {
  return new Paragraph({
    spacing: { line: 312 },
    indent: { left: 720 },
    children: [new TextRun({ text, size: 22, color: "529286", font: { ascii: "Consolas", eastAsia: "Microsoft YaHei" } })],
  });
}

// Helper: spacer
function spacer(h = 200) {
  return new Paragraph({ spacing: { before: h } });
}

// Helper: divider line using paragraph border
function divider() {
  return new Paragraph({
    indent: { left: 1000, right: 1000 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: c(P.accent), space: 10 } },
    spacing: { after: 200 },
    children: [],
  });
}

// ======= COVER =======
function buildCover() {
  return [
    new Paragraph({ spacing: { before: 3600 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 900, lineRule: "atLeast", after: 200 },
      children: [new TextRun({ text: "\u0623\u0639\u062f\u0627\u062f \u0648\u0628\u0635\u064a\u0631\u0629", size: 72, bold: true, color: c(coverP.titleColor), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 600, lineRule: "atLeast", after: 400 },
      children: [new TextRun({ text: "AI Numerology", size: 40, color: c(coverP.subtitleColor), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
    }),
    new Paragraph({
      indent: { left: 2000, right: 2000 },
      border: { top: { style: BorderStyle.SINGLE, size: 12, color: c(P.accent), space: 20 } },
      children: [],
    }),
    new Paragraph({ spacing: { before: 400 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 400, after: 100 },
      children: [new TextRun({ text: "\u0645\u0644\u0641 \u062a\u0648\u062b\u064a\u0642 \u0634\u0627\u0645\u0644", size: 32, color: c(coverP.metaColor), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 400, after: 100 },
      children: [new TextRun({ text: "\u0643\u0644 \u0645\u0627 \u062a\u0648\u0635\u0644\u0646\u0627 \u0625\u0644\u064a\u0647 \u0641\u064a \u0628\u0646\u0627\u0621 \u0648\u0646\u0634\u0631 \u0627\u0644\u0645\u0648\u0642\u0639", size: 24, color: c(coverP.metaColor), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
    }),
    new Paragraph({ spacing: { before: 1600 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "2026", size: 24, color: c(coverP.footerColor), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
    }),
  ];
}

// ======= CONTENT =======
function buildContent() {
  const children = [];

  // ===== Section 1: Overview =====
  children.push(heading("\u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629 \u0639\u0644\u0649 \u0627\u0644\u0645\u0634\u0631\u0648\u0639"));
  children.push(body("\u0645\u0648\u0642\u0639 \u0623\u0639\u062f\u0627\u062f \u0648\u0628\u0635\u064a\u0631\u0629 | AI Numerology \u0647\u0648 \u0645\u0648\u0642\u0639 \u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0644\u062d\u0633\u0627\u0628 \u062a\u0648\u0627\u0641\u0642 \u0627\u0644\u0623\u0631\u0642\u0627\u0645 \u0628\u064a\u0646 \u0634\u062e\u0635\u064a\u0646\u060c \u064a\u0639\u0645\u0644 \u0628\u062a\u0642\u0646\u064a\u0629 Next.js \u0648\u064a\u062f\u0639\u0645 \u0627\u0644\u0644\u063a\u062a\u064a\u0646 \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0648\u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629 \u0645\u0639 \u062f\u0639\u0645 \u0643\u0627\u0645\u0644 \u0644\u0627\u062a\u062c\u0627\u0647 RTL/LTR. \u064a\u062a\u0636\u0645\u0646 \u0627\u0644\u0645\u0648\u0642\u0639 \u0628\u0648\u0627\u0628\u0629 \u062f\u0641\u0639 Spaceremit \u0644\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0627\u0644\u0646\u062a\u0627\u0626\u062c \u0627\u0644\u0645\u0641\u0635\u0644\u0629 \u0645\u0642\u0627\u0628\u0644 5 \u062f\u0648\u0644\u0627\u0631 \u0623\u0645\u0631\u064a\u0643\u064a\u060c \u0648\u062f\u0631\u062f\u0634\u0629 \u0645\u0628\u0627\u0634\u0631\u0629 \u0639\u0628\u0631 Tawk.to \u0644\u0644\u062f\u0639\u0645 \u0627\u0644\u0641\u0648\u0631\u064a."));
  children.push(body("\u0641\u0643\u0631\u0629 \u0627\u0644\u0645\u0648\u0642\u0639 \u062a\u0642\u0648\u0645 \u0639\u0644\u0649 \u0625\u062f\u062e\u0627\u0644 \u0627\u0633\u0645\u064a\u0646 \u0643\u0627\u0645\u0644\u064a\u0646 \u0648\u062a\u0627\u0631\u064a\u062e \u0645\u064a\u0644\u0627\u062f \u0644\u0643\u0644 \u0634\u062e\u0635\u060c \u062b\u0645 \u062c\u0645\u0639 \u062c\u0645\u064a\u0639 \u0627\u0644\u0623\u0631\u0642\u0627\u0645 \u0648\u062a\u0642\u0644\u064a\u0644\u0647\u0627 \u0628\u0627\u0644\u0645\u064a\u0632 22. \u0627\u0644\u0646\u062a\u064a\u062c\u0629 \u062a\u062a\u0631\u0627\u0648\u062d \u0628\u064a\u0646 \u0625\u064a\u062c\u0627\u0628\u064a\u0629 \u0648\u0645\u062a\u0648\u0633\u0637\u0629 \u0648\u0633\u0644\u0628\u064a\u0629 \u062d\u0633\u0628 \u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0646\u0647\u0627\u0626\u064a. \u0627\u0644\u0646\u062a\u0627\u0626\u062c \u0627\u0644\u0645\u062c\u0627\u0646\u064a\u0629 \u062a\u0639\u0637\u064a \u0646\u062a\u064a\u062c\u0629 \u0645\u062e\u062a\u0635\u0631\u0629\u060c \u0628\u064a\u0646\u0645\u0627 \u0627\u0644\u0646\u062a\u0627\u0626\u062c \u0627\u0644\u0645\u0641\u0635\u0644\u0629 \u062a\u062a\u0637\u0644\u0628 \u062f\u0641\u0639 5 \u062f\u0648\u0644\u0627\u0631 \u0639\u0628\u0631 Spaceremit."));
  children.push(spacer());

  // Key info table
  children.push(heading("\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629"));
  const infoData = [
    ["\u0627\u0633\u0645 \u0627\u0644\u0645\u0648\u0642\u0639", "\u0623\u0639\u062f\u0627\u062f \u0648\u0628\u0635\u064a\u0631\u0629 | AI Numerology"],
    ["\u0631\u0627\u0628\u0637 \u0627\u0644\u0645\u0648\u0642\u0639", "https://numerology-app-delta.vercel.app"],
    ["\u0645\u0633\u062a\u0648\u062f\u0639 GitHub", "https://github.com/mohamedalprof/numerology-app"],
    ["\u0627\u0644\u0627\u0633\u062a\u0636\u0627\u0641\u0629", "Vercel (\u0645\u062c\u0627\u0646\u064a\u0629\u060c 24/7)"],
    ["\u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u062f\u0641\u0639", "Spaceremit"],
    ["\u0627\u0644\u062f\u0631\u062f\u0634\u0629 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629", "Tawk.to (Property ID: 6a0e11de2370201c349f28e6)"],
    ["\u0627\u0644\u0644\u063a\u0627\u062a", "\u0627\u0644\u0639\u0631\u0628\u064a\u0629 + \u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629 (RTL/LTR)"],
    ["\u0627\u0644\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627", "Next.js + TypeScript + Tailwind CSS"],
    ["\u0633\u0639\u0631 \u0627\u0644\u062e\u062f\u0645\u0629", "5 \u062f\u0648\u0644\u0627\u0631 \u0623\u0645\u0631\u064a\u0643\u064a"],
  ];
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D5D0C8" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: c(P.accent) },
            margins: { top: 60, bottom: 60, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: "\u0627\u0644\u0639\u0646\u0635\u0631", bold: true, size: 22, color: "FFFFFF", font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })] })] }),
          new TableCell({ width: { size: 65, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: c(P.accent) },
            margins: { top: 60, bottom: 60, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: "\u0627\u0644\u0642\u064a\u0645\u0629", bold: true, size: 22, color: "FFFFFF", font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })] })] }),
        ],
      }),
      ...infoData.map((row, i) => new TableRow({
        children: [
          new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? c(P.surface) : "FFFFFF" },
            margins: { top: 60, bottom: 60, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: row[0], bold: true, size: 21, color: c(P.body), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })] })] }),
          new TableCell({ width: { size: 65, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? c(P.surface) : "FFFFFF" },
            margins: { top: 60, bottom: 60, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: row[1], size: 21, color: c(P.body), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })] })] }),
        ],
      })),
    ],
  }));
  children.push(spacer());

  // ===== Section 2: Numerology Logic =====
  children.push(heading("\u0645\u0646\u0637\u0642 \u062d\u0633\u0627\u0628\u0627\u062a \u0627\u0644\u0623\u0631\u0642\u0627\u0645"));
  children.push(body("\u064a\u0639\u0645\u0644 \u0627\u0644\u0645\u0648\u0642\u0639 \u0628\u0646\u0638\u0627\u0645 \u062d\u0633\u0627\u0628 \u0627\u0644\u0623\u0631\u0642\u0627\u0645 \u0627\u0644\u062a\u0644\u0627\u0645\u064a\u062f\u064a. \u064a\u062a\u0645 \u0625\u062f\u062e\u0627\u0644 \u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644 \u0648\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0645\u064a\u0644\u0627\u062f \u0644\u0643\u0644 \u0634\u062e\u0635\u060c \u062b\u0645 \u062c\u0645\u0639 \u062c\u0645\u064a\u0639 \u0627\u0644\u0623\u0631\u0642\u0627\u0645 \u0641\u064a \u0627\u0644\u0627\u0633\u0645 \u0648\u0627\u0644\u062a\u0627\u0631\u064a\u062e \u0648\u062a\u0642\u0644\u064a\u0644\u0647\u0627 \u0628\u0627\u0644\u0645\u064a\u0632 22. \u0625\u0630\u0627 \u0643\u0627\u0646\u062a \u0627\u0644\u0646\u062a\u064a\u062c\u0629 0 \u0641\u062a\u062a\u062d\u0648\u0644 \u062a\u0644\u0642\u0627\u0626\u064a\u0627 \u0625\u0644\u0649 22. \u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0646\u0647\u0627\u0626\u064a \u064a\u062d\u062f\u062f \u062a\u0635\u0646\u064a\u0641 \u0627\u0644\u062a\u0648\u0627\u0641\u0642 \u0628\u064a\u0646 \u0625\u064a\u062c\u0627\u0628\u064a \u0623\u0648 \u0645\u062a\u0648\u0633\u0637 \u0623\u0648 \u0633\u0644\u0628\u064a."));
  children.push(spacer());

  children.push(heading("\u062a\u0635\u0646\u064a\u0641 \u0627\u0644\u0623\u0631\u0642\u0627\u0645", HeadingLevel.HEADING_2));
  children.push(labelValue("\u0625\u064a\u062c\u0627\u0628\u064a: ", "2, 3, 5, 6, 10, 14, 17, 19, 21"));
  children.push(labelValue("\u0645\u062a\u0648\u0633\u0637: ", "1, 4, 7, 8, 11, 20"));
  children.push(labelValue("\u0633\u0644\u0628\u064a: ", "9, 12, 13, 15, 16, 18, 22"));
  children.push(spacer());

  // ===== Section 3: Technical Architecture =====
  children.push(heading("\u0627\u0644\u0647\u064a\u0643\u0644 \u0627\u0644\u062a\u0642\u0646\u064a"));
  children.push(body("\u0628\u064f\u0646\u064a \u0627\u0644\u0645\u0648\u0642\u0639 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0625\u0637\u0627\u0631 \u0639\u0645\u0644 Next.js \u0645\u0639 TypeScript \u0648 Tailwind CSS \u0644\u0644\u062a\u0635\u0645\u064a\u0645. \u0627\u0644\u0645\u0648\u0642\u0639 \u064a\u0639\u0645\u0644 \u0628\u0646\u0638\u0627\u0645 Client-Side Rendering \u0644\u0623\u0646 \u062c\u0645\u064a\u0639 \u0627\u0644\u062a\u0641\u0627\u0639\u0644\u0627\u062a \u062a\u062d\u062f\u062b \u0641\u064a \u0627\u0644\u0645\u062a\u0635\u0641\u062d\u060c \u0645\u0639 \u0648\u0627\u062c\u0647\u0629 API \u062e\u0644\u0641\u064a\u0629 \u0644\u0644\u062a\u062d\u0642\u0642 \u0645\u0646 \u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0644\u062f\u0641\u0639."));
  children.push(spacer());

  children.push(heading("\u0627\u0644\u0645\u0644\u0641\u0627\u062a \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629", HeadingLevel.HEADING_2));
  const filesData = [
    ["src/app/page.tsx", "\u0627\u0644\u0635\u0641\u062d\u0629 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629 - \u0627\u0644\u0648\u0627\u062c\u0647\u0629 \u0648\u0627\u0644\u062a\u0641\u0627\u0639\u0644 \u0645\u0639 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645"],
    ["src/app/layout.tsx", "\u0627\u0644\u062a\u062e\u0637\u064a\u0637 \u0627\u0644\u0639\u0627\u0645 - \u064a\u062a\u0636\u0645\u0646 \u0643\u0648\u062f Tawk.to"],
    ["src/lib/numerology.ts", "\u0645\u0646\u0637\u0642 \u062d\u0633\u0627\u0628\u0627\u062a \u0627\u0644\u0623\u0631\u0642\u0627\u0645"],
    ["src/app/api/spaceremit-callback/route.ts", "\u0648\u0627\u062c\u0647\u0629 API \u0644\u0644\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u062f\u0641\u0639"],
    [".env", "\u0645\u062a\u063a\u064a\u0631\u0627\u062a \u0627\u0644\u0628\u064a\u0626\u0629 (\u0645\u0641\u0627\u062a\u064a\u062d Spaceremit)"],
  ];
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D5D0C8" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({ width: { size: 45, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: c(P.accent) },
            margins: { top: 60, bottom: 60, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: "\u0627\u0644\u0645\u0644\u0641", bold: true, size: 22, color: "FFFFFF", font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })] })] }),
          new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: c(P.accent) },
            margins: { top: 60, bottom: 60, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: "\u0627\u0644\u0648\u0638\u064a\u0641\u0629", bold: true, size: 22, color: "FFFFFF", font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })] })] }),
        ],
      }),
      ...filesData.map((row, i) => new TableRow({
        children: [
          new TableCell({ width: { size: 45, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? c(P.surface) : "FFFFFF" },
            margins: { top: 60, bottom: 60, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: row[0], size: 21, color: c(P.body), font: { ascii: "Consolas", eastAsia: "Microsoft YaHei" } })] })] }),
          new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? c(P.surface) : "FFFFFF" },
            margins: { top: 60, bottom: 60, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: row[1], size: 21, color: c(P.body), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })] })] }),
        ],
      })),
    ],
  }));
  children.push(spacer());

  // ===== Section 4: Spaceremit Integration =====
  children.push(heading("\u062a\u0643\u0627\u0645\u0644 Spaceremit \u0644\u0644\u062f\u0641\u0639"));
  children.push(body("\u062a\u0645 \u062f\u0645\u062c \u0628\u0648\u0627\u0628\u0629 \u062f\u0641\u0639 Spaceremit \u0644\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0627\u0644\u0646\u062a\u0627\u0626\u062c \u0627\u0644\u0645\u0641\u0635\u0644\u0629. \u0627\u0644\u0639\u0645\u0644\u064a\u0629 \u062a\u0639\u0645\u0644 \u0643\u0627\u0644\u062a\u0627\u0644\u064a: \u0639\u0646\u062f\u0645\u0627 \u064a\u0646\u062a\u0642\u0644 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645 \u0644\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0627\u0644\u0646\u062a\u064a\u062c\u0629 \u0627\u0644\u0645\u0641\u0635\u0644\u0629\u060c \u064a\u0638\u0647\u0631 \u0646\u0627\u0641\u0630\u0629 \u062f\u0641\u0639 Spaceremit \u0628\u0633\u0639\u0631 5 \u062f\u0648\u0644\u0627\u0631 \u0623\u0645\u0631\u064a\u0643\u064a. \u0628\u0639\u062f \u0625\u062a\u0645\u0627\u0645 \u0627\u0644\u062f\u0641\u0639\u060c \u064a\u0631\u0633\u0644 Spaceremit \u0625\u0634\u0639\u0627\u0631\u0627 \u0625\u0644\u0649 \u0648\u0627\u062c\u0647\u0629 API \u0627\u0644\u062e\u0644\u0641\u064a\u0629 \u0644\u0644\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u062f\u0641\u0639\u060c \u062b\u0645 \u064a\u062a\u0645 \u0639\u0631\u0636 \u0627\u0644\u0646\u062a\u0627\u0626\u062c."));
  children.push(spacer());

  children.push(heading("\u0645\u0634\u0643\u0644\u0629 \u0627\u0644\u062f\u0648\u0645\u064a\u0646 \u0648\u0627\u0644\u062d\u0644", HeadingLevel.HEADING_2));
  children.push(body("\u0648\u0627\u062c\u0647\u0646\u0627 \u0645\u0634\u0643\u0644\u0629 \u0623\u0646 \u062e\u064a\u0627\u0631\u0627\u062a \u0627\u0644\u062f\u0641\u0639 \u0641\u064a Spaceremit (\u0645\u062b\u0644 Vodafone Cash \u0648\u0627\u0644\u062e\u064a\u0627\u0631\u0627\u062a \u0627\u0644\u0633\u0639\u0648\u062f\u064a\u0629) \u0644\u0645 \u062a\u0643\u0646 \u062a\u0639\u0645\u0644. \u0627\u0644\u0633\u0628\u0628 \u0643\u0627\u0646 \u0623\u0646 \u0627\u0644\u062f\u0648\u0645\u064a\u0646 \u0627\u0644\u0645\u0633\u062c\u0644 \u0641\u064a Spaceremit \u0643\u0627\u0646 numberandinsight.space-z.ai \u0648\u0644\u0643\u0646 \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0641\u0639\u0644\u064a \u0639\u0644\u0649 numerology-app-delta.vercel.app. \u0627\u0644\u062d\u0644 \u0643\u0627\u0646 \u0625\u0636\u0627\u0641\u0629 \u0645\u0648\u0642\u0639 \u062c\u062f\u064a\u062f \u0641\u064a Spaceremit \u0628\u0627\u0633\u0645 Numerology App \u0645\u0639 \u0627\u0644\u062f\u0648\u0645\u064a\u0646 \u0627\u0644\u0635\u062d\u064a\u062d."));
  children.push(body("\u0627\u0644\u062d\u0627\u0644\u0629 \u0627\u0644\u062d\u0627\u0644\u064a\u0629: \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u062c\u062f\u064a\u062f \u0641\u064a \u062d\u0627\u0644\u0629 Pending (\u0628\u0627\u0646\u062a\u0638\u0627\u0631 \u0627\u0644\u062a\u062d\u0642\u0642). \u0628\u0639\u062f \u0627\u0644\u062a\u062d\u0642\u0642\u060c \u0633\u064a\u062c\u0628 \u0627\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0645\u0641\u0627\u062a\u064a\u062d API \u062c\u062f\u064a\u062f\u0629 \u0648\u064a\u062c\u0628 \u062a\u062d\u062f\u064a\u062b\u0647\u0627 \u0641\u064a Vercel Environment Variables."));
  children.push(spacer());

  children.push(heading("Callback URL", HeadingLevel.HEADING_2));
  children.push(codeLine("https://numerology-app-delta.vercel.app/api/spaceremit-callback"));
  children.push(body("\u0647\u0630\u0627 \u0647\u0648 \u0631\u0627\u0628\u0637 \u0627\u0644\u0627\u0633\u062a\u062f\u0639\u0627\u0621 \u0627\u0644\u0630\u064a \u064a\u0631\u0633\u0644 \u0625\u0644\u064a\u0647 Spaceremit \u0625\u0634\u0639\u0627\u0631\u0627\u062a \u0627\u0644\u062f\u0641\u0639 \u0644\u0644\u062a\u062d\u0642\u0642 \u0645\u0646\u0647\u0627. \u062a\u0645 \u062a\u062d\u062f\u064a\u062b\u0647 \u0641\u064a \u0625\u0639\u062f\u0627\u062f\u0627\u062a Spaceremit \u0644\u064a\u0634\u064a\u0631 \u0625\u0644\u0649 \u0627\u0644\u062f\u0648\u0645\u064a\u0646 \u0627\u0644\u062c\u062f\u064a\u062f."));
  children.push(spacer());

  // ===== Section 5: Deployment =====
  children.push(heading("\u0627\u0644\u0646\u0634\u0631 \u0639\u0644\u0649 Vercel"));
  children.push(body("\u062a\u0645 \u0646\u0634\u0631 \u0627\u0644\u0645\u0648\u0642\u0639 \u0639\u0644\u0649 \u0645\u0646\u0635\u0629 Vercel \u0627\u0644\u0645\u062c\u0627\u0646\u064a\u0629 \u0644\u0644\u0627\u0633\u062a\u0636\u0627\u0641\u0629 24/7. \u0627\u0644\u0639\u0645\u0644\u064a\u0629 \u0645\u0631\u062a \u0628\u0639\u062f\u0629 \u062e\u0637\u0648\u0627\u062a:"));
  children.push(bullet("\u0625\u0646\u0634\u0627\u0621 \u0645\u0633\u062a\u0648\u062f\u0639 GitHub: mohamedalprof/numerology-app"));
  children.push(bullet("\u0625\u0646\u0634\u0627\u0621 GitHub Personal Access Token \u0644\u062f\u0641\u0639 \u0627\u0644\u0643\u0648\u062f (\u062a\u0645 \u062d\u0630\u0641\u0647 \u0628\u0639\u062f \u0643\u0644 \u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0644\u0644\u0623\u0645\u0627\u0646)"));
  children.push(bullet("\u0631\u0628\u0637 \u0627\u0644\u0645\u0633\u062a\u0648\u062f\u0639 \u0628\u0640 Vercel \u0648\u0625\u0636\u0627\u0641\u0629 Environment Variables"));
  children.push(bullet("\u0627\u0644\u0646\u0634\u0631 \u0627\u0644\u062a\u0644\u0642\u0627\u0626\u064a \u0639\u0646\u062f \u0643\u0644 \u062f\u0641\u0639 \u062c\u062f\u064a\u062f \u0644\u0644\u0643\u0648\u062f"));
  children.push(body("\u062a\u0645 \u062f\u0641\u0639 \u0627\u0644\u0643\u0648\u062f 3 \u0645\u0631\u0627\u062a \u062e\u0644\u0627\u0644 \u0627\u0644\u062c\u0644\u0633\u0627\u062a \u0627\u0644\u0633\u0627\u0628\u0642\u0629: \u0627\u0644\u0645\u0631\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 \u0644\u0644\u0643\u0648\u062f \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u060c \u0648\u0627\u0644\u0645\u0631\u0629 \u0627\u0644\u062b\u0627\u0646\u064a\u0629 \u0644\u0625\u0635\u0644\u0627\u062d\u0627\u062a Spaceremit SDK\u060c \u0648\u0627\u0644\u0645\u0631\u0629 \u0627\u0644\u062b\u0627\u0644\u062b\u0629 \u0644\u0625\u0636\u0627\u0641\u0629 Tawk.to. \u0643\u0644 \u0645\u0631\u0629 \u0643\u0627\u0646 \u064a\u062a\u0645 \u0625\u0646\u0634\u0627\u0621 Token \u062c\u062f\u064a\u062f \u062b\u0645 \u062d\u0630\u0641\u0647 \u0628\u0639\u062f \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0644\u0644\u062d\u0641\u0627\u0638 \u0639\u0644\u0649 \u0627\u0644\u0623\u0645\u0627\u0646."));
  children.push(spacer());

  children.push(heading("\u0645\u062a\u063a\u064a\u0631\u0627\u062a \u0627\u0644\u0628\u064a\u0626\u0629 \u0641\u064a Vercel", HeadingLevel.HEADING_2));
  children.push(codeLine("SPACEREMIT_API_KEY = [your_spaceremit_api_key]"));
  children.push(codeLine("SPACEREMIT_MERCHANT_ID = [your_merchant_id]"));
  children.push(codeLine("SPACEREMIT_WEBSITE_ID = [your_website_id]"));
  children.push(body("\u0645\u0644\u0627\u062d\u0638\u0629: \u0633\u064a\u062c\u0628 \u062a\u062d\u062f\u064a\u062b \u0647\u0630\u0647 \u0627\u0644\u0645\u0641\u0627\u062a\u064a\u062d \u0628\u0639\u062f \u062a\u062d\u0642\u0642 \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u062c\u062f\u064a\u062f \u0641\u064a Spaceremit."));
  children.push(spacer());

  // ===== Section 6: Tawk.to =====
  children.push(heading("\u062a\u0643\u0627\u0645\u0644 Tawk.to \u0644\u0644\u062f\u0631\u062f\u0634\u0629"));
  children.push(body("\u062a\u0645 \u062f\u0645\u062c \u062e\u062f\u0645\u0629 Tawk.to \u0644\u0644\u062f\u0631\u062f\u0634\u0629 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629 \u0645\u0639 \u0627\u0644\u0632\u0648\u0627\u0631. \u0639\u0646\u062f\u0645\u0627 \u064a\u0636\u063a\u0637 \u0627\u0644\u0632\u0627\u0626\u0631 \u0639\u0644\u0649 \u0623\u064a\u0642\u0648\u0646\u0629 \u0627\u0644\u062f\u0631\u062f\u0634\u0629 \u0641\u064a \u0627\u0644\u0631\u0643\u0646 \u0627\u0644\u0633\u0641\u0644\u064a \u0627\u0644\u0623\u064a\u0645\u0646\u060c \u064a\u0641\u062a\u062a\u062d \u0646\u0627\u0641\u0630\u0629 \u062f\u0631\u062f\u0634\u0629 \u064a\u0645\u0643\u0646\u0647 \u0645\u0646 \u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0644\u0629 \u0645\u0628\u0627\u0634\u0631\u0629. \u0627\u0644\u0631\u0633\u0627\u0626\u0644 \u062a\u0638\u0647\u0631 \u0641\u064a \u0644\u0648\u062d\u0629 \u062a\u062d\u0643\u0645 Tawk.to \u0648\u064a\u0645\u0643\u0646 \u0627\u0644\u0631\u062f \u0639\u0644\u064a\u0647\u0627 \u0641\u0648\u0631\u0627."));
  children.push(spacer());
  children.push(labelValue("Property ID: ", "6a0e11de2370201c349f28e6"));
  children.push(body("\u062a\u0645 \u0625\u0636\u0627\u0641\u0629 \u0643\u0648\u062f Tawk.to \u0641\u064a \u0645\u0644\u0641 layout.tsx \u0642\u0628\u0644 \u062a\u063a\u0644\u064a\u0642 \u0648\u0633\u0645 body. \u064a\u062f\u0639\u0645 Tawk.to \u0645\u064a\u0632\u0629 \u0627\u0644\u0631\u062f \u0627\u0644\u0622\u0644\u064a \u0639\u0628\u0631 \u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0627\u0644\u062a\u0631\u062d\u064a\u0628 \u0641\u064a \u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645\u060c \u0648\u064a\u0645\u0643\u0646 \u0625\u0639\u062f\u0627\u062f \u0631\u0633\u0627\u0626\u0644 \u062a\u0631\u062d\u064a\u0628\u064a\u0629 \u062a\u0638\u0647\u0631 \u062a\u0644\u0642\u0627\u0626\u064a\u0627 \u0639\u0646\u062f\u0645\u0627 \u064a\u0628\u062f\u0623 \u0627\u0644\u0632\u0627\u0626\u0631 \u062f\u0631\u062f\u0634\u0629."));
  children.push(spacer());

  // ===== Section 7: Marketing =====
  children.push(heading("\u0627\u0644\u062a\u0633\u0648\u064a\u0642 \u0648\u0627\u0644\u0646\u0634\u0631"));
  children.push(body("\u062a\u0645 \u0625\u0639\u062f\u0627\u062f \u0645\u062d\u062a\u0648\u0649 \u062a\u0633\u0648\u064a\u0642\u064a \u0644\u0646\u0634\u0631 \u0627\u0644\u0645\u0648\u0642\u0639 \u0639\u0644\u0649 \u0645\u0646\u0635\u0629 ZadWork Marketplace \u0627\u0644\u062e\u0627\u0635\u0629 \u0628\u0640 Spaceremit. \u0647\u0630\u0627 \u0627\u0644\u0645\u062d\u062a\u0648\u0649 \u064a\u0634\u0645\u0644 \u0648\u0635\u0641 \u0627\u0644\u062e\u062f\u0645\u0629 \u0648Hook \u062c\u0630\u0627\u0628 \u0648\u0639\u0646\u0648\u0627\u0646 \u0644\u0644\u062e\u062f\u0645\u0629."));
  children.push(spacer());

  children.push(heading("Hook \u0627\u0644\u062a\u0633\u0648\u064a\u0642\u064a", HeadingLevel.HEADING_2));
  children.push(bodyNoIndent("\u0647\u0644 \u0623\u0646\u062a\u064a/\u0623\u0646\u062a \u0645\u062a\u0632\u0648\u062c\u0629 \u0623\u0648 \u0641\u064a \u0639\u0644\u0627\u0642\u0629\u061f \u0627\u0643\u062a\u0634\u0641\u064a \u062a\u0648\u0627\u0641\u0642 \u0623\u0631\u0642\u0627\u0645\u0643\u0645\u0627 \u0628\u062f\u0642\u0629 \u0645\u0630\u0647\u0644\u0629! \u062d\u0635\u0644\u064a \u0639\u0644\u0649 \u0646\u062a\u064a\u062c\u0629 \u062a\u0648\u0627\u0641\u0642 \u0627\u0644\u0623\u0631\u0642\u0627\u0645 \u0628\u064a\u0646\u0643 \u0648\u0628\u064a\u0646 \u0634\u0631\u064a\u0643\u0643 \u0641\u064a \u062b\u0648\u0627\u0646\u064a \u0645\u0639\u062f\u0648\u062f\u0629. \u0645\u062c\u0627\u0646\u0627 \u0627\u0644\u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0623\u0648\u0644\u0649\u060c \u062b\u0645 \u0627\u0643\u0634\u0641\u064a \u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0645\u062e\u0641\u064a\u0629!"));
  children.push(spacer());

  children.push(heading("\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u062e\u062f\u0645\u0629", HeadingLevel.HEADING_2));
  children.push(bodyNoIndent("\u062d\u0633\u0627\u0628 \u062a\u0648\u0627\u0641\u0642 \u0627\u0644\u0623\u0631\u0642\u0627\u0645 - \u0627\u0643\u062a\u0634\u0641 \u0645\u062f\u0649 \u062a\u0648\u0627\u0641\u0642\u0643 \u0645\u0639 \u0634\u0631\u064a\u0643 \u062d\u064a\u0627\u062a\u0643"));
  children.push(spacer());

  children.push(heading("\u0648\u0635\u0641 \u0627\u0644\u062e\u062f\u0645\u0629 \u0644\u0640 Spaceremit", HeadingLevel.HEADING_2));
  children.push(bodyNoIndent("\u0627\u0643\u062a\u0634\u0641 \u062a\u0648\u0627\u0641\u0642 \u0627\u0644\u0623\u0631\u0642\u0627\u0645 \u0628\u064a\u0646\u0643 \u0648\u0628\u064a\u0646 \u0634\u0631\u064a\u0643\u0643 \u0628\u062f\u0642\u0629 \u0639\u0627\u0644\u064a\u0629. \u0623\u062f\u062e\u0644\u064a \u0627\u0633\u0645\u0643 \u0648\u062a\u0627\u0631\u064a\u062e \u0645\u064a\u0644\u0627\u062f\u0643 \u0648\u0627\u0633\u0645 \u0634\u0631\u064a\u0643\u0643 \u0648\u062a\u0627\u0631\u064a\u062e \u0645\u064a\u0644\u0627\u062f\u0647\u060c \u0648\u0627\u062d\u0635\u0644\u064a \u0639\u0644\u0649 \u062a\u062d\u0644\u064a\u0644 \u0634\u0627\u0645\u0644 \u0644\u062a\u0648\u0627\u0641\u0642\u0643\u0645\u0627 \u0641\u064a \u062b\u0648\u0627\u0646\u064a \u0645\u0639\u062f\u0648\u062f\u0629. \u0627\u0644\u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 \u0645\u062c\u0627\u0646\u064a\u0629\u060c \u0648\u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0643\u0627\u0645\u0644\u0629 \u0628\u0640 5 \u062f\u0648\u0644\u0627\u0631 \u0641\u0642\u0637!"));
  children.push(spacer());

  // ===== Section 8: Fixes & Problems =====
  children.push(heading("\u0627\u0644\u0645\u0634\u0627\u0643\u0644 \u0627\u0644\u062a\u064a \u062a\u0645 \u062d\u0644\u0647\u0627"));
  children.push(spacer());

  children.push(heading("\u0645\u0634\u0643\u0644\u0629 1: \u0639\u062f\u0645 \u0638\u0647\u0648\u0631 \u0645\u062d\u0641\u0638\u0629 Spaceremit \u0641\u064a \u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629", HeadingLevel.HEADING_2));
  children.push(body("\u0627\u0644\u0645\u0634\u0643\u0644\u0629: \u0639\u0646\u062f \u0627\u0644\u062a\u0628\u062f\u064a\u0644 \u0644\u0644\u063a\u0629 \u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629\u060c \u0643\u0627\u0646\u062a \u062e\u064a\u0627\u0631\u0627\u062a \u0627\u0644\u062f\u0641\u0639 \u0644\u0627 \u062a\u0638\u0647\u0631 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0641\u064a \u0646\u0627\u0641\u0630\u0629 Spaceremit. \u0627\u0644\u0633\u0628\u0628: \u0643\u0627\u0646 \u064a\u062a\u0645 \u0625\u062e\u0641\u0627\u0621 \u0627\u0644\u0646\u0627\u0641\u0630\u0629 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 display:none \u0645\u0645\u0627 \u064a\u0645\u0646\u0639 Spaceremit SDK \u0645\u0646 \u0627\u0644\u062a\u062d\u0645\u064a\u0644 \u0628\u0634\u0643\u0644 \u0635\u062d\u064a\u062d. \u0627\u0644\u062d\u0644: \u062a\u063a\u064a\u064a\u0631 \u0625\u0644\u0649 visibility \u0628\u062f\u0644\u0627 \u0645\u0646 display:none\u060c \u0648\u0625\u0636\u0627\u0641\u0629 \u0625\u0639\u0627\u062f\u0629 \u062a\u0647\u064a\u0626\u0629 Spaceremit SDK \u0639\u0646\u062f \u062a\u063a\u064a\u064a\u0631 \u0627\u0644\u0644\u063a\u0629 \u0648\u0639\u0646\u062f \u0641\u062a\u062d \u0627\u0644\u0646\u0627\u0641\u0630\u0629."));
  children.push(spacer());

  children.push(heading("\u0645\u0634\u0643\u0644\u0629 2: \u0631\u0627\u0628\u0637 \u0627\u0644\u0645\u0639\u0627\u064a\u0646\u0629 \u0644\u0627 \u064a\u0639\u0645\u0644 \u0641\u064a Chrome", HeadingLevel.HEADING_2));
  children.push(body("\u0627\u0644\u0645\u0634\u0643\u0644\u0629: \u0631\u0627\u0628\u0637 \u0627\u0644\u0645\u0639\u0627\u064a\u0646\u0629 \u0641\u064a \u0627\u0644\u0645\u062a\u0635\u0641\u062d \u0644\u0645 \u064a\u0643\u0646 \u064a\u0639\u0645\u0644 \u0639\u0646\u062f \u0641\u062a\u062d\u0647 \u0641\u064a Chrome. \u0627\u0644\u0633\u0628\u0628: \u0631\u0627\u0628\u0637 \u0627\u0644\u0645\u0639\u0627\u064a\u0646\u0629 \u064a\u0639\u0645\u0644 \u0641\u0642\u0637 \u062f\u0627\u062e\u0644 \u0628\u064a\u0626\u0629 \u0627\u0644\u062a\u0637\u0648\u064a\u0631 \u0648\u0644\u0627 \u064a\u0645\u0643\u0646 \u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u064a\u0647 \u0645\u0646 \u0627\u0644\u0625\u0646\u062a\u0631\u0646\u062a. \u0627\u0644\u062d\u0644: \u0646\u0634\u0631 \u0627\u0644\u0645\u0648\u0642\u0639 \u0639\u0644\u0649 \u0627\u0633\u062a\u0636\u0627\u0641\u0629 \u062d\u0642\u064a\u0642\u064a\u0629 (Vercel)."));
  children.push(spacer());

  children.push(heading("\u0645\u0634\u0643\u0644\u0629 3: \u062e\u064a\u0627\u0631\u0627\u062a \u0627\u0644\u062f\u0641\u0639 \u0644\u0627 \u062a\u0639\u0645\u0644", HeadingLevel.HEADING_2));
  children.push(body("\u0627\u0644\u0645\u0634\u0643\u0644\u0629: \u062e\u064a\u0627\u0631\u0627\u062a \u0627\u0644\u062f\u0641\u0639 \u0645\u062b\u0644 Vodafone Cash \u0648\u0627\u0644\u062e\u064a\u0627\u0631\u0627\u062a \u0627\u0644\u0633\u0639\u0648\u062f\u064a\u0629 \u0643\u0627\u0646\u062a \u062a\u0638\u0647\u0631 \u0644\u0643\u0646 \u0644\u0627 \u062a\u0639\u0645\u0644 \u0639\u0646\u062f \u0627\u0644\u0636\u063a\u0637 \u0639\u0644\u064a\u0647\u0627. \u0627\u0644\u0633\u0628\u0628: \u0639\u062f\u0645 \u062a\u0637\u0627\u0628\u0642 \u0627\u0644\u062f\u0648\u0645\u064a\u0646 - Spaceremit \u0643\u0627\u0646 \u064a\u062a\u0637\u0644\u0628 \u0623\u0646 \u064a\u0643\u0648\u0646 \u0627\u0644\u062f\u0648\u0645\u064a\u0646 \u0645\u0637\u0627\u0628\u0642\u0627 \u0644\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0645\u0633\u062c\u0644. \u0627\u0644\u062d\u0644: \u0625\u0636\u0627\u0641\u0629 \u0645\u0648\u0642\u0639 \u062c\u062f\u064a\u062f \u0641\u064a Spaceremit \u0628\u0627\u0644\u062f\u0648\u0645\u064a\u0646 \u0627\u0644\u0635\u062d\u064a\u062d (\u062d\u0627\u0644\u0629 Pending \u062d\u062a\u0649 \u0627\u0644\u0622\u0646)."));
  children.push(spacer());

  // ===== Section 9: Pending Tasks =====
  children.push(heading("\u0627\u0644\u0645\u0647\u0627\u0645 \u0627\u0644\u0645\u0639\u0644\u0642\u0629"));
  children.push(bullet("\u0627\u0646\u062a\u0638\u0627\u0631 \u062a\u062d\u0642\u0642 \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u062c\u062f\u064a\u062f \u0641\u064a Spaceremit (Numerology App) - \u0627\u0644\u062d\u0627\u0644\u0629: Pending"));
  children.push(bullet("\u0628\u0639\u062f \u0627\u0644\u062a\u062d\u0642\u0642: \u0627\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0645\u0641\u0627\u062a\u064a\u062d API \u0627\u0644\u062c\u062f\u064a\u062f\u0629"));
  children.push(bullet("\u062a\u062d\u062f\u064a\u062b \u0645\u062a\u063a\u064a\u0631\u0627\u062a \u0627\u0644\u0628\u064a\u0626\u0629 \u0641\u064a Vercel \u0628\u0627\u0644\u0645\u0641\u0627\u062a\u064a\u062d \u0627\u0644\u062c\u062f\u064a\u062f\u0629"));
  children.push(bullet("\u0627\u062e\u062a\u0628\u0627\u0631 \u0639\u0645\u0644\u064a\u0629 \u0627\u0644\u062f\u0641\u0639 \u0628\u0639\u062f \u0627\u0644\u062a\u062d\u0642\u0642"));
  children.push(bullet("\u0646\u0634\u0631 \u0627\u0644\u062e\u062f\u0645\u0629 \u0639\u0644\u0649 ZadWork Marketplace"));
  children.push(bullet("\u0625\u0639\u062f\u0627\u062f \u0631\u0633\u0627\u0626\u0644 \u062a\u0631\u062d\u064a\u0628 \u0622\u0644\u064a\u0629 \u0641\u064a Tawk.to"));
  children.push(spacer());

  // ===== Section 10: How to update code =====
  children.push(heading("\u0643\u064a\u0641\u064a\u0629 \u062a\u062d\u062f\u064a\u062b \u0627\u0644\u0643\u0648\u062f \u0641\u064a \u0627\u0644\u0645\u0633\u062a\u0642\u0628\u0644"));
  children.push(body("\u0644\u062a\u062d\u062f\u064a\u062b \u0627\u0644\u0643\u0648\u062f \u0641\u064a \u0627\u0644\u0645\u0633\u062a\u0642\u0628\u0644\u060c \u0627\u062a\u0628\u0639 \u0647\u0630\u0647 \u0627\u0644\u062e\u0637\u0648\u0627\u062a:"));
  children.push(bullet("\u0627\u062f\u062e\u0644 \u0625\u0644\u0649 GitHub \u0648\u0627\u0641\u062a\u062d \u0627\u0644\u0645\u0633\u062a\u0648\u062f\u0639: mohamedalprof/numerology-app"));
  children.push(bullet("\u0623\u0646\u0634\u0626 GitHub Personal Access Token \u062c\u062f\u064a\u062f (\u0635\u0644\u0627\u062d\u064a\u0627\u062a repo)"));
  children.push(bullet("\u0627\u0633\u062a\u062e\u062f\u0645 \u0627\u0644\u0640 Token \u0644\u062f\u0641\u0639 \u0627\u0644\u062a\u063a\u064a\u064a\u0631\u0627\u062a \u0639\u0628\u0631 \u0627\u0644\u0623\u0648\u0627\u0645\u0631"));
  children.push(bullet("\u0627\u062d\u0630\u0641 \u0627\u0644\u0640 Token \u0628\u0639\u062f \u0627\u0644\u0627\u0646\u062a\u0647\u0627\u0621 \u0644\u0644\u062d\u0641\u0627\u0638 \u0639\u0644\u0649 \u0627\u0644\u0623\u0645\u0627\u0646"));
  children.push(bullet("Vercel \u0633\u064a\u0642\u0648\u0645 \u0628\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0646\u0634\u0631 \u062a\u0644\u0642\u0627\u0626\u064a\u0627 \u0639\u0646\u062f \u062f\u0641\u0639 \u0643\u0648\u062f \u062c\u062f\u064a\u062f \u0644\u0644\u0645\u0633\u062a\u0648\u062f\u0639"));
  children.push(spacer());

  // ===== Section 11: Important notes =====
  children.push(heading("\u0645\u0644\u0627\u062d\u0638\u0627\u062a \u0645\u0647\u0645\u0629"));
  children.push(bullet("\u0627\u0644\u0645\u0648\u0642\u0639 \u064a\u0639\u0645\u0644 24/7 \u0639\u0644\u0649 Vercel \u0628\u062f\u0648\u0646 \u062a\u0643\u0644\u0641\u0629"));
  children.push(bullet("\u0643\u0644 \u062a\u063a\u064a\u064a\u0631 \u0641\u064a \u0627\u0644\u0643\u0648\u062f \u064a\u062a\u0645 \u0646\u0634\u0631\u0647 \u062a\u0644\u0642\u0627\u0626\u064a\u0627 \u0639\u0628\u0631 Vercel"));
  children.push(bullet("\u0627\u0644\u062f\u0631\u062f\u0634\u0629 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629 \u062a\u0639\u0645\u0644 \u0639\u0628\u0631 Tawk.to \u0648\u064a\u0645\u0643\u0646 \u0625\u062f\u0627\u0631\u062a\u0647\u0627 \u0645\u0646 \u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645"));
  children.push(bullet("\u0627\u062d\u0630\u0641 \u062f\u0627\u0626\u0645\u0627 \u0631\u0645\u0648\u0632 GitHub \u0628\u0639\u062f \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0644\u0644\u062d\u0641\u0627\u0638 \u0639\u0644\u0649 \u0623\u0645\u0627\u0646 \u0627\u0644\u062d\u0633\u0627\u0628"));
  children.push(bullet("\u0644\u062a\u062d\u062f\u064a\u062b \u0645\u062a\u063a\u064a\u0631\u0627\u062a \u0627\u0644\u0628\u064a\u0626\u0629 \u0641\u064a Vercel: \u0627\u062f\u062e\u0644 \u0625\u0644\u0649 \u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645 > Settings > Environment Variables"));
  children.push(bullet("\u0627\u0644\u0645\u0648\u0642\u0639 \u064a\u062f\u0639\u0645 RTL \u0644\u0644\u0639\u0631\u0628\u064a\u0629 \u0648LTR \u0644\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629 \u062a\u0644\u0642\u0627\u0626\u064a\u0627"));

  return children;
}

// ======= ASSEMBLE DOCUMENT =======
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }, size: 24, color: c(P.body) },
        paragraph: { spacing: { line: 312 } },
      },
    },
    heading1: {
      run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 32, bold: true, color: c(P.primary) },
    },
    heading2: {
      run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 28, bold: true, color: c(P.primary) },
    },
  },
  sections: [
    // Cover section
    {
      properties: {
        page: { margin: { top: 0, bottom: 0, left: 0, right: 0 } },
      },
      children: buildCover(),
    },
    // Body section
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1 },
        },
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: c(P.secondary) })],
          })],
        }),
      },
      children: buildContent(),
    },
  ],
});

// Generate
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/home/z/my-project/download/numberlogy.docx", buf);
  console.log("Document generated: /home/z/my-project/download/numberlogy.docx");
});
