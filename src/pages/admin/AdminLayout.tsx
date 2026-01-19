import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import AdminGuard from "./AdminGuard";
import AdminTopBar from "./AdminTopBar";

export default function AdminLayout() {
  return (
    <AdminGuard>
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#071a33" }}>
        <AdminTopBar />
        <Box sx={{ flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </AdminGuard>
  );
}
