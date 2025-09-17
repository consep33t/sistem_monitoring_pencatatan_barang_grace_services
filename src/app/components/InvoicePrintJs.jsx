"use client";

import React from "react";

export default function InvoicePrint58mm({ invoiceData }) {
  const handlePrint = async () => {
    // Ensure invoiceData and items exist before proceeding
    if (!invoiceData || !invoiceData.items) {
      console.error("Invoice data is missing or invalid.");
      return;
    }

    const printJS = (await import("print-js")).default;

    // Dynamically generate a clean HTML string for printing
    const generatePrintHTML = (data) => {
      const total = data.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );

      const itemsHTML = data.items
        .map(
          (item) => `
        <tr>
          <td style="text-align: left; padding: 1mm 0;">${item.name}</td>
          <td style="text-align: center; padding: 1mm 0;">${
            item.quantity
          }</td>
          <td style="text-align: right; padding: 1mm 0;">${item.price.toLocaleString()}</td>
        </tr>
      `
        )
        .join("");

      // Using a template literal to build the HTML string.
      // This is often more reliable for printers than styling a React component.
      const html = `
        <div style="width: 58mm; box-sizing: border-box; padding: 0 1mm; font-family: 'Courier New', monospace; font-size: 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr><td colspan="3" style="text-align: center; padding: 2mm 0; font-size: 10px; font-weight: bold;">INVOICE</td></tr>
              <tr><td colspan="3" style="padding: 0.5mm 0;">No Invoice: ${
                data.invoiceNumber
              }</td></tr>
              <tr><td colspan="3" style="padding: 0.5mm 0;">Tanggal: ${
                data.date
              }</td></tr>
              <tr><td colspan="3" style="padding: 0.5mm 0;">Nama: ${
                data.customerName
              }</td></tr>
              <tr><td colspan="3" style="border-top: 1px dashed black; padding: 1mm 0;"></td></tr>
              <tr>
                <th style="text-align: left; padding-bottom: 1mm;">Item</th>
                <th style="text-align: center; padding-bottom: 1mm;">Qty</th>
                <th style="text-align: right; padding-bottom: 1mm;">Harga</th>
              </tr>
              ${itemsHTML}
              <tr><td colspan="3" style="border-top: 1px dashed black; padding: 1mm 0;"></td></tr>
              <tr>
                <td colspan="2" style="text-align: right; font-weight: bold; padding: 1mm 0;">Total:</td>
                <td style="text-align: right; font-weight: bold; padding: 1mm 0;">${total.toLocaleString()}</td>
              </tr>
              <tr><td colspan="3" style="border-top: 1px dashed black; padding: 1mm 0;"></td></tr>
              <tr><td colspan="3" style="text-align: center; padding-top: 2mm;">Terima kasih!</td></tr>
            </tbody>
          </table>
        </div>
      `;
      return html;
    };

    const printableHTML = generatePrintHTML(invoiceData);

    printJS({
      printable: printableHTML,
      type: "raw-html",
      // Using a regular string for style to avoid any template literal issues.
      style: "@page { size: 58mm 210mm; margin: 0; } body { margin: 0; }",
    });
  };

  return (
    <div className="p-4">
      <button
        onClick={handlePrint}
        className="mb-4 px-4 py-2 bg-black text-white rounded no-print"
      >
        Cetak Struk 58mm
      </button>

      {/* This hidden div is no longer used for printing but can be kept for screen display if needed */}
      <div
        id="invoice-screen-area"
        style={{
          visibility: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        {/* You can still render InvoiceContent here for other purposes if you want */}
      </div>
    </div>
  );
}
