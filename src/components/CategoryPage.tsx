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
import CircularProgress from "@mui/material/CircularProgress";

import {
  collection,
  onSnapshot,
  query,
  where,
  Unsubscribe,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";

type Slug = "invatare" | "rugaciune" | "cantare" | "predicare" | "marturie";

type Post = {
  id: string;
  title: string;
  date: string;      // ISO
  image?: string;    // opțional
  excerpt: string;   // ✅ obligatoriu (preview)
  content: string;   // ✅ obligatoriu (full)
  youtubeId?: string;
};

type CategoryPageProps = {
  slug: Slug;
  title: string;
  verse: string;
  reference: string;
  image: string;
  headerGradient: string;
  accent: string;
};

const PER_PAGE = 5;
const youTube = (id: string) =>
  `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;

function extractYouTubeId(input?: string | null) {
  if (!input) return undefined;
  if (/^[a-zA-Z0-9_-]{6,}$/.test(input) && !input.includes("http")) return input;

  try {
    const u = new URL(input);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id || undefined;
    }
    const v = u.searchParams.get("v");
    if (v) return v;

    const m = u.pathname.match(/\/embed\/([^/]+)/);
    return m?.[1] ?? undefined;
  } catch {
    return undefined;
  }
}

function toISODate(raw: any): string {
  if (raw?.toDate instanceof Function) return raw.toDate().toISOString();
  if (typeof raw === "number") return new Date(raw).toISOString();
  if (typeof raw === "string") {
    const d = new Date(raw);
    if (!isNaN(+d)) return d.toISOString();
  }
  return new Date().toISOString();
}

function mapDocToPost(id: string, data: DocumentData): Post | null {
  const title = String(data.title || "").trim();

  // ✅ obligatorii
  const excerpt = String(data.excerpt || "").trim(); // preview
  const content = String(data.content || "").trim(); // full

  // dacă lipsesc, NU afișăm postarea (ca să fie mandatory real)
  if (!title || !excerpt || !content) return null;

  const image: string | undefined = data.image || data.imageUrl || undefined;
  const dateISO = toISODate(data.date ?? data.createdAt ?? data.updatedAt);

  const youtubeId =
    data.youtubeId ||
    extractYouTubeId(data.youtubeUrl) ||
    extractYouTubeId(data.youtube) ||
    undefined;

  return {
    id,
    title,
    date: dateISO,
    image,
    excerpt,
    content,
    youtubeId,
  };
}

function sortByDateDesc(items: Post[]) {
  return [...items].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

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

  const [loading, setLoading] = React.useState(true);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => setPage(1), [slug]);

  React.useEffect(() => {
    let unsub: Unsubscribe | null = null;
    let fallbackUnsub: Unsubscribe | null = null;

    setLoading(true);
    setError(null);

    const col = collection(db, "posts");

    // 1) category == slug
    const q1 = query(col, where("category", "==", slug));
    unsub = onSnapshot(
      q1,
      (snap) => {
        if (snap.empty) {
          // fallback: slug == slug
          if (!fallbackUnsub) {
            const q2 = query(col, where("slug", "==", slug));
            fallbackUnsub = onSnapshot(
              q2,
              (snap2) => {
                const mapped = snap2.docs
                  .map((d) => mapDocToPost(d.id, d.data()))
                  .filter(Boolean) as Post[];

                setPosts(sortByDateDesc(mapped));
                setLoading(false);
              },
              (err2) => {
                setError(err2?.message || "Eroare la citirea postărilor.");
                setLoading(false);
              }
            );
          } else {
            setLoading(false);
          }
          return;
        }

        const mapped = snap.docs
          .map((d) => mapDocToPost(d.id, d.data()))
          .filter(Boolean) as Post[];

        setPosts(sortByDateDesc(mapped));
        setLoading(false);
      },
      (err) => {
        setError(err?.message || "Eroare la citirea postărilor.");
        setLoading(false);
      }
    );

    return () => {
      unsub?.();
      fallbackUnsub?.();
    };
  }, [slug]);

  React.useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
    setPage((p) => Math.min(p, totalPages));
  }, [posts]);

  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const visible = posts.slice(start, start + PER_PAGE);

  const openPost = (p: Post) => {
    setSelected(p);
    setOpen(true);
  };
  const closePost = () => {
    setOpen(false);
    setSelected(null);
  };
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <Box>
      {/* HEADER */}
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

      {/* LISTĂ POSTĂRI */}
      <Container maxWidth="lg">
        {loading && (
          <Stack direction="row" justifyContent="center" sx={{ py: 4 }}>
            <CircularProgress />
          </Stack>
        )}

        {!loading && error && (
          <Typography sx={{ color: "crimson", fontWeight: 700, mb: 2 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && posts.length === 0 && (
          <Typography sx={{ opacity: 0.8, mb: 2 }}>
            Nu există postări încă în această categorie.
          </Typography>
        )}

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

                {/* ✅ Aici e textul scurt (preview) */}
                <Typography sx={{ opacity: 0.85, mb: 1.5, whiteSpace: "pre-line" }}>
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

        {/* PAGINARE */}
        {posts.length > 0 && (
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
                "&:hover": { bgcolor: "rgba(0,0,0,0.05)", transform: "translateY(-2px)" },
                "&:disabled": { opacity: 0.4, transform: "none" },
              }}
            >
              ◀
            </IconButton>

            <Chip
              label={`Pagina ${page} din ${totalPages}`}
              sx={{ fontWeight: 700, bgcolor: "rgba(0,0,0,0.06)", px: 2, py: 1 }}
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
                "&:hover": { bgcolor: "rgba(0,0,0,0.05)", transform: "translateY(-2px)" },
                "&:disabled": { opacity: 0.4, transform: "none" },
              }}
            >
              ▶
            </IconButton>
          </Stack>
        )}
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

          {/* ✅ Aici e textul complet (full) STILIZAT */}
          <Box sx={{
            px: { xs: 1, md: 4 }, // Margini laterale mai mari pentru ecrane mari
            py: 2,               // Spațiere sus/jos
          }}>
            <Typography 
              sx={{ 
                whiteSpace: "pre-line", 
                lineHeight: 1.9,         // Rânduri mai aerisite
                fontSize: { xs: "1rem", md: "1.1rem" }, // Font ușor mai mare pentru citire ușoară
                color: "rgba(0, 0, 0, 0.85)", // Nu negru pur, ci un gri foarte închis (obosește mai puțin ochii)
                fontFamily: "'Georgia', serif", // Font clasic, excelent pentru blocuri mari de text literar/spiritual
                textAlign: "justify", // Aliniere stânga-dreapta pentru aspect de carte
                mb: selected?.youtubeId ? 4 : 2,
                
                // Stilizare pentru un eventual prim paragraf sau citat
                "&::first-letter": {
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: accent, // Folosește culoarea specifică secțiunii (ex: roșu la Mărturie)
                  float: "left",
                  mr: 1,
                  lineHeight: 1,
                }
              }}
            >
              {selected?.content}
            </Typography>
          </Box>

          {selected?.youtubeId && (
            <Box
              sx={{
                position: "relative",
                pt: "56.25%",
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
