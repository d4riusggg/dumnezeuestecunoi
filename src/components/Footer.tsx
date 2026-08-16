import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import SvgIcon from "@mui/material/SvgIcon";

// ⚠️ Link-ul către worker-ul tău de pe Cloudflare
const WORKER_URL = "https://nameless-bonus-c608.d4riusfncollab.workers.dev";

function TikTokIcon(props: any) {
  return (
    <SvgIcon {...props} viewBox="0 0 256 256">
      <path
        d="M112 0h34c2 25 14 46 36 59 9 5 20 8 31 8v34c-15 1-29-3-42-10v83a82 82 0 1 1-59-79v35a46 46 0 1 0 25 42V0Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default function Footer() {
  const [nume, setNume] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = React.useState<"success" | "error" | "info">("success");
  const [saving, setSaving] = React.useState(false);

  const handleNewsletterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const cleanNume = nume.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanNume) {
      setMessageType("error");
      setMessage("Introdu numele tău.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setMessageType("error");
      setMessage("Introdu o adresă de email validă.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`${WORKER_URL}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nume: cleanNume, email: cleanEmail }),
      });

      if (!res.ok) {
        throw new Error("Nu am putut salva emailul. Încearcă din nou.");
      }

      const data = await res.json();

      if (data.alreadySubscribed) {
        setMessageType("info");
        setMessage("Această adresă este deja abonată la newsletter.");
        return;
      }

      setNume("");
      setEmail("");
      setMessageType("success");
      setMessage("Te-ai abonat cu succes la newsletter. Mulțumim!");
    } catch (error: any) {
      setMessageType("error");
      setMessage(error.message || "Nu am putut salva emailul. Încearcă din nou.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 4,
        color: "white",
        background: "linear-gradient(180deg, #0b3a6f 0%, #082c54 100%)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={2.5} alignItems="center" textAlign="center">
          <Typography
            variant="subtitle1"
            sx={{
              opacity: 0.95,
              fontFamily: '"Raleway", Helvetica, sans-serif',
              textTransform: "uppercase",
            }}
          >
            Dumnezeu este cu noi — Matei 1:23
          </Typography>

          <Box
            component="form"
            onSubmit={handleNewsletterSubmit}
            sx={{
              width: "100%",
              maxWidth: 720,
              textAlign: "left",
              bgcolor: "#fdfaf3",
              color: "#1a1a1a",
              borderRadius: 3,
              border: "1px solid rgba(0,0,0,0.08)",
              p: { xs: 2.5, md: 3 },
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <EmailIcon sx={{ fontSize: 22 }} />
              <Typography
                sx={{
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                  fontFamily: '"Raleway", Helvetica, sans-serif',
                  fontSize: { xs: 16, md: 18 },
                }}
              >
                Abonează-te la newsletter
              </Typography>
            </Stack>

            <Divider sx={{ mt: 1.5, mb: 2, borderColor: "rgba(0,0,0,0.1)" }} />

            <Typography sx={{ opacity: 0.75, mb: 2, fontSize: 14.5 }}>
              Primește noutăți, îndemnuri, rugăciuni și proiecte de slujire direct pe e-mail. Fără spam. Te poți dezabona oricând.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                fullWidth
                size="small"
                type="text"
                value={nume}
                onChange={(event) => setNume(event.target.value)}
                placeholder="Numele tău"
                disabled={saving}
                sx={{
                  bgcolor: "white",
                  borderRadius: 1,
                  "& .MuiInputBase-input": { color: "#071a33" },
                }}
              />

              <TextField
                fullWidth
                size="small"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Adresa de e-mail"
                disabled={saving}
                sx={{
                  bgcolor: "white",
                  borderRadius: 1,
                  "& .MuiInputBase-input": { color: "#071a33" },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                sx={{
                  whiteSpace: "nowrap",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  px: 3,
                  bgcolor: "#0b3a6f",
                  color: "white",
                  "&:hover": { bgcolor: "#082c54" },
                }}
              >
                {saving ? "Se salvează..." : "Abonează-mă"}
              </Button>
            </Stack>

            <Typography sx={{ mt: 1.5, fontSize: 12.5, opacity: 0.6 }}>
              Prin abonare ești de acord cu prelucrarea datelor conform politicii de confidențialitate.
            </Typography>

            {message && (
              <Alert severity={messageType} sx={{ mt: 1.5, textAlign: "left" }}>
                {message}
              </Alert>
            )}
          </Box>

          <Stack direction="row" spacing={1.5}>
            {[
              {
                icon: <FacebookIcon fontSize="inherit" />,
                url: "https://www.facebook.com/dumnezeuestecunoi.2025/",
                hover: "linear-gradient(45deg, #1877F2, #00aaff)",
              },
              {
                icon: <YouTubeIcon fontSize="inherit" />,
                url: "https://www.youtube.com/@DumnezeuEsteCuNoi-z8",
                hover: "linear-gradient(45deg, #FF0000, #cc0000)",
              },
              {
                icon: <InstagramIcon fontSize="inherit" />,
                url: "https://www.instagram.com/dumnezeuestecunoi/",
                hover: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
              },
              {
                icon: <EmailIcon fontSize="inherit" />,
                url: "mailto:dumnezeuestecunoi@uetcompany.ro",
                hover: "linear-gradient(45deg, #00c6ff, #0072ff)",
              },
            ].map(({ icon, url, hover }, index) => (
              <IconButton
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  width: 40,
                  height: 40,
                  color: "white",
                  fontSize: 24,
                  "&:hover": { background: hover, color: "white" },
                }}
              >
                {icon}
              </IconButton>
            ))}

            <IconButton
              aria-label="TikTok"
              href="https://www.tiktok.com/@dumnezeuestecunoi25"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                width: 40,
                height: 40,
                color: "white",
                fontSize: 24,
                "&:hover": {
                  background: "linear-gradient(45deg, #25F4EE, #FE2C55)",
                  color: "white",
                },
              }}
            >
              <TikTokIcon fontSize="inherit" />
            </IconButton>
          </Stack>

          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            © 2025 cu sprijinul{" "}
            <a
              href="https://uetcompany.ro"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "white", textDecoration: "underline" }}
            >
              UET Company
            </a>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}