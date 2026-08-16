import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// ⚠️ Link-ul către worker-ul tău de pe Cloudflare
const WORKER_URL = "https://nameless-bonus-c608.d4riusfncollab.workers.dev";

// ⚠️ ÎNLOCUIEȘTE cu parola pe care ai pus-o la secretul ADMIN_TOKEN în Cloudflare
const ADMIN_TOKEN = "parola2026!";

type Subscriber = {
  nume: string;
  email: string;
  subscribedAt: string;
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("ro-RO");
  } catch {
    return iso;
  }
}

export default function NewsletterManager() {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyEmail, setBusyEmail] = useState<string | null>(null);

  const incarcaAbonati = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${WORKER_URL}/newsletter`, {
        headers: { "x-admin-token": ADMIN_TOKEN },
      });

      if (!res.ok) {
        throw new Error(
          res.status === 401
            ? "Token de admin greșit. Verifică ADMIN_TOKEN din cod."
            : `Eroare server (${res.status}).`
        );
      }

      const data = await res.json();
      setSubscribers(data.abonati || []);
    } catch (e: any) {
      setError(e.message || "Nu s-au putut încărca abonații.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    incarcaAbonati();
  }, []);

  const deleteSubscriber = async (subscriber: Subscriber) => {
    const confirmed = window.confirm(`Ștergi emailul ${subscriber.email} din newsletter?`);
    if (!confirmed) return;

    setBusyEmail(subscriber.email);
    try {
      const res = await fetch(`${WORKER_URL}/newsletter/${encodeURIComponent(subscriber.email)}`, {
        method: "DELETE",
        headers: { "x-admin-token": ADMIN_TOKEN },
      });

      if (!res.ok) throw new Error("Nu s-a putut șterge abonatul.");

      setSubscribers((prev) => prev.filter((s) => s.email !== subscriber.email));
    } catch (e: any) {
      setError(e.message || "Eroare la ștergere.");
    } finally {
      setBusyEmail(null);
    }
  };

  const copiazaToateEmailurile = () => {
    navigator.clipboard.writeText(subscribers.map((item) => item.email).join(", "));
  };

  const copiazaListaCompleta = () => {
    const text = subscribers
      .map((item) => `${item.nume || "Fără nume"} <${item.email}>`)
      .join("\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <Container maxWidth="lg" sx={{ pb: 6 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/administrare")}
          variant="outlined"
          sx={{ color: "white", borderColor: "rgba(255,255,255,0.4)" }}
        >
          Înapoi
        </Button>
        <EmailIcon sx={{ color: "white" }} />
        <Typography sx={{ color: "white", fontWeight: 900, fontSize: { xs: 18, md: 24 } }}>
          Newsletter
        </Typography>
      </Stack>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: "white" }} />
        </Box>
      )}

      {!loading && (
        <Card sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Typography sx={{ fontWeight: 900, fontSize: 20 }}>
              Abonați ({subscribers.length})
            </Typography>

            <Typography sx={{ opacity: 0.7, mt: 0.5, mb: 2 }}>
              Aici apar automat numele și emailurile introduse de utilizatori pe site.
            </Typography>

            {error && (
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography color="error">{error}</Typography>
                <Button variant="outlined" onClick={incarcaAbonati} sx={{ alignSelf: "flex-start" }}>
                  Reîncearcă
                </Button>
              </Stack>
            )}

            {subscribers.length === 0 && !error && (
              <Box sx={{ py: 3, textAlign: "center", opacity: 0.7 }}>
                Încă nu există abonați la newsletter.
              </Box>
            )}

            <Stack spacing={1}>
              {subscribers.map((subscriber, index) => (
                <Box key={subscriber.email}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 800, overflowWrap: "anywhere" }}>
                        {subscriber.nume || "Fără nume"}
                      </Typography>

                      <Typography sx={{ overflowWrap: "anywhere", opacity: 0.85 }}>
                        {subscriber.email}
                      </Typography>

                      <Typography sx={{ fontSize: 13, opacity: 0.65 }}>
                        Abonat: {formatDate(subscriber.subscribedAt)}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={0.5}>
                      <IconButton
                        color="primary"
                        aria-label="Trimite email"
                        href={`mailto:${subscriber.email}`}
                      >
                        <EmailIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        aria-label="Șterge abonatul"
                        disabled={busyEmail === subscriber.email}
                        onClick={() => deleteSubscriber(subscriber)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Stack>

                  {index < subscribers.length - 1 && <Divider sx={{ mt: 1 }} />}
                </Box>
              ))}
            </Stack>

            {subscribers.length > 0 && (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
                <Button variant="outlined" onClick={copiazaToateEmailurile}>
                  Copiază doar emailurile
                </Button>
                <Button variant="outlined" onClick={copiazaListaCompleta}>
                  Copiază Nume + Email
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}