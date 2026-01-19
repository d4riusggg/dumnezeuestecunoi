import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

export default function AdminTopBar() {
  const handleLogout = async () => {
    await signOut(auth);
    // AdminGuard te va trimite automat la /
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
      <Button
        onClick={handleLogout}
        variant="contained"
        startIcon={<LogoutIcon />}
        sx={{
          bgcolor: "white",
          color: "#0b3a6f",
          fontWeight: 800,
          borderRadius: 999,
          "&:hover": { bgcolor: "#0b3a6f", color: "white" },
        }}
      >
        Logout
      </Button>
    </Box>
  );
}
