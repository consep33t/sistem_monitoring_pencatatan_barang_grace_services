const TableLogs = ({ logs }) => {
  return (
    <div className="overflow-x-auto rounded-box border border-black-content/5">
      <table className="table">
        <thead>
          <tr className="text-black">
            <th>No</th>
            <th>Product Name</th>
            <th>Movement Type</th>
            <th>Ref Table</th>
            <th>Ref ID</th>
            <th>Quantity</th>
            <th>Cost</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((item, idx) => (
            <tr className="hover:bg-gray-400" key={item.id}>
              <th>{idx + 1}</th>
              <td>{item.product_name}</td>
              <td>{item.movement_type}</td>
              <td>{item.ref_table}</td>
              <td>{item.ref_id ?? "-"}</td>
              <td>{item.qty}</td>
              <td>{item.cost ?? "-"}</td>
              <td>{new Date(item.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableLogs;
