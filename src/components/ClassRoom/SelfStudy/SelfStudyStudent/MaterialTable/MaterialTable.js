import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "First name",
    width: 150,
    editable: true,
  },
  {
    field: "email",
    headerName: "Email",
    width: 150,
    editable: true,
  },
];

export default function MaterialTable({ users }) {
  const navigate = useNavigate();
  const handleNavigation = (id) => {
    navigate("users/" + id);
  };
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={users}
        columns={columns.map((column) => ({
          ...column,
          renderCell: (params) => (
            <div
              onClick={() => handleNavigation(params.row.id)}
              style={{ cursor: "pointer" }}
            >
              {params.value}
            </div>
          ),
        }))}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
