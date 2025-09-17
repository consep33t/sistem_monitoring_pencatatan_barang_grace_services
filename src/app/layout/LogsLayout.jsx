"use client";
import React from "react";
import TableLogs from "../components/table/TableLogs";

const LogsLayout = ({ logs }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 mt-8">Daftar Logs Pembelian</h1>
      <TableLogs logs={logs} />
    </div>
  );
};

export default LogsLayout;
