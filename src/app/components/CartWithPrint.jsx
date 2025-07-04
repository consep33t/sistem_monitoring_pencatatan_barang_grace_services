"use client";

import React, { useState } from "react";
import printJS from "print-js";

// Contoh data produk
const productList = [
  { id: 1, name: "Beras 5kg", price: 60000 },
  { id: 2, name: "Minyak Goreng 2L", price: 30000 },
  { id: 3, name: "Gula Pasir 1kg", price: 15000 },
  { id: 4, name: "Teh Celup", price: 10000 },
];

export default function CartWithPrint() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  const handlePrint = () => {
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
          font-size: 11px;
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
          padding: 2px 0;
        }
      `,
    });
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Produk</h2>
      <div className="space-y-2">
        {productList.map((product) => (
          <div key={product.id} className="flex justify-between border-b py-2">
            <div>
              {product.name} <br />
              <span className="text-sm text-gray-500">
                Rp{product.price.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => addToCart(product)}
              className="text-sm bg-green-600 text-white px-2 py-1 rounded"
            >
              + Keranjang
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold">Keranjang</h2>
      {cart.length === 0 ? (
        <p>Belum ada item</p>
      ) : (
        <div>
          <ul className="mb-4">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                {item.name} x{item.qty} = Rp
                {(item.qty * item.price).toLocaleString()}
              </li>
            ))}
          </ul>

          <p className="font-semibold">Total: Rp{total.toLocaleString()}</p>

          <button
            onClick={handlePrint}
            className="mt-4 px-4 py-2 bg-black text-white rounded"
          >
            Cetak Struk 58mm
          </button>
        </div>
      )}

      {/* AREA YANG DI-PRINT */}
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
          <div className="center">{new Date().toLocaleString()}</div>
          <div className="divider"></div>
          <table>
            <tbody>
              {cart.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td className="center">x{item.qty}</td>
                  <td className="right">Rp{item.price.toLocaleString()}</td>
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
