"use client";
import { useCart } from "../context/CartContext";
import { useEffect, useState, useRef } from "react";

export default function CartPanel() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [now, setNow] = useState("");
  const [note, setNote] = useState(""); // Catatan
  const printRef = useRef(null);

  // Hitung total dengan diskon
  const total = cartItems.reduce(
    (sum, item) =>
      sum + item.qty * item.price - (item.diskon ? item.diskon : 0) * item.qty,
    0
  );

  useEffect(() => {
    const date = new Date();
    const formatted = date.toLocaleString("id-ID");
    setNow(formatted);
  }, []);

  const handlePrint = async () => {
    const printJS = (await import("print-js")).default;

    printJS({
      printable: "invoice-print-area",
      type: "html",
      style: `
        /* ...style tetap... */
        .invoice th, .invoice td {
          padding: 2px 0;
          font-size: 10px;
        }
        .invoice .item-row td {
          border-bottom: 1px dotted #ccc;
        }
        .invoice .total-row td {
          font-weight: bold;
          font-size: 11px;
        }
        .invoice .footer {
          margin-top: 5px;
          text-align: center;
          font-size: 5px;
          letter-spacing: 0.5px;
        }
      `,
    });
  };

  return (
    <div className="bg-white p-4 w-full">
      <h2 className="text-lg font-bold mb-2">Keranjang</h2>
      {cartItems.length === 0 ? (
        <p className="text-sm text-gray-500">Keranjang kosong</p>
      ) : (
        <ul className="mb-2">
          {cartItems.map((item) => (
            <li key={item.id} className="text-sm mb-1 flex justify-between">
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 underline"
              >
                hapus
              </button>
              <span>
                {item.name} x{item.qty}
                {item.diskon ? (
                  <span className="ml-1 text-blue-600">
                    (Diskon: Rp{item.diskon.toLocaleString()}/item)
                  </span>
                ) : null}
              </span>
              <span>
                Rp
                {(
                  item.price * item.qty -
                  (item.diskon ? item.diskon : 0) * item.qty
                ).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-right font-semibold text-sm">
        Total: Rp{total.toLocaleString()}
      </p>
      <div className="flex gap-2 mt-2">
        <button onClick={clearCart} className="text-red-600 text-sm underline">
          Kosongkan
        </button>
        <button
          onClick={handlePrint}
          className="bg-black text-white px-3 py-1 rounded text-sm"
        >
          Cetak
        </button>
      </div>

      {/* Input Catatan */}
      <div className="mt-3">
        <label className="block text-xs mb-1">Catatan:</label>
        <textarea
          className="border rounded w-full text-xs p-1"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Tulis catatan di sini..."
        />
      </div>

      {/* AREA CETAK */}
      <div
        id="invoice-print-area"
        ref={printRef}
        style={{
          visibility: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <div
          className="invoice mx-auto"
          style={{
            width: "219px",
            minHeight: "fit-content",
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: "5px",
            padding: "0",
            background: "#fff",
            wordBreak: "break-word",
          }}
        >
          <h2
            className="text-center font-bold mb-1"
            style={{ fontSize: "5px", letterSpacing: "1px" }}
          >
            TOKO MAJU JAYA
          </h2>
          <div className="center mb-1" style={{ fontSize: "5px" }}>
            Jl. Contoh No.123
          </div>
          <div className="center mb-1" style={{ fontSize: "5px" }}>
            {now}
          </div>
          <div className="divider"></div>
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left", width: "70px" }}>Barang</th>
                <th style={{ textAlign: "center", width: "25px" }}>Qty</th>
                <th style={{ textAlign: "right", width: "40px" }}>Diskon</th>
                <th style={{ textAlign: "right", width: "50px" }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, i) => (
                <tr key={i} className="item-row">
                  <td style={{ wordBreak: "break-word" }}>{item.name}</td>
                  <td style={{ textAlign: "center" }}>x{item.qty}</td>
                  <td style={{ textAlign: "right" }}>
                    {item.diskon ? `Rp${item.diskon.toLocaleString()}` : "-"}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    Rp
                    {(
                      item.price * item.qty -
                      (item.diskon ? item.diskon : 0) * item.qty
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="divider"></div>
          <table>
            <tbody>
              <tr className="total-row">
                <td colSpan={3}>TOTAL</td>
                <td style={{ textAlign: "right" }}>
                  Rp{total.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="divider"></div>
          {/* Tampilkan catatan jika ada */}
          {note && (
            <div
              className="mb-1"
              style={{
                fontSize: "7px",
                marginBottom: "2px",
                wordBreak: "break-word",
              }}
            >
              <b>Catatan:</b> {note}
            </div>
          )}
          <div className="footer">
            <div>Terima kasih atas kunjungan Anda!</div>
            <div>Barang yang sudah dibeli tidak dapat dikembalikan.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
