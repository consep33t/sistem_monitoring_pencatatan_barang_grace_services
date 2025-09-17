"use client";

import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

export default function CartPanel({ user }) {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [now, setNow] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [extraDiscount, setExtraDiscount] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [paymentMethods] = useState([
    { id: 1, name: "cash" },
    { id: 2, name: "card" },
    { id: 3, name: "transfer" },
    { id: 4, name: "ewallet" },
  ]);

  const [additionalCosts, setAdditionalCosts] = useState([
    { name: "", cost: "" },
  ]);

  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );
  const discountItemTotal = cartItems.reduce(
    (sum, item) => sum + (item.diskon ? item.diskon * item.qty : 0),
    0
  );
  const discountTotal = discountItemTotal + (parseFloat(extraDiscount) || 0);
  const addCostTotal = additionalCosts.reduce((sum, ac) => {
    const cost = parseFloat(ac.cost);
    return sum + (isNaN(cost) ? 0 : cost);
  }, 0);
  const total = subTotal - discountTotal + addCostTotal;

  useEffect(() => {
    const date = new Date();
    setNow(date.toLocaleString("id-ID"));
  }, []);

  const handlePrint = async () => {
    if (cartItems.length === 0) return alert("Keranjang masih kosong");
    if (!paymentMethod) return alert("Pilih metode pembayaran");
    if (!customerName || !customerPhone)
      return alert("Isi nama & telepon customer");
    if (!user) return alert("User login tidak ditemukan");

    setIsPrinting(true);

    const invoiceNo = `INV${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`;

    const payload = {
      invoice_no: invoiceNo,
      customer: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
      },
      employee_id: user.id,
      sub_total: subTotal,
      discount_total: discountTotal,
      grand_total: total,
      paid: total,
      payment_method: parseInt(paymentMethod),
      notes: note,
      items: cartItems.map((item) => ({
        item_type: item.type || "product",
        item_id: item.id,
        qty: item.qty,
        unit_price: item.price,
        total: item.qty * item.price - (item.diskon || 0) * item.qty,
      })),
      additional_costs: additionalCosts
        .filter((ac) => ac.name && parseFloat(ac.cost) > 0)
        .map((ac) => ({
          name: ac.name,
          cost: parseFloat(ac.cost),
        })),
    };

    try {
      const res = await fetch("/api/sales/with-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal simpan data");

      const printJS = (await import("print-js")).default;

      // --- RAW HTML GENERATION FOR PRINTING ---
      const generatePrintHTML = () => {
        const itemsHTML = cartItems
          .map(
            (item) => `
          <tr>
            <td style="width: 50%; text-align: left; padding: 1mm 0; vertical-align: top; word-break: break-all;">${
              item.name
            }</td>
            <td style="width: 15%; text-align: center; padding: 1mm 0; vertical-align: top;">${
              item.qty
            }</td>
            <td style="width: 35%; text-align: right; padding: 1mm 0; vertical-align: top;">${(
              item.price * item.qty -
              (item.diskon || 0) * item.qty
            ).toLocaleString("id-ID")}</td>
          </tr>
        `
          )
          .join("");

        const selectedPaymentMethod = paymentMethods.find(
          (pm) => pm.id === parseInt(paymentMethod)
        )?.name;

        const additionalCostsHTML = additionalCosts
          .filter((ac) => ac.name && parseFloat(ac.cost) > 0)
          .map(
            (ac) => `
          <tr>
            <td colspan="2" style="text-align: right; padding: 0.5mm 0;">${
              ac.name
            }:</td>
            <td style="text-align: right; padding: 0.5mm 0;">${parseFloat(
              ac.cost
            ).toLocaleString("id-ID")}</td>
          </tr>
        `
          )
          .join("");

        const extraDiscountValue = parseFloat(extraDiscount);
        const extraDiscountHTML =
          extraDiscountValue > 0
            ? `
          <tr>
            <td colspan="2" style="text-align: right; padding: 0.5mm 0;">Diskon:</td>
            <td style="text-align: right; padding: 0.5mm 0;">-${extraDiscountValue.toLocaleString(
              "id-ID"
            )}</td>
          </tr>
        `
            : "";

        const noteHTML = note
          ? `
          <tr><td colspan="3" style="border-top: 1px dashed black; padding: 1mm 0;"></td></tr>
          <tr><td colspan="3" style="text-align: left; padding: 0.5mm 0; font-weight: semi-bold;">Catatan:</td></tr>
          <tr><td colspan="3" style="text-align: left; padding: 0.5mm 0; word-break: break-all;">${note}</td></tr>
        `
          : "";

        const html = `
          <div style="width: 48mm; box-sizing: border-box; padding: 0 1mm; font-family: sans-serif; font-size: 10px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                <tr><td colspan="3" style="text-align: center; padding: 1mm 0; font-size: 12px; font-weight: bold;">Grace services</td></tr>
                <tr><td colspan="3" style="text-align: center; font-weight: semi-bold; padding-bottom: 1mm;">${now}</td></tr>
                <tr><td colspan="3" style="padding: 0.5mm 0; font-weight: semi-bold;">No: ${invoiceNo}</td></tr>
                <tr><td colspan="3" style="padding: 0.5mm 0; font-weight: semi-bold;">Customer: ${customerName}</td></tr>
                <tr><td colspan="3" style="padding: 0.5mm 0; font-weight: semi-bold;">Metode Pembayaran: ${selectedPaymentMethod}</td></tr>
                <tr><td colspan="3" style="border-top: 1px dashed black; padding: 1mm 0;"></td></tr>
                <tr>
                  <th style="width: 50%; text-align: left; font-weight: semi-bold; padding-bottom: 1mm;">Item</th>
                  <th style="width: 15%; text-align: center; font-weight: semi-bold; padding-bottom: 1mm;">Qty</th>
                  <th style="width: 35%; text-align: right; font-weight: semi-bold; padding-bottom: 1mm;">Subtotal</th>
                </tr>
                ${itemsHTML}
                <tr><td colspan="3" style="border-top: 1px dashed black; padding: 1mm 0;"></td></tr>
                ${additionalCostsHTML}
                ${extraDiscountHTML}
                <tr>
                  <td colspan="2" style="text-align: right; font-weight: bold; padding: 0.5mm 0;">Total:</td>
                  <td style="text-align: right; font-weight: bold; padding: 0.5mm 0;">${total.toLocaleString(
                    "id-ID"
                  )}</td>
                </tr>
                ${noteHTML}
                <tr><td colspan="3" style="border-top: 1px dashed black; padding: 1mm 0;"></td></tr>
                <tr><td colspan="3" style="text-align: center; padding-top: 1mm;">Terima kasih!</td></tr>
              </tbody>
            </table>
          </div>
        `;
        return html;
      };

      const printableHTML = generatePrintHTML();

      printJS({
        printable: printableHTML,
        type: "raw-html",
        style: "@page { size: 58mm 210mm; margin: 0; } body { margin: 0; }",
      });
      // --- END OF RAW HTML GENERATION ---

      clearCart();
      setNote("");
      setPaymentMethod("");
      setExtraDiscount("");
      setAdditionalCosts([{ name: "", cost: "" }]);
      setCustomerName("");
      setCustomerPhone("");
    } catch (err) {
      alert("Gagal simpan data: " + err.message);
    } finally {
      setIsPrinting(false);
    }
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
                  (item.diskon || 0) * item.qty
                ).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="text-right font-semibold text-sm">
        Total: Rp{total.toLocaleString()}
      </p>

      {/* Customer Info */}
      <div className="mt-3">
        <label className="block text-xs mb-1">Nama Customer:</label>
        <input
          type="text"
          className="border rounded text-xs p-1 w-full"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Nama customer"
        />
      </div>
      <div className="mt-2">
        <label className="block text-xs mb-1">Nomor HP Customer:</label>
        <input
          type="text"
          className="border rounded text-xs p-1 w-full"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="08xxxxxxxxxx"
        />
      </div>

      {/* Catatan */}
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

      {/* Payment Method */}
      <div className="mt-3">
        <label className="block text-xs mb-1">Metode Pembayaran:</label>
        <select
          className="border rounded w-full text-xs p-1"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="">Pilih metode</option>
          {paymentMethods.map((pm) => (
            <option key={pm.id} value={pm.id}>
              {pm.name}
            </option>
          ))}
        </select>
      </div>

      {/* Biaya Tambahan */}
      <div className="mt-3">
        <label className="block text-xs mb-1">Biaya Tambahan (opsional):</label>
        {additionalCosts.map((ac, index) => (
          <div key={index} className="flex items-center mb-1 gap-2">
            <input
              type="text"
              className="border rounded text-xs p-1 w-1/2"
              placeholder="Nama biaya"
              value={ac.name}
              onChange={(e) => {
                const updated = [...additionalCosts];
                updated[index].name = e.target.value;
                setAdditionalCosts(updated);
              }}
            />
            <input
              type="number"
              min="0"
              className="border rounded text-xs p-1 w-1/2"
              placeholder="Rp"
              value={ac.cost}
              onChange={(e) => {
                const updated = [...additionalCosts];
                updated[index].cost = e.target.value;
                setAdditionalCosts(updated);
              }}
            />
          </div>
        ))}

        <button
          onClick={() =>
            setAdditionalCosts([...additionalCosts, { name: "", cost: "" }])
          }
          className="text-xs text-blue-600 underline mt-1"
        >
          + Tambah Biaya Tambahan
        </button>
        <button
          onClick={() => setAdditionalCosts([{ name: "", cost: "" }])}
          className="text-xs text-red-600 underline mt-1"
        >
          Hapus Semua Biaya Tambahan
        </button>
      </div>

      {/* Diskon Tambahan */}
      <div className="mt-3">
        <label className="block text-xs mb-1">
          Diskon Tambahan (opsional):
        </label>
        <input
          type="number"
          min="0"
          className="border rounded text-xs p-1 w-full"
          placeholder="Rp"
          value={extraDiscount}
          onChange={(e) => setExtraDiscount(e.target.value)}
        />
      </div>

      {/* Tombol */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => {
            clearCart();
            setNote("");
            setPaymentMethod("");
            setExtraDiscount("");
            setAdditionalCosts([{ name: "", cost: "" }]);
          }}
          className="text-red-600 text-sm underline"
        >
          Kosongkan
        </button>
        <button
          onClick={handlePrint}
          disabled={isPrinting}
          className="bg-black text-white px-3 py-1 rounded text-sm"
        >
          {isPrinting ? "Memproses..." : "Cetak"}
        </button>
      </div>

      {/* The hidden print area is no longer used for printing */}
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
        {/* Content can be removed or kept for debugging */}
      </div>
    </div>
  );
}
