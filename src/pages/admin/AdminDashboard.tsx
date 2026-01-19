import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import LogoutIcon from "@mui/icons-material/Logout";

export default function AdminDashboard() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/", { replace: true });
    };

    return (
        <Box sx={{ width: "100%" }}>
            {/* HEADER cu gradient + verset + logout */}
            <Box
                sx={{
                    background: "linear-gradient(90deg, #05224d 0%, #0b3a6f 45%, #2a79d7 100%)",
                    color: "white",
                    borderBottom: "1px solid rgba(255,255,255,0.12)",
                }}
            >
                <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2}>
                        <Box sx={{ maxWidth: 900 }}>
                            <Typography
                                sx={{
                                    fontFamily: '"Raleway", Helvetica, sans-serif',
                                    fontWeight: 900,
                                    textTransform: "uppercase",
                                    letterSpacing: 0.6,
                                    fontSize: { xs: 18, sm: 20, md: 24 },
                                    opacity: 0.95,
                                }}
                            >
                                Panou Admin
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 2,
                                    fontFamily: "'Georgia', serif",
                                    fontSize: { xs: 16, sm: 18, md: 20 },
                                    lineHeight: 1.8,
                                    opacity: 0.95,
                                }}
                            >
                                „Din El, prin El și pentru El sunt toate lucrurile. A Lui să fie slava în veci! Amin!”
                            </Typography>

                            <Typography sx={{ mt: 1, opacity: 0.9, fontWeight: 700 }}>
                                — Romani 11:36
                            </Typography>
                        </Box>

                        {/* Logout dreapta */}
                        <Button
                            onClick={handleLogout}
                            startIcon={<LogoutIcon />}
                            variant="contained"
                            sx={{
                                alignSelf: "flex-start",
                                borderRadius: 3,
                                px: 2.4,
                                py: 1.1,
                                textTransform: "uppercase",
                                fontWeight: 900,

                                background: "white",
                                color: "#0b3a6f",

                                boxShadow: "0 6px 16px rgba(0,0,0,0.15)",

                                "&:hover": {
                                    background: "linear-gradient(90deg, #0b3a6f, #2a79d7)",
                                    color: "white",
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                                },
                            }}
                        >
                            Logout
                        </Button>

                    </Stack>
                </Container>
            </Box>

            {/* CONTINUT: 2 optiuni mari */}
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
                <Typography
                    sx={{
                        fontFamily: '"Raleway", Helvetica, sans-serif',
                        fontWeight: 900,
                        textTransform: "uppercase",
                        fontSize: { xs: 18, md: 20 },
                        mb: 2,
                        color: "#0b3a6f",
                    }}
                >
                    Alege o secțiune
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                        gap: { xs: 2, md: 3 },
                    }}
                >
                    {/* Administrare */}
                    <Card
                        onClick={() => navigate("/admin/panel?tab=admin")}
                        role="button"
                        tabIndex={0}
                        sx={{
                            cursor: "pointer",
                            borderRadius: 3,
                            border: "1px solid rgba(11,58,111,0.12)",
                            background: "linear-gradient(135deg, #ffffff 0%, #f3f8ff 100%)",
                            boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
                            transition: "transform .25s ease, box-shadow .25s ease",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 16px 30px rgba(0,0,0,0.10)",
                            },
                            "&:active": {
                                transform: "translateY(-2px)",
                            },
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                                <Box
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: "50%",
                                        display: "grid",
                                        placeItems: "center",
                                        background: "linear-gradient(45deg, #0b3a6f, #2a79d7)",
                                        color: "white",
                                    }}
                                >
                                    <SettingsSuggestIcon />
                                </Box>
                                <Typography
                                    sx={{
                                        fontFamily: '"Raleway", Helvetica, sans-serif',
                                        fontWeight: 900,
                                        textTransform: "uppercase",
                                        fontSize: { xs: 18, md: 20 },
                                        color: "#0b3a6f",
                                    }}
                                >
                                    Administrare
                                </Typography>
                            </Stack>

                            <Typography sx={{ opacity: 0.85, lineHeight: 1.8 }}>
                                Gestionează postări, aprobă/refuză nevoi, marchează nevoi rezolvate și trimite newsletter.
                            </Typography>

                            <Typography sx={{ mt: 1.5, fontWeight: 800, color: "#2a79d7" }}>
                                Intră în Administrare →
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Statistici */}
                    <Card
                        onClick={() => navigate("/admin/panel?tab=stats")}
                        role="button"
                        tabIndex={0}
                        sx={{
                            cursor: "pointer",
                            borderRadius: 3,
                            border: "1px solid rgba(11,58,111,0.12)",
                            background: "linear-gradient(135deg, #ffffff 0%, #eef6ff 100%)",
                            boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
                            transition: "transform .25s ease, box-shadow .25s ease",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 16px 30px rgba(0,0,0,0.10)",
                            },
                            "&:active": {
                                transform: "translateY(-2px)",
                            },
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                                <Box
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: "50%",
                                        display: "grid",
                                        placeItems: "center",
                                        background: "linear-gradient(45deg, #2a79d7, #65b6ff)",
                                        color: "white",
                                    }}
                                >
                                    <QueryStatsIcon />
                                </Box>
                                <Typography
                                    sx={{
                                        fontFamily: '"Raleway", Helvetica, sans-serif',
                                        fontWeight: 900,
                                        textTransform: "uppercase",
                                        fontSize: { xs: 18, md: 20 },
                                        color: "#0b3a6f",
                                    }}
                                >
                                    Statistici
                                </Typography>
                            </Stack>

                            <Typography sx={{ opacity: 0.85, lineHeight: 1.8 }}>
                                Vezi grafice și rapoarte pe perioade: postări, vizionări, nevoi acceptate/refuzate/rezolvate.
                            </Typography>

                            <Typography sx={{ mt: 1.5, fontWeight: 800, color: "#2a79d7" }}>
                                Intră în Statistici →
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
}
