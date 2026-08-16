import { useEffect, useMemo, useState, type ReactNode } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArticleIcon from "@mui/icons-material/Article";
import FavoriteIcon from "@mui/icons-material/Favorite";

type CategoryKey =
  | "invatare"
  | "rugaciune"
  | "predicare"
  | "cantare"
  | "marturie";

type Post = {
  id: string;
  title: string;
  category?: CategoryKey;
};

const CATEGORIES: {
  key: CategoryKey;
  label: string;
  color: string;
}[] = [
  { key: "invatare", label: "Învățare", color: "#1565c0" },
  { key: "rugaciune", label: "Rugăciune", color: "#7b1fa2" },
  { key: "predicare", label: "Predicare", color: "#ef6c00" },
  { key: "cantare", label: "Cântare", color: "#00897b" },
  { key: "marturie", label: "Mărturie", color: "#d81b60" },
];

function StatCard({
  title,
  value,
  color,
  icon,
}: {
  title: string;
  value: number;
  color: string;
  icon: ReactNode;
}) {
  return (
    <Card sx={{ borderRadius: 4, overflow: "hidden" }}>
      <Box sx={{ height: 6, bgcolor: color }} />

      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography sx={{ color: "text.secondary", fontWeight: 700, fontSize: 14 }}>
              {title}
            </Typography>

            <Typography sx={{ fontSize: 34, fontWeight: 900, color, mt: 0.5 }}>
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 52,
              height: 52,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              color: "white",
              bgcolor: color,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function AdminStatistics() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [needsCount, setNeedsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribePosts = onSnapshot(
      collection(db, "posts"),
      (snapshot) => {
        const loadedPosts = snapshot.docs.map((document) => {
          const data = document.data();

          return {
            id: document.id,
            title: String(data.title || "Postare fără titlu"),
            category: data.category as CategoryKey | undefined,
          };
        });

        setPosts(loadedPosts);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    const unsubscribeNeeds = onSnapshot(
      collection(db, "needs"),
      (snapshot) => {
        setNeedsCount(snapshot.size);
      },
      (err) => {
        console.error("Eroare la citirea nevoilor:", err);
      }
    );

    return () => {
      unsubscribePosts();
      unsubscribeNeeds();
    };
  }, []);

  const postsByCategory = useMemo(() => {
    return CATEGORIES.map((category) => ({
      ...category,
      count: posts.filter((post) => post.category === category.key).length,
    }));
  }, [posts]);

  return (
    <Container maxWidth="lg" sx={{ pb: 6 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/home")}
          variant="outlined"
          sx={{ color: "white", borderColor: "rgba(255,255,255,0.4)" }}
        >
          Înapoi
        </Button>

        <Typography sx={{ color: "white", fontWeight: 900, fontSize: { xs: 22, md: 28 } }}>
          Statistici
        </Typography>
      </Stack>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "white" }} />
        </Box>
      )}

      {!loading && error && (
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography color="error">{error}</Typography>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <Stack spacing={3}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },
              gap: 2,
            }}
          >
            <StatCard
              title="Total postări"
              value={posts.length}
              color="#1976d2"
              icon={<ArticleIcon />}
            />

            <StatCard
              title="Total nevoi"
              value={needsCount}
              color="#e91e63"
              icon={<FavoriteIcon />}
            />
          </Box>

          <Card sx={{ borderRadius: 4 }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography sx={{ fontWeight: 900, fontSize: 20, mb: 2 }}>
                Postări pe categorii
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(5, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {postsByCategory.map((category) => (
                  <Box
                    key={category.key}
                    sx={{
                      border: `1px solid ${category.color}`,
                      borderRadius: 3,
                      p: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                      {category.label}
                    </Typography>

                    <Typography sx={{ color: category.color, fontWeight: 900, fontSize: 28 }}>
                      {category.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Stack>
      )}
    </Container>
  );
}