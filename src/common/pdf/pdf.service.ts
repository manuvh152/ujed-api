import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {

  async pdfTest(): Promise<Buffer>{
    
    const pdfBuffer: Buffer = await new Promise( resolve => {
      
      const doc = new PDFDocument(
        {
          size: 'LETTER',
          bufferPages: true,
          autoFirstPage: true
        }
      );

      
      let pageNumber = 0;
      doc.on('pageAdded', () => {
        pageNumber++;

        
      });

      doc.text('ARRIBA LAS CHIVAS');
      doc.moveDown();
      doc.text('PDF GENERADO POR LAS CHIVAS ARRIBA LAS CHIVAS');

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
      doc.end();

    });


    return pdfBuffer;

  }

}
