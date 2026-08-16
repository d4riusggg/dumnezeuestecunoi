import * as React from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Alert from "@mui/material/Alert";
import FavoriteIcon from "@mui/icons-material/Favorite";

// ⚠️ Link-ul către worker-ul tău de pe Cloudflare
const WORKER_URL = "https://nameless-bonus-c608.d4riusfncollab.workers.dev";

export default function Needs() {
  const [nume, setNume] = React.useState("");
  const [descriere, setDescriere] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = React.useState<"success" | "error">("success");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!nume.trim() || !descriere.trim()) {
      setMessageType("error");
      setMessage("Te rugăm completează numele și descrierea nevoii.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`${WORKER_URL}/nevoi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nume: nume.trim(),
          descriere: descriere.trim(),
          contact: contact.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Nu am putut trimite nevoia. Încearcă din nou.");
      }

      setNume("");
      setDescriere("");
      setContact("");
      setMessageType("success");
      setMessage("Nevoia ta a fost trimisă. Mulțumim, va fi analizată în curând!");
    } catch (e: any) {
      setMessageType("error");
      setMessage(e.message || "A apărut o eroare. Încearcă din nou.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 }, flex: 1 }}>
      <Stack spacing={1} alignItems="center" textAlign="center" sx={{ mb: 3 }}>
        <FavoriteIcon sx={{ color: "red", fontSize: 40 }} />
        <Typography
          sx={{
            fontFamily: '"Raleway", Helvetica, sans-serif',
            fontWeight: 900,
            textTransform: "uppercase",
            fontSize: { xs: 22, md: 28 },
          }}
        >
          Ai o nevoie? Spune-ne!
        </Typography>
        <Typography sx={{ opacity: 0.75, maxWidth: 480 }}>
          Completează formularul de mai jos și cererea ta va ajunge direct la echipa noastră.
        </Typography>
      </Stack>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Numele tău"
                value={nume}
                onChange={(e) => setNume(e.target.value)}
                disabled={saving}
                fullWidth
                required
              />

              <TextField
                label="Descrie nevoia"
                value={descriere}
                onChange={(e) => setDescriere(e.target.value)}
                disabled={saving}
                fullWidth
                required
                multiline
                minRows={4}
              />

              <TextField
                label="Contact (telefon sau email, opțional)"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                disabled={saving}
                fullWidth
              />

              {message && <Alert severity={messageType}>{message}</Alert>}

              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                sx={{
                  fontWeight: 900,
                  borderRadius: 999,
                  textTransform: "uppercase",
                  py: 1.2,
                  background: "linear-gradient(90deg, #ff4d6d 0%, #ff8fab 100%)",
                  "&:hover": { background: "linear-gradient(90deg, #ff1f4a 0%, #ff7aa2 100%)" },
                }}
              >
                {saving ? "Se trimite..." : "Trimite nevoia"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}