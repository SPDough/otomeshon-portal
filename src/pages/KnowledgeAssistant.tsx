import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  IconButton,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Send as SendIcon,
  Person as PersonIcon,
  AutoAwesome as AssistantIcon,
  MenuBook as SourceIcon,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import AnimatedPage, { fadeInUp } from "@/components/AnimatedPage";
import { knowledgeAsk } from "@/lib/knowledgeApi";
import type { Citation, KnowledgeAskResponse } from "@/types/knowledge";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  citations?: Citation[];
  route?: string;
  iterations?: number;
  error?: boolean;
}

const EXAMPLE_QUESTIONS = [
  "How does a mezzanine bond accrue interest?",
  "What is the difference between CAPM and APT?",
  "How does diversification reduce portfolio risk?",
];

const TRUST_COLOR: Record<string, "success" | "info" | "warning" | "default"> = {
  authoritative: "success",
  internal_guidance: "info",
  working_note: "warning",
  draft: "default",
};

const trustColor = (level?: string | null) =>
  (level && TRUST_COLOR[level]) || "default";

let idCounter = 0;
const nextId = () => `m${Date.now()}_${idCounter++}`;

const CitationList = ({ citations }: { citations: Citation[] }) => {
  if (!citations.length) return null;
  return (
    <Box sx={{ mt: 1.5 }}>
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5, color: "text.secondary" }}>
        <SourceIcon sx={{ fontSize: 16 }} />
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          Sources ({citations.length})
        </Typography>
      </Stack>
      <Stack spacing={0.75}>
        {citations.map((c, i) => (
          <Paper
            key={`${c.document_id}-${c.chunk_index}-${i}`}
            variant="outlined"
            sx={{ p: 1, display: "flex", alignItems: "center", gap: 1 }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary", minWidth: 20 }}>
              [{i + 1}]
            </Typography>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap title={c.document_title}>
                {c.document_title}
              </Typography>
              {c.section && (
                <Typography variant="caption" color="text.secondary" noWrap title={c.section}>
                  {c.section}
                </Typography>
              )}
            </Box>
            {c.trust_level && (
              <Chip
                label={c.trust_level.replace(/_/g, " ")}
                size="small"
                color={trustColor(c.trust_level)}
                variant="outlined"
              />
            )}
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ flexDirection: isUser ? "row-reverse" : "row", alignItems: "flex-start" }}
    >
      <Box
        sx={{
          mt: 0.5,
          width: 32,
          height: 32,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          bgcolor: isUser ? "primary.main" : "secondary.main",
          color: "white",
        }}
      >
        {isUser ? <PersonIcon fontSize="small" /> : <AssistantIcon fontSize="small" />}
      </Box>
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          maxWidth: "80%",
          borderRadius: 2,
          border: 1,
          borderColor: message.error ? "error.light" : "divider",
          bgcolor: isUser ? "action.hover" : "background.paper",
        }}
      >
        {message.error ? (
          <Alert severity="error" sx={{ py: 0 }}>
            {message.text}
          </Alert>
        ) : message.role === "assistant" ? (
          <Box
            sx={{
              "& p": { m: 0, mb: 1 },
              "& p:last-child": { mb: 0 },
              "& ul, & ol": { pl: 2.5, m: 0, mb: 1 },
              "& code": {
                bgcolor: "action.hover",
                px: 0.5,
                borderRadius: 0.5,
                fontSize: "0.85em",
              },
            }}
          >
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {message.text}
          </Typography>
        )}

        {message.role === "assistant" && message.citations && (
          <CitationList citations={message.citations} />
        )}

        {message.role === "assistant" && message.route && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
            {message.route === "complex" ? "Multi-step retrieval" : "Direct retrieval"}
            {typeof message.iterations === "number" && message.iterations > 0
              ? ` · ${message.iterations} refinement${message.iterations > 1 ? "s" : ""}`
              : ""}
          </Typography>
        )}
      </Paper>
    </Stack>
  );
};

const KnowledgeAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const submit = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text: trimmed }]);
    setInput("");
    setIsLoading(true);
    try {
      const res: KnowledgeAskResponse = await knowledgeAsk(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          text: res.answer || "No answer was returned.",
          citations: res.citations,
          route: res.route,
          iterations: res.iterations,
        },
      ]);
    } catch (err) {
      const detail =
        err instanceof Error ? err.message : "Could not reach the knowledge repository.";
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", text: detail, error: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  };

  return (
    <AnimatedPage>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <motion.div variants={fadeInUp}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Knowledge Assistant
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Ask a natural-language question about securities, accounting treatments, and
              operations. Answers are grounded in the knowledge repository and cite their sources.
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 260px)" }}>
          <Paper
            variant="outlined"
            ref={scrollRef}
            sx={{ flexGrow: 1, overflowY: "auto", p: 2, mb: 2, bgcolor: "background.default" }}
          >
            {messages.length === 0 && !isLoading ? (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.secondary",
                  gap: 2,
                }}
              >
                <AssistantIcon sx={{ fontSize: 48, opacity: 0.4 }} />
                <Typography variant="body1">Ask the knowledge repository a question</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" useFlexGap>
                  {EXAMPLE_QUESTIONS.map((q) => (
                    <Chip
                      key={q}
                      label={q}
                      variant="outlined"
                      onClick={() => submit(q)}
                      sx={{ cursor: "pointer" }}
                    />
                  ))}
                </Stack>
              </Box>
            ) : (
              <Stack spacing={2}>
                {messages.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))}
                {isLoading && (
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: "text.secondary" }}>
                    <Box
                      sx={{
                        mt: 0.5,
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "secondary.main",
                        color: "white",
                      }}
                    >
                      <AssistantIcon fontSize="small" />
                    </Box>
                    <CircularProgress size={18} />
                    <Typography variant="body2">Searching the knowledge repository…</Typography>
                  </Stack>
                )}
              </Stack>
            )}
          </Paper>

          <Divider sx={{ mb: 1.5 }} />
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Ask a question…  (Enter to send, Shift+Enter for a new line)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <Tooltip title="Send">
              <span>
                <IconButton
                  color="primary"
                  onClick={() => submit(input)}
                  disabled={isLoading || !input.trim()}
                  sx={{ mb: 0.5 }}
                >
                  <SendIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default KnowledgeAssistant;
