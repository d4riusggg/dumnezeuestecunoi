import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function NeedsManager() {
  return (
    <Container maxWidth="lg" sx={{ pb: 6 }}>
      <Typography sx={{ color: "white", fontWeight: 900, fontSize: { xs: 18, md: 24 }, mb: 2 }}>
        Gestionare nevoi
      </Typography>

      <Box sx={{ bgcolor: "rgba(255,255,255,0.92)", p: 2, borderRadius: 4 }}>
        Aici punem lista de nevoi trimise de utilizatori + Acceptă / Refuză / Rezolvat.
      </Box>
    </Container>
  );
}
