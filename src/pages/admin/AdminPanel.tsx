import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import ArticleIcon from "@mui/icons-material/Article";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function AdminPanel() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ pb: 6 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin")}
          sx={{ color: "white", borderColor: "rgba(255,255,255,0.25)" }}
          variant="outlined"
        >
          Înapoi
        </Button>
        <Typography sx={{ color: "white", fontWeight: 900, fontSize: { xs: 18, md: 24 } }}>
          Administrare
        </Typography>
      </Stack>

      <Box
        sx={{
          borderRadius: 4,
          p: { xs: 2, md: 3 },
          bgcolor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          <Card sx={{ borderRadius: 4, bgcolor: "rgba(255,255,255,0.92)" }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <ArticleIcon />
                <Typography sx={{ fontWeight: 900, textTransform: "uppercase" }}>Gestionare postări</Typography>
              </Stack>
              <Typography sx={{ opacity: 0.8, mb: 2 }}>
                Adaugă / editează / șterge postări pentru toate categoriile.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/admin/administrare/postari")}
                sx={{ borderRadius: 999, fontWeight: 900, textTransform: "uppercase" }}
              >
                Intră
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4, bgcolor: "rgba(255,255,255,0.92)" }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <FavoriteIcon />
                <Typography sx={{ fontWeight: 900, textTransform: "uppercase" }}>Gestionare nevoi</Typography>
              </Stack>
              <Typography sx={{ opacity: 0.8, mb: 2 }}>
                Acceptă / refuză / marchează nevoi ca rezolvate.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/admin/administrare/nevoi")}
                sx={{
                  borderRadius: 999,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  background: "linear-gradient(90deg, #ff4d6d 0%, #ff8fab 100%)",
                  "&:hover": { background: "linear-gradient(90deg, #ff1f4a 0%, #ff7aa2 100%)" },
                }}
              >
                Intră
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4, bgcolor: "rgba(255,255,255,0.92)" }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <MarkEmailReadIcon />
                <Typography sx={{ fontWeight: 900, textTransform: "uppercase" }}>Newsletter</Typography>
              </Stack>
              <Typography sx={{ opacity: 0.8, mb: 2 }}>
                Trimite newsletter către abonați la newsletter.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/admin/administrare/newsletter")}
                sx={{
                  borderRadius: 999,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  background: "linear-gradient(90deg, #15b91e 0%, #008080 100%)",
                  "&:hover": { background: "linear-gradient(90deg, #43fc4c 0%, #20b2aa 100%)" },
                }}
              >
                Intră
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
