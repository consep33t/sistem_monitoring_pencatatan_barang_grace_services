"use client";

import React from "react";

export default function InvoicePrint58mm() {
  const handlePrint = async () => {
    const printJS = (await import("print-js")).default;

    printJS({
      printable: "invoice-print-area",
      type: "html",
      style: `
        * {
          font-family: monospace;
          box-sizing: border-box;
        }
        body, html {
          margin: 0;
          padding: 0;
        }
        .invoice {
          width: 58mm;
          padding: 5px;
          font-size: 5px;
        }
        .invoice h2 {
          text-align: center;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .invoice .center {
          text-align: center;
        }
        .invoice .right {
          text-align: right;
        }
        .invoice .bold {
          font-weight: bold;
        }
        .invoice .divider {
          border-top: 1px dashed black;
          margin: 6px 0;
        }
        .invoice table {
          width: 100%;
          border-collapse: collapse;
        }
        .invoice td {
          padding: 2px;
        }

        @media print {
          body {
            width: 58mm;
          }
        }
      `,
    });
  };

  const items = [
    { name: "Beras 5kg", qty: 1, price: 60000 },
    { name: "Minyak Goreng 2L", qty: 2, price: 30000 },
    { name: "Gula Pasir 1kg", qty: 1, price: 15000 },
    { name: "Sabun Cuci", qty: 3, price: 6000 },
    { name: "Teh Celup", qty: 2, price: 10000 },
    { name: "Tissue Gulung", qty: 4, price: 7500 },
    { name: "Kopi Instan", qty: 1, price: 20000 },
    { name: "Susu Bubuk", qty: 2, price: 25000 },
    { name: "Mie Instan", qty: 5, price: 3000 },
    { name: "Biskuit", qty: 1, price: 15000 },
  ];

  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div className="p-4">
      <button
        onClick={handlePrint}
        className="mb-4 px-4 py-2 bg-black text-white rounded"
      >
        Cetak Struk 58mm
      </button>

      <div
        id="invoice-print-area"
        style={{
          visibility: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <div className="invoice">
          <h2>TOKO MAJU JAYA</h2>
          <div className="center">Jl. Contoh No.123</div>
          <div className="center">19-06-2025 14:23</div>
          <div className="divider"></div>
          <table>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td className="center">x{item.qty}</td>
                  <td className="right">Rp.{item.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="divider"></div>
          <table>
            <tbody>
              <tr>
                <td className="bold">TOTAL</td>
                <td></td>
                <td className="right bold">Rp{total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <div className="divider"></div>
          <div className="center">Terima kasih!</div>
        </div>
      </div>
    </div>
  );
}
