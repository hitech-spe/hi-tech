import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommercialQuote } from '../models/quote.model';

@Injectable({
  providedIn: 'root'
})
export class PdfQuoteGeneratorService {

  generateQuotePdf(quote: CommercialQuote): jsPDF {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2); // 170 mm
    let currentY = margin;

    // Palette Colori Brand Hi-Tech
    const primaryColor: [number, number, number] = [0, 210, 255];     // Cyan Hi-Tech
    const secondaryColor: [number, number, number] = [58, 123, 213];  // Blue Hi-Tech
    const darkBg: [number, number, number] = [15, 23, 42];            // Slate 900
    const textDark: [number, number, number] = [30, 41, 59];          // Slate 800
    const textMuted: [number, number, number] = [100, 116, 139];      // Slate 500
    const lightBorder: [number, number, number] = [226, 232, 240];    // Slate 200
    const lightBg: [number, number, number] = [248, 250, 252];        // Slate 50

    // Helper per verificare e aggiungere nuova pagina se lo spazio residuo è insufficiente
    const checkAddPage = (neededSpaceMm: number) => {
      if (currentY + neededSpaceMm > pageHeight - 22) {
        doc.addPage();
        currentY = margin + 8; // 28mm: spazio di sicurezza sotto la testatina di pagina 2+ (che sta a 14.5mm)
      }
    };

    // Helper per disegnare titoli di sezione con barra verticale ciano
    const drawSectionHeader = (title: string) => {
      checkAddPage(25);
      currentY += 4;
      // Barra verticale ciano
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(margin, currentY, 1.8, 6.5, 'F');

      // Testo del titolo
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(title, margin + 5, currentY + 5.2);
      currentY += 11;
    };

    // ==========================================
    // PAGINA 1: TESTATA ISTITUZIONALE & METADATI
    // ==========================================

    // Dati Societari Hi-Tech (Colonna Sinistra)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('HI-TECH', margin, currentY + 5);
    doc.setFontSize(9);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('SVILUPPO SOFTWARE & CLOUD', margin + 28, currentY + 4.8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('HI-TECH srls', margin, currentY + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('Cda Marinara 3 dx 12', margin, currentY + 17);
    doc.text('74017 Mottola (TA) - Italia', margin, currentY + 21);
    doc.text('Tel: +39 3456425468 | +39 3512135403', margin, currentY + 25);
    doc.text('Email: infoammhitech@gmail.com', margin, currentY + 29);

    // Box Metadati Preventivo (Colonna Destra)
    const metaX = 125;
    const metaValX = 148;
    const formatFormattedDate = (isoStr: string) => {
      try {
        const d = new Date(isoStr);
        return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
      } catch {
        return isoStr;
      }
    };

    const quoteDate = quote.date ? formatFormattedDate(quote.date) : formatFormattedDate(new Date().toISOString());
    const recipient = quote.client.company 
      ? `${quote.client.company} (${quote.client.name})` 
      : quote.client.name;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Data:', metaX, currentY + 12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(quoteDate, metaValX, currentY + 12);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Validità:', metaX, currentY + 17);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`${quote.validityDays || 30} giorni`, metaValX, currentY + 17);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Oggetto:', metaX, currentY + 22);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    const splitSubject = doc.splitTextToSize(quote.subject || 'Proposta Commerciale', 42);
    doc.text(splitSubject, metaValX, currentY + 22);

