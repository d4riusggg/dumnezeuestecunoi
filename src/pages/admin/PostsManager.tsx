import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";


type CategoryKey = "invatare" | "rugaciune" | "predicare" | "cantare" | "marturie";

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "invatare", label: "Învățare" },
  { key: "rugaciune", label: "Rugăciune" },
  { key: "predicare", label: "Predicare" },
  { key: "cantare", label: "Cântare" },
  { key: "marturie", label: "Mărturie" },
];

type PostDoc = {
  id: string;
  category: CategoryKey;
  title: string;
  imageUrl: string;
  content: string;
  youtubeUrl?: string;
  createdAt?: any;
  updatedAt?: any;
};

const emptyForm = {
  id: "",
  category: "invatare" as CategoryKey,
  title: "",
  imageUrl: "",
  content: "",
  youtubeUrl: "",
};

function isValidYouTube(url: string) {
  if (!url) return true;
  return /youtube\.com\/watch\?v=|youtu\.be\//i.test(url);
}

export default function PostsManager() {
  const [posts, setPosts] = useState<PostDoc[]>([]);
  const [filterCategory, setFilterCategory] = useState<CategoryKey | "all">("all");

  const [mode, setMode] = useState<"idle" | "create" | "edit">("idle");
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live list
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: PostDoc[] = snap.docs.map((d) => {
          const data = d.data() as Omit<PostDoc, "id">;
          return { id: d.id, ...data } as PostDoc;
        });
        setPosts(items);
      },
      (err) => setError(err.message)
    );

    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    if (filterCategory === "all") return posts;
    return posts.filter((p) => p.category === filterCategory);
  }, [posts, filterCategory]);

  const startCreate = () => {
    setError(null);
    setMode("create");
    setForm({ ...emptyForm });
  };

  const startEdit = (p: PostDoc) => {
    setError(null);
    setMode("edit");
    setForm({
      id: p.id,
      category: p.category,
      title: p.title ?? "",
      imageUrl: p.imageUrl ?? "",
      content: p.content ?? "",
      youtubeUrl: p.youtubeUrl ?? "",
    });
  };

  const cancel = () => {
    setMode("idle");
    setForm({ ...emptyForm });
    setError(null);
  };

  const handleSave = async () => {
    setError(null);

    if (!form.title.trim()) return setError("Titlul este obligatoriu.");
    if (!form.content.trim()) return setError("Textul este obligatoriu.");
    if (!isValidYouTube(form.youtubeUrl.trim())) return setError("Link YouTube invalid.");

    setSaving(true);
    try {
      if (mode === "create") {
        await addDoc(collection(db, "posts"), {
          category: form.category,
          title: form.title.trim(),
          imageUrl: form.imageUrl.trim(),
          content: form.content.trim(),
          youtubeUrl: form.youtubeUrl.trim() || "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      if (mode === "edit" && form.id) {
        await updateDoc(doc(db, "posts", form.id), {
          category: form.category,
          title: form.title.trim(),
          imageUrl: form.imageUrl.trim(),
          content: form.content.trim(),
          youtubeUrl: form.youtubeUrl.trim() || "",
          updatedAt: serverTimestamp(),
        });
      }

      cancel();
    } catch (e: any) {
      setError(e?.message || "Eroare la salvare.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: PostDoc) => {
    const ok = window.confirm(`Ștergi postarea „${p.title}”?`);
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "posts", p.id));
    } catch (e: any) {
      setError(e?.message || "Eroare la ștergere.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ color: "white", mb: 1 }}
            >
              Gestionare postări
            </Typography>

            <Typography
              sx={{
                color: "white",
                textShadow: "0 1px 4px rgba(0,0,0,0.4)"
              }}

            >
              Adaugă / editează / șterge postări pentru Învățare, Rugăciune, Predicare, Cântare, Mărturie.
            </Typography>


          </Box>

          <Stack direction="row" spacing={1.5} flexWrap="wrap" alignItems="center">
            <TextField
              select
              size="small"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              sx={{ minWidth: 200, bgcolor: "white", borderRadius: 2 }}
            >
              <MenuItem value="all">Toate</MenuItem>
              {CATEGORIES.map((c) => (
                <MenuItem key={c.key} value={c.key}>
                  {c.label}
                </MenuItem>
              ))}
            </TextField>

            <Button
              onClick={startCreate}
              startIcon={<AddIcon />}
              variant="contained"
              sx={{
                borderRadius: 999,
                fontWeight: 900,
                textTransform: "uppercase",
                px: 2.5,
              }}
            >
              Adaugă postare
            </Button>
          </Stack>
        </Stack>

        {/* FORM */}
        {mode !== "idle" && (
          <Card sx={{ borderRadius: 4 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontWeight: 900, textTransform: "uppercase" }}>
                  {mode === "create" ? "Postare nouă" : "Editare postare"}
                </Typography>

                <IconButton onClick={cancel} aria-label="Închide">
                  <CloseIcon />
                </IconButton>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <TextField
                  select
                  label="Categorie"
                  value={form.category}
                  onChange={(e) => setForm((s) => ({ ...s, category: e.target.value as CategoryKey }))}
                >
                  {CATEGORIES.map((c) => (
                    <MenuItem key={c.key} value={c.key}>
                      {c.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Titlu"
                  value={form.title}
                  onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                />

                <TextField
                  label="Link imagine (opțional)"
                  value={form.imageUrl}
                  onChange={(e) => setForm((s) => ({ ...s, imageUrl: e.target.value }))}
                  helperText="Poate fi URL sau /imagine.png (din public)."
                />

                <TextField
                  label="Text"
                  multiline
                  minRows={6}
                  value={form.content}
                  onChange={(e) => setForm((s) => ({ ...s, content: e.target.value }))}
                />

                <TextField
                  label="Link YouTube (opțional)"
                  value={form.youtubeUrl}
                  onChange={(e) => setForm((s) => ({ ...s, youtubeUrl: e.target.value }))}
                  helperText="Ex: https://www.youtube.com/watch?v=... sau https://youtu.be/..."
                />

                {error && (
                  <Typography sx={{ color: "error.main", fontSize: 14 }}>
                    {error}
                  </Typography>
                )}

                <Stack direction="row" spacing={1.5} justifyContent="flex-end" flexWrap="wrap">
                  <Button onClick={cancel} variant="outlined" sx={{ borderRadius: 999 }}>
                    Anulează
                  </Button>
                  <Button
                    onClick={handleSave}
                    startIcon={<SaveIcon />}
                    disabled={saving}
                    variant="contained"
                    sx={{ borderRadius: 999, fontWeight: 900, textTransform: "uppercase" }}
                  >
                    {mode === "create" ? "Salvează" : "Actualizează"}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* LIST */}
        <Card sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Typography sx={{ fontWeight: 900, textTransform: "uppercase", mb: 2 }}>
              Postări ({filtered.length})
            </Typography>

            <Stack spacing={1.5}>
              {filtered.map((p) => (
                <Box
                  key={p.id}
                  sx={{
                    border: "1px solid rgba(0,0,0,0.10)",
                    borderRadius: 3,
                    p: 1.5,
                    display: "flex",
                    gap: 1.5,
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    bgcolor: "white",
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 800 }}>
                      {p.title}
                    </Typography>
                    <Typography sx={{ opacity: 0.75, fontSize: 13 }}>
                      Categorie:{" "}
                      {CATEGORIES.find((c) => c.key === p.category)?.label ?? p.category}
                    </Typography>
                    <Typography sx={{ mt: 1, opacity: 0.9, fontSize: 14 }}>
                      {p.content?.slice(0, 180)}{p.content?.length > 180 ? "..." : ""}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton aria-label="Editează" onClick={() => startEdit(p)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="Șterge" onClick={() => handleDelete(p)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Box>
              ))}

              {filtered.length === 0 && (
                <Typography sx={{ opacity: 0.7 }}>
                  Nu există postări încă. Apasă „Adaugă postare”.
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* spațiu înainte de footer (dacă e cazul) */}
      <Box sx={{ height: 24 }} />
    </Container>
  );
}
