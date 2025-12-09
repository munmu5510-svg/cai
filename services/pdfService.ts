import { jsPDF } from "jspdf";
import { User } from '../types';

export const generateStrategyPDF = (title: string, strategy: string, user: User, date: number) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxLineWidth = pageWidth - margin * 2;
  
  let y = 20;

  // Branding Header
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235); // Electric Blue
  doc.setFont("helvetica", "bold");
  doc.text("WySider", margin, y);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont("helvetica", "normal");
  doc.text("Visionary Strategy Architect", margin + 45, y);
  
  y += 10;
  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  // Document Title
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(title, maxLineWidth);
  doc.text(titleLines, margin, y);
  y += (titleLines.length * 8) + 5;

  // Metadata
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.setFont("helvetica", "normal");
  doc.text(`Architect: ${user.name}`, margin, y);
  const dateStr = new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(dateStr, pageWidth - margin - doc.getTextWidth(dateStr), y);
  y += 15;

  // Content Body
  doc.setFontSize(11);
  const lineHeight = 6;

  const lines = strategy.split('\n');
  
  lines.forEach(line => {
    // Basic Markdown parsing for headers (**Header**)
    const trimmed = line.trim();
    const isBold = trimmed.startsWith('**') || trimmed.endsWith('**') || trimmed.startsWith('#');
    const cleanLine = line.replace(/\*\*/g, '').replace(/^#+\s/, '');

    // Page Break Logic
    if (y > 270) {
        doc.addPage();
        y = 20;
    }

    if (isBold) {
        y += 4; // Pre-header spacing
        if (y > 270) { doc.addPage(); y = 20; }
        
        doc.setFont("helvetica", "bold");
        doc.setTextColor(20); // Near black
    } else {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(50); // Dark Gray
    }

    if (cleanLine.trim() === '') {
        y += lineHeight;
        return;
    }

    const wrappedLines = doc.splitTextToSize(cleanLine, maxLineWidth);
    doc.text(wrappedLines, margin, y);
    
    y += (wrappedLines.length * lineHeight);
  });

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount} • Powered by WySider`, pageWidth / 2, 290, { align: 'center' });
  }

  // Generate Filename
  const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 30);
  doc.save(`wysider_strategy_${safeTitle}.pdf`);
};