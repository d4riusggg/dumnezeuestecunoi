import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BarChartIcon from "@mui/icons-material/BarChart";

export default function AdminHome() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ pb: 6 }}>
      {/* HERO */}
      <Box
        sx={{
          borderRadius: 4,
          p: { xs: 3, md: 4 },
          background: "linear-gradient(90deg, #0b3a6f 0%, #2a7de1 100%)",
          color: "white",
          boxShadow: "0 10px 26px rgba(0,0,0,0.25)",
          mb: 3,
        }}
      >
        <Typography sx={{ fontWeight: 900, fontSize: { xs: 18, md: 22 }, mb: 1 }}>
          Romani 11:36
        </Typography>
        <Typography sx={{ opacity: 0.95, lineHeight: 1.7, fontSize: { xs: 14.5, md: 16 } }}>
          „Din El, prin El și pentru El sunt toate lucrurile. A Lui să fie slava în veci! Amin!”
        </Typography>
      </Box>

      {/* PANOU 1 */}
      <Box
        sx={{
          borderRadius: 4,
          p: { xs: 2, md: 3 },
          bgcolor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <Typography sx={{ color: "white", fontWeight: 900, mb: 2, fontSize: { xs: 18, md: 22 } }}>
          Panou Admin
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 2,
          }}
        >
          <Card
            sx={{
              borderRadius: 4,
              bgcolor: "rgba(255,255,255,0.92)",
              transition: "transform .25s ease, box-shadow .25s ease",
              "&:hover": { transform: "translateY(-4px)", boxShadow: "0 14px 28px rgba(0,0,0,0.25)" },
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <AdminPanelSettingsIcon />
                <Typography sx={{ fontWeight: 900, textTransform: "uppercase" }}>
                  Administrare
                </Typography>
              </Stack>
              <Typography sx={{ opacity: 0.8, mb: 2 }}>
                Gestionează postări, nevoi și newsletter.
              </Typography>

              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/admin/administrare")}
                sx={{
                  borderRadius: 999,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  background: "linear-gradient(90deg, #15b91e 0%, #008080 100%)",
                  "&:hover": { background: "linear-gradient(90deg, #43fc4c 0%, #20b2aa 100%)" },
                }}
              >
                Intră în Administrare
              </Button>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 4,
              bgcolor: "rgba(255,255,255,0.92)",
              transition: "transform .25s ease, box-shadow .25s ease",
              "&:hover": { transform: "translateY(-4px)", boxShadow: "0 14px 28px rgba(0,0,0,0.25)" },
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <BarChartIcon />
                <Typography sx={{ fontWeight: 900, textTransform: "uppercase" }}>
                  Statistici
                </Typography>
              </Stack>
              <Typography sx={{ opacity: 0.8, mb: 2 }}>
                Grafice: postări, vizualizări, nevoi, perioade.
              </Typography>

              <Button
                fullWidth
                variant="outlined"
                sx={{ borderRadius: 999, fontWeight: 900, textTransform: "uppercase" }}
                onClick={() => alert("Statistici – facem după ce terminăm Administrarea.")}
              >
                Vezi statistici
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
