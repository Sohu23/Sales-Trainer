export type OpenRouterChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function openRouterChat(opts: {
  messages: OpenRouterChatMessage[];
  model?: string;
  temperature?: number;
}) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  const model = opts.model || process.env.OPENROUTER_MODEL || "openrouter/auto";

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Optional but recommended by OpenRouter
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || process.env.APP_URL || "",
      "X-Title": process.env.OPENROUTER_APP_NAME || "Sales Trainer",
    },
    body: JSON.stringify({
      model,
      temperature: opts.temperature ?? 0.7,
      messages: opts.messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenRouter error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    [key: string]: unknown;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("OpenRouter returned no content");
  }

  return { content, raw: data };
}
