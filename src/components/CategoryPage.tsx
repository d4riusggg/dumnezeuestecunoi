import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

type Post = {
  id: string;
  title: string;
  date: string;     // ISO
  image?: string;   // opțional (thumb/mock)
  excerpt: string;
  content: string;
  youtubeId?: string;
};

type CategoryPageProps = {
  slug: "invatare" | "rugaciune" | "cantare" | "predicare" | "marturie";
  title: string;
  verse: string;
  reference: string;
  image: string;            // imaginea din HEADER
  headerGradient: string;   // gradient în header
  accent: string;           // culoare pt. butoane selectate etc.
};

const PER_PAGE = 5;
const youTube = (id: string) =>
  `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;

export default function CategoryPage({
  slug,
  title,
  verse,
  reference,
  image,
  headerGradient,
  accent,
}: CategoryPageProps) {
  const [page, setPage] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Post | null>(null);

  // --------- MOCK POSTS (poți modifica/înlocui ulterior) ---------
  const mock: Record<string, Post[]> = {
    invatare: [
      { id: "i1", title: "Cum să citești Biblia zilnic", date: "2025-01-15", image: "/caleata.png", excerpt: "Sfaturi practice pentru obicei constant de studiu biblic.", content: "Începe cu un plan realist (10-15 minute), alege o traducere clară și notează ce înțelegi. Roagă-te la început și la final." }
    ],
    rugaciune: [
      { id: "r1", title: "Rugăciunea dimineața", date: "2025-01-05", excerpt: "Începe ziua cu pace.", content: "Mulțumire, mărturisire, cerere, încredere." }
    ],
    cantare: [
      { id: "c1", title: "O cântare nouă", date: "2025-01-12", excerpt: "Psalmii ne inspiră.", content: "Concentrează-te pe adevăruri biblice clare." }
    ],
    predicare: [
      { id: "p1", title: "Predică simplu și clar", date: "2025-01-22", excerpt: "Mesaj accesibil.", content: "Idee principală, texte, aplicații practice." }
    ],
    marturie: [
      { id: "m1", title: "Mărturia personală", date: "2025-01-30", excerpt: "Spune ce a făcut Domnul.", content: "Fii onest, scurt, centrat pe Hristos." }
    ],
  };

  const posts = (mock[slug] || []).sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );

  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const visible = posts.slice(start, start + PER_PAGE);

  const openPost = (p: Post) => { setSelected(p); setOpen(true); };
  const closePost = () => { setOpen(false); setSelected(null); };
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <Box>
      {/* HEADER: gradient + IMAGINE SUS lângă verset */}
      <Box
        sx={{
          background: headerGradient,
          borderRadius: 3,
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
          overflow: "hidden",
          mb: { xs: 3, md: 4 },
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 3.5 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "7fr 5fr" },
              gap: { xs: 2, md: 3 },
              alignItems: "center",
            }}
          >
            {/* Text (titlu + verset) */}
            <Box>
              <Stack spacing={1.25}>
                <Typography
                  component="h1"
                  sx={{
                    fontFamily: '"Raleway", Helvetica, sans-serif',
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: { xs: 0.3, md: 0.8 },
                    fontSize: { xs: 24, sm: 28, md: 36 },
                    color: "#0b0b0b",
                  }}
                >
                  {title}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "'Georgia', serif",
                    fontSize: { xs: 16, sm: 18, md: 20 },
                    lineHeight: { xs: 1.7, md: 1.8 },
                    color: "rgba(0,0,0,0.8)",
                  }}
                >
                  {verse}
                </Typography>

                <Chip
                  label={reference}
                  sx={{
                    alignSelf: "flex-start",
                    bgcolor: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    fontWeight: 700,
                  }}
                />
              </Stack>
            </Box>

            {/* IMAGINEA de categorie (sus, lângă verset) */}
            <Box
              sx={{
                width: "100%",
                height: { xs: 180, md: 240 },
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
              }}
            >
              <img
                src={image}
                alt={`${title} — imagine`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={(e: any) => (e.currentTarget.style.display = "none")}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* LISTĂ POSTĂRI — VERTICAL */}
      <Container maxWidth="lg">
        <Stack spacing={3}>
          {visible.map((post) => (
            <Card
              key={post.id}
              sx={{
                borderRadius: 2,
                border: "1px solid rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}
            >
              {/* Thumb mock (îl păstrăm pentru demo; când vrei, îl scoatem) */}
              {post.image && (
                <CardMedia
                  component="img"
                  src={post.image}
                  alt={post.title}
                  sx={{ height: 240, objectFit: "cover" }}
                  onError={(e: any) => (e.currentTarget.style.display = "none")}
                />
              )}

              <CardContent>
                <Chip
                  label={new Date(post.date).toLocaleDateString("ro-RO")}
                  size="small"
                  sx={{ mb: 1, bgcolor: "rgba(0,0,0,0.06)" }}
                />
                <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                  {post.title}
                </Typography>
                <Typography sx={{ opacity: 0.85, mb: 1.5 }}>
                  {post.excerpt}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: accent,
                    "&:hover": { filter: "brightness(0.95)" },
                    fontWeight: 700,
                  }}
                  onClick={() => openPost(post)}
                >
                  Citește
                </Button>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* PAGINARE: Anterior / Pagina X din Y / Următoarea */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2.5}
          sx={{ mt: 3, mb: { xs: 6, md: 8 } }}
        >
          <IconButton
            onClick={goPrev}
            disabled={page === 1}
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: "white",
              border: "2px solid rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.05)",
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                opacity: 0.4,
                transform: "none",
              },
            }}
          >
            ◀
          </IconButton>

          <Chip
            label={`Pagina ${page} din ${totalPages}`}
            sx={{
              fontWeight: 700,
              bgcolor: "rgba(0,0,0,0.06)",
              px: 2,
              py: 1,
            }}
          />

          <IconButton
            onClick={goNext}
            disabled={page === totalPages}
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: "white",
              border: "2px solid rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.05)",
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                opacity: 0.4,
                transform: "none",
              },
            }}
          >
            ▶
          </IconButton>

        </Stack>
      </Container>

      {/* MODAL POST COMPLET */}
      <Dialog
        open={open}
        onClose={closePost}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ pr: 6, fontWeight: 800 }}>
          {selected?.title}
          <IconButton
            onClick={closePost}
            sx={{ position: "absolute", right: 8, top: 8 }}
            aria-label="Închide"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
          {selected?.image && (
            <Box
              sx={{
                mb: 2,
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
              }}
            >
              <img
                src={selected.image}
                alt={selected.title}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </Box>
          )}

          <Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.8, mb: selected?.youtubeId ? 2 : 0 }}>
            {selected?.content}
          </Typography>

          {selected?.youtubeId && (
            <Box
              sx={{
                position: "relative",
                pt: "56.25%", // 16:9
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
              }}
            >
              <iframe
                src={youTube(selected.youtubeId)}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