    const destY = currentY + 22 + (splitSubject.length * 4.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Destinatario:', metaX, destY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    const splitDest = doc.splitTextToSize(recipient, 42);
    doc.text(splitDest, metaValX, destY);

    currentY = Math.max(currentY + 34, destY + (splitDest.length * 4.5) + 6);

    // Linea divisoria orizzontale leggera
    doc.setDrawColor(lightBorder[0], lightBorder[1], lightBorder[2]);
    doc.setLineWidth(0.4);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 12;

    // Titolo Centrale Proposta Commerciale
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('PROPOSTA COMMERCIALE & PREVENTIVO', pageWidth / 2, currentY, { align: 'center' });
    currentY += 12;

    // ==========================================
    // SEZIONE 1: PREMESSA E OBIETTIVI
    // ==========================================
    drawSectionHeader('1. Premessa e Obiettivi del Progetto');

    if (quote.premiseIntro) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      const introLines = doc.splitTextToSize(quote.premiseIntro, contentWidth);
      doc.text(introLines, margin, currentY);
      currentY += (introLines.length * 5) + 4;
    }

    if (quote.currentProblems && quote.currentProblems.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.2);
      quote.currentProblems.forEach(prob => {
        checkAddPage(12);
        // Punto elenco personalizzato
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.circle(margin + 2, currentY - 1, 1, 'F');

        const probLines = doc.splitTextToSize(prob, contentWidth - 7);
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.text(probLines, margin + 6, currentY);
        currentY += (probLines.length * 4.8) + 2.5;
      });
      currentY += 3;
    }

    // Box Soluzione Proposta
    if (quote.solutionTitle || quote.solutionDescription) {
      checkAddPage(35);
      const solTitle = quote.solutionTitle || 'LA SOLUZIONE PROPOSTA';
      const solDesc = quote.solutionDescription || '';
      const descLines = doc.splitTextToSize(solDesc, contentWidth - 12);
      const boxHeight = 12 + (descLines.length * 4.5);

      // Sfondo e bordo del box
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.setDrawColor(lightBorder[0], lightBorder[1], lightBorder[2]);
      doc.roundedRect(margin, currentY, contentWidth, boxHeight, 2, 2, 'FD');

      // Bordo laterale sinistro accent
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(margin, currentY, 2, boxHeight, 'F');

      // Titolo della Soluzione
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(solTitle.toUpperCase(), margin + 6, currentY + 6.5);

      // Descrizione
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.8);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(descLines, margin + 6, currentY + 12);

      currentY += boxHeight + 8;
    }

    // ==========================================
    // SEZIONE 2: DETTAGLIO FUNZIONALITÀ (SCOPE)
    // ==========================================
    drawSectionHeader('2. Dettaglio delle Funzionalità (Scope of Work)');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.2);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    const scopeIntro = `La soluzione si articola in ${quote.modules.length} moduli operativi integrati, progettati per garantire massima efficienza, usabilità e controllo dei processi:`;
    const scopeIntroLines = doc.splitTextToSize(scopeIntro, contentWidth);
    doc.text(scopeIntroLines, margin, currentY);
    currentY += (scopeIntroLines.length * 4.8) + 4;

    quote.modules.forEach(mod => {
      checkAddPage(22);
      currentY += 2;
      // Intestazione Modulo
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(mod.title, margin, currentY);
      currentY += 6;

      // Elenco feature del modulo
      mod.features.forEach(feat => {
        // Calcola in anticipo le righe della descrizione per calcolare l'altezza esatta
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.6);
        const descLines = doc.splitTextToSize(feat.description, contentWidth - 8);
        const totalBlockHeight = 4.5 + (descLines.length * 4.3) + 3.5;

        // Verifica lo spazio considerando l'ALTEZZA REALE del blocco feature
        checkAddPage(totalBlockHeight);

        // 1. Disegna checkmark vettoriale perfetto in Ciano (evita caratteri unicode non supportati)
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setLineWidth(0.55);
        doc.line(margin + 1, currentY - 1.2, margin + 2.3, currentY);
        doc.line(margin + 2.3, currentY, margin + 4.5, currentY - 3.2);

        // 2. Titolo Feature in Grassetto (stampato una sola volta!)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.text(`${feat.title}:`, margin + 6, currentY);
        currentY += 4.5;

        // 3. Descrizione Feature in font normale indentata
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.6);
        doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
        doc.text(descLines, margin + 6, currentY);

        currentY += (descLines.length * 4.3) + 2.5;
      });
      currentY += 3;
    });

    // ==========================================
    // SEZIONE 3: TECNOLOGIA E INFRASTRUTTURA
    // ==========================================
    drawSectionHeader('3. Tecnologia, Sicurezza e Costi di Infrastruttura');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.2);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('La piattaforma sarà realizzata secondo i massimi standard dell\'ingegneria software moderna:', margin, currentY);
    currentY += 7;

    const techItems = [
      { label: 'Frontend', text: quote.techStack.frontend },
      { label: 'Database & Cloud', text: quote.techStack.backendAndDb },
      { label: 'Hosting e Rete', text: quote.techStack.hosting },
      { label: 'Costi di Mantenimento', text: quote.techStack.maintenanceCosts }
    ];

    techItems.forEach(item => {
      const fullText = `${item.label}: ${item.text}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.8);
      const lines = doc.splitTextToSize(fullText, contentWidth - 8);
      const itemHeight = (lines.length * 4.6) + 3.5;
      checkAddPage(itemHeight);

      doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.circle(margin + 2, currentY - 1, 1, 'F');

      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(lines, margin + 6, currentY);

      currentY += itemHeight;
    });
    currentY += 4;

    // ==========================================
    // SEZIONE 4: PIANIFICAZIONE E TEMPI (TABELLA)
    // ==========================================
    drawSectionHeader('4. Pianificazione e Tempi di Consegna');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.2);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Il progetto verrà sviluppato in modalità Agile, con rilasci incrementali settimanali per consentire il collaudo costante:', margin, currentY);
    currentY += 6;

    const phaseTableData = quote.phases.map(p => [
      p.phase,
      p.description
    ]);

    checkAddPage(40);
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['FASE / TEMPISTICA', 'DETTAGLIO ATTIVITÀ E RILASCI']],
      body: phaseTableData,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59], // Dark slate
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5,
        cellPadding: 3.5
      },
      bodyStyles: {
        textColor: [30, 41, 59],
        fontSize: 8.2,
        cellPadding: 3.5,
        lineColor: [226, 232, 240]
      },
      columnStyles: {
        0: { cellWidth: 42, fontStyle: 'bold' },
        1: { cellWidth: 'auto' }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;

    // ==========================================
    // SEZIONE 5: VALORE ECONOMICO E PAGAMENTI
    // ==========================================
    drawSectionHeader('5. Investimento Economico e Modalità di Pagamento');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.2);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    const priceIntro = `L'investimento economico per la progettazione, lo sviluppo, il collaudo e la messa in produzione della soluzione è quantificato in:`;
    doc.text(priceIntro, margin, currentY);
    currentY += 8;

    // BANNER SCURO VALORE INVESTIMENTO
    checkAddPage(32);
    const bannerHeight = 24;
    doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
    doc.roundedRect(margin, currentY, contentWidth, bannerHeight, 3, 3, 'F');

    // Bordo interno ciano futuristico
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin + 1, currentY + 1, contentWidth - 2, bannerHeight - 2, 2.5, 2.5, 'D');

    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text("VALORE DELL'INVESTIMENTO", pageWidth / 2, currentY + 7.5, { align: 'center' });

    // Importo Formattato
    const formattedPriceNet = quote.priceNet.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.setTextColor(255, 255, 255);
    doc.text(`€ ${formattedPriceNet} + IVA`, pageWidth / 2, currentY + 17, { align: 'center' });

    currentY += bannerHeight + 9;

    // Dettaglio Modalità di Pagamento (Milestone)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Modalità di Pagamento (Suddivisa per milestone di avanzamento):', margin, currentY);
    currentY += 6;

    quote.milestones.forEach((m) => {
      checkAddPage(18);
      const mAmount = (quote.priceNet * (m.percentage / 100)).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.setDrawColor(lightBorder[0], lightBorder[1], lightBorder[2]);
      doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, 'FD');

      // Titolo milestone e descrizione a sinistra
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.8);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(m.title, margin + 4, currentY + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.text(m.description, margin + 4, currentY + 10.5);

      // Importo milestone a destra
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(`€ ${mAmount} + IVA`, pageWidth - margin - 4, currentY + 8.5, { align: 'right' });

      currentY += 17;
    });

    currentY += 3;

    // ==========================================
    // SEZIONE 6: SERVIZI INCLUSI ED ESCLUSIONI
    // ==========================================
    drawSectionHeader('6. Servizi Inclusi ed Esclusioni');

    // Cosa è incluso
    checkAddPage(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Cosa è incluso nel preventivo:', margin, currentY);
    currentY += 5.5;

    quote.inclusions.forEach(inc => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const lines = doc.splitTextToSize(inc, contentWidth - 8);
      const itemHeight = (lines.length * 4.4) + 3;
      checkAddPage(itemHeight);

      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.circle(margin + 2, currentY - 1, 1, 'F');

      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(lines, margin + 6, currentY);
      currentY += itemHeight;
    });
    currentY += 4;

    // Cosa è escluso
    checkAddPage(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Cosa è escluso:', margin, currentY);
    currentY += 5.5;

    quote.exclusions.forEach(exc => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const lines = doc.splitTextToSize(exc, contentWidth - 8);
      const itemHeight = (lines.length * 4.4) + 3;
      checkAddPage(itemHeight);

      doc.setFillColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.circle(margin + 2, currentY - 1, 1, 'F');

      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(lines, margin + 6, currentY);
      currentY += itemHeight;
    });
    currentY += 12;

    // ==========================================
    // AREA FIRME DI ACCETTAZIONE
    // ==========================================
    checkAddPage(32);
    const sigY = currentY + 12;
    const colWidth = (contentWidth - 20) / 2;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('PER ACCETTAZIONE DELLA PROPOSTA', margin + 5, sigY);
    doc.text('PER LA SOCIETÀ SVILUPPATRICE', margin + colWidth + 25, sigY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(`La Proprietà di ${recipient}`, margin + 5, sigY + 8);
    doc.text('Il Responsabile del Progetto', margin + colWidth + 25, sigY + 8);

    doc.setDrawColor(lightBorder[0], lightBorder[1], lightBorder[2]);
    doc.setLineWidth(0.4);
    doc.line(margin + 5, sigY + 18, margin + colWidth - 5, sigY + 18);
    doc.line(margin + colWidth + 25, sigY + 18, pageWidth - margin - 5, sigY + 18);

    // ==========================================
    // INTESTAZIONE E PIÈ DI PAGINA PER OGNI PAGINA
    // ==========================================
    const totalPages = doc.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);

      // Sulla prima pagina l'header è già completo; sulle pagine 2+ mostriamo una testatina pulita
      if (i > 1) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
        doc.text(`Preventivo ${quote.subject} - ${recipient}`, margin, 12);
        doc.setFont('helvetica', 'bold');
        doc.text('HI-TECH srls', pageWidth - margin, 12, { align: 'right' });

        doc.setDrawColor(lightBorder[0], lightBorder[1], lightBorder[2]);
        doc.setLineWidth(0.3);
        doc.line(margin, 14.5, pageWidth - margin, 14.5);
      }

      // Piè di pagina istituzionale (su tutte le pagine)
      const footerY = pageHeight - 12;
      doc.setDrawColor(lightBorder[0], lightBorder[1], lightBorder[2]);
      doc.setLineWidth(0.3);
      doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.text('HI-TECH srls | Proposta Commerciale', margin, footerY + 1.5);
      doc.text(`Pagina ${i} di ${totalPages}`, pageWidth - margin, footerY + 1.5, { align: 'right' });
    }

    return doc;
  }
}
