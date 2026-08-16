import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteIcon from "@mui/icons-material/Delete";

// ⚠️ Link-ul către worker-ul tău de pe Cloudflare
const WORKER_URL = "https://nameless-bonus-c608.d4riusfncollab.workers.dev";

// ⚠️ ÎNLOCUIEȘTE cu parola pe care ai pus-o la secretul ADMIN_TOKEN în Cloudflare
const ADMIN_TOKEN = "parola2026!";

type Status = "in_asteptare" | "acceptata" | "refuzata" | "rezolvata";

type Nevoie = {
  id: string;
  nume: string;
  descriere: string;
  contact?: string;
  status: Status;
  createdAt: string;
  updatedAt?: string;
};

const STATUS_LABEL: Record<Status, { label: string; color: "default" | "success" | "error" | "info" }> = {
  in_asteptare: { label: "În așteptare", color: "default" },
  acceptata: { label: "Acceptată", color: "info" },
  refuzata: { label: "Refuzată", color: "error" },
  rezolvata: { label: "Rezolvată", color: "success" },
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("ro-RO");
  } catch {
    return iso;
  }
}

export default function NeedsManager() {
  const navigate = useNavigate();

  const [nevoi, setNevoi] = useState<Nevoie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const incarcaNevoi = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${WORKER_URL}/nevoi`, {
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
      setNevoi(data.nevoi || []);
    } catch (e: any) {
      setError(e.message || "Nu s-au putut încărca nevoile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    incarcaNevoi();
  }, []);

  const schimbaStatus = async (id: string, status: Status) => {
    setBusyId(id);
    try {
      const res = await fetch(`${WORKER_URL}/nevoi/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": ADMIN_TOKEN,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Nu s-a putut actualiza statusul.");

      const data = await res.json();
      setNevoi((prev) => prev.map((n) => (n.id === id ? data.nevoie : n)));
    } catch (e: any) {
      setError(e.message || "Eroare la actualizare.");
    } finally {
      setBusyId(null);
    }
  };

  const stergeNevoie = async (id: string) => {
    const confirmat = window.confirm("Ștergi definitiv această nevoie?");
    if (!confirmat) return;

    setBusyId(id);
    try {
      const res = await fetch(`${WORKER_URL}/nevoi/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": ADMIN_TOKEN },
      });

      if (!res.ok) throw new Error("Nu s-a putut șterge nevoia.");

      setNevoi((prev) => prev.filter((n) => n.id !== id));
    } catch (e: any) {
      setError(e.message || "Eroare la ștergere.");
    } finally {
      setBusyId(null);
    }
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
        <Typography sx={{ color: "white", fontWeight: 900, fontSize: { xs: 18, md: 24 } }}>
          Gestionare nevoi
        </Typography>
      </Stack>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: "white" }} />
        </Box>
      )}

      {!loading && error && (
        <Card sx={{ borderRadius: 4, mb: 2 }}>
          <CardContent>
            <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>
            <Button variant="outlined" onClick={incarcaNevoi}>Reîncearcă</Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <Card sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Typography sx={{ fontWeight: 900, fontSize: 20, mb: 2 }}>
              Nevoi trimise ({nevoi.length})
            </Typography>

            {nevoi.length === 0 ? (
              <Box sx={{ py: 3, textAlign: "center", opacity: 0.7 }}>
                Nu există nevoi trimise încă.
              </Box>
            ) : (
              <Stack spacing={2}>
                {nevoi.map((nevoie, index) => (
                  <Box key={nevoie.id}>
                    <Stack spacing={1}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={1}
                      >
                        <Typography sx={{ fontWeight: 800 }}>{nevoie.nume}</Typography>
                        <Chip
                          size="small"
                          label={STATUS_LABEL[nevoie.status].label}
                          color={STATUS_LABEL[nevoie.status].color}
                        />
                      </Stack>

                      <Typography sx={{ opacity: 0.85 }}>{nevoie.descriere}</Typography>

                      {nevoie.contact && (
                        <Typography sx={{ fontSize: 13, opacity: 0.7 }}>
                          Contact: {nevoie.contact}
                        </Typography>
                      )}

                      <Typography sx={{ fontSize: 12, opacity: 0.6 }}>
                        Trimisă: {formatDate(nevoie.createdAt)}
                      </Typography>

                      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          color="info"
                          disabled={busyId === nevoie.id}
                          startIcon={<CheckCircleIcon />}
                          onClick={() => schimbaStatus(nevoie.id, "acceptata")}
                        >
                          Acceptă
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          disabled={busyId === nevoie.id}
                          startIcon={<CancelIcon />}
                          onClick={() => schimbaStatus(nevoie.id, "refuzata")}
                        >
                          Refuză
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          disabled={busyId === nevoie.id}
                          startIcon={<DoneAllIcon />}
                          onClick={() => schimbaStatus(nevoie.id, "rezolvata")}
                        >
                          Rezolvat
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          disabled={busyId === nevoie.id}
                          startIcon={<DeleteIcon />}
                          onClick={() => stergeNevoie(nevoie.id)}
                        >
                          Șterge
                        </Button>
                      </Stack>
                    </Stack>

                    {index < nevoi.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}