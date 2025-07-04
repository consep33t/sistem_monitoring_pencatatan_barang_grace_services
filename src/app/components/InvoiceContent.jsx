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
      className="p-6 max-w-md mx-auto bg-white text-black border rounded text-sm"
    >
      <h2 className="text-xl font-bold mb-2">INVOICE</h2>
      <p>No Invoice: {data.invoiceNumber}</p>
      <p>Tanggal: {data.date}</p>
      <p>Nama: {data.customerName}</p>

      <table className="w-full mt-4 border border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left">Item</th>
            <th className="border px-2 py-1">Qty</th>
            <th className="border px-2 py-1 text-right">Harga</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index}>
              <td className="border px-2 py-1">{item.name}</td>
              <td className="border px-2 py-1 text-center">{item.quantity}</td>
              <td className="border px-2 py-1 text-right">
                Rp {item.price.toLocaleString()}
              </td>
            </tr>
          ))}
          <tr className="font-bold">
            <td colSpan={2} className="border px-2 py-1 text-right">
              Total
            </td>
            <td className="border px-2 py-1 text-right">
              Rp {total.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
      <p className="mt-4 text-center">Terima kasih atas belanja Anda!</p>
    </div>
  );
});

InvoiceContent.displayName = "InvoiceContent";
export default InvoiceContent;
