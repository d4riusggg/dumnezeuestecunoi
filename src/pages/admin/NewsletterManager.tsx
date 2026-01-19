import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function NewsletterManager() {
  return (
    <Container maxWidth="lg" sx={{ pb: 6 }}>
      <Typography sx={{ color: "white", fontWeight: 900, fontSize: { xs: 18, md: 24 }, mb: 2 }}>
        Newsletter
      </Typography>

      <Box sx={{ bgcolor: "rgba(255,255,255,0.92)", p: 2, borderRadius: 4 }}>
        Aici facem UI pentru newsletter + (mai târziu) trimitere cu Firebase Functions / provider.
      </Box>
    </Container>
  );
}
