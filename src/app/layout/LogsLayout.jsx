"use client";
import React, { useEffect, useState } from "react";
import TableLogs from "../components/table/TableLogs";

const LogsLayout = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/products/stok/logs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch logs");
        }
        return response.json();
      })
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading logs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold my-4">Daftar Logs Pembelian</h1>
      <TableLogs logs={logs} />
    </div>
  );
};

export default LogsLayout;
