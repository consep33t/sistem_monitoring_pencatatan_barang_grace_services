import React from "react";

const InvoiceContent = React.forwardRef((props, ref) => {
  const { data } = props;
  const total = data.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div
      ref={ref}
      className="print-invoice mx-auto bg-white text-black rounded text-sm"
    >
      <style jsx global>{`
        @media print {
          @page {
            size: 58mm 210mm; /* Explicitly set page size */
            margin: 0; /* Remove any default printer margins */
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 58mm !important;
          }
          .print-invoice {
            width: 100% !important; /* Use full width of the body */
            margin: 0 !important; /* Remove margin */
            padding: 0 2mm !important; /* Control spacing with padding */
            font-size: 8px !important; /* Slightly larger font for readability */
            font-family: "Courier New", Courier, monospace; /* Use a monospaced font */
            border: none !important;
            box-sizing: border-box;
          }
          .print-invoice h2,
          .print-invoice p {
            text-align: center;
            margin: 2mm 0;
          }
          .print-invoice .invoice-details p {
            text-align: left;
            margin: 0.5mm 0;
          }
          .print-invoice table {
            width: 100% !important;
            font-size: 8px !important;
            border-collapse: collapse;
          }
          .print-invoice th,
          .print-invoice td {
            padding: 1mm 0 !important;
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
            word-wrap: break-word;
            text-align: left;
          }
          .print-invoice .qty {
            text-align: center;
          }
          .print-invoice .price {
            text-align: right;
          }
          .print-invoice .total-row td {
            font-weight: bold;
            border-top: 1px solid #000;
          }
        }
      `}</style>
      <h2 className="text-xl font-bold mb-2">INVOICE</h2>
      <div className="invoice-details">
        <p>No Invoice: {data.invoiceNumber}</p>
        <p>Tanggal: {data.date}</p>
        <p>Nama: {data.customerName}</p>
      </div>

      <table className="w-full mt-4">
        <thead>
          <tr>
            <th>Item</th>
            <th className="qty">Qty</th>
            <th className="price">Harga</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td className="qty">{item.quantity}</td>
              <td className="price">{item.price.toLocaleString()}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan="2" className="price">
              Total
            </td>
            <td className="price">{total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-4 text-center">Terima kasih atas belanja Anda!</p>
    </div>
  );
});

InvoiceContent.displayName = "InvoiceContent";
export default InvoiceContent;
