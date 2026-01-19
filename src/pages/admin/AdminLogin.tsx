import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation() as any;

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) navigate("/admin/home", { replace: true });
    });
    return () => unsub();
  }, [navigate]);


  const handleLogin = async () => {
    setErr(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);

      // dacă a încercat să intre direct pe o pagină admin, îl ducem acolo
      const from = location?.state?.from as string | undefined;
      navigate(from && from.startsWith("/admin/") ? from : "/admin/home", { replace: true });
    } catch (e: any) {
      setErr(e?.message || "Eroare la autentificare.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Card sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 900, mb: 2, textTransform: "uppercase" }}>
            Admin Login
          </Typography>

          <Stack spacing={2}>
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Parolă" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />

            {err && (
              <Typography sx={{ color: "error.main", fontSize: 14 }}>
                {err}
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={handleLogin}
              disabled={loading}
              sx={{ fontWeight: 900, borderRadius: 999, textTransform: "uppercase" }}
            >
              Intră
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
