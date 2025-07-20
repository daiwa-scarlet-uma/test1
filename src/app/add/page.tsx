"use client";

import { useState, FormEvent } from "react";

export default function AddPage() {
  // 两个输入字段及其 setter
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  // 结果和错误信息
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");

  // 获取并规范化后端基础 URL（去掉末尾斜杠）
  const getApiBase = () => {
    let api = process.env.NEXT_PUBLIC_API_URL;
    if (!api) throw new Error("请先设置 NEXT_PUBLIC_API_URL");
    if (api.endsWith("/")) api = api.slice(0, -1);
    return api;
  };

  // 表单提交处理
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    // 转换为数字并校验
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (isNaN(numA) || isNaN(numB)) {
      setError("Please enter valid numbers");
      return;
    }

    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/add/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ a: numA, b: numB }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = (await res.json()) as { result: number };
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: 400 }}>
      <h1>Add Two Numbers</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>
            a:
            <input
              type="number"
              value={a}
              onChange={(e) => setA(e.target.value)}
              style={{ marginLeft: 8, width: "100%" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            b:
            <input
              type="number"
              value={b}
              onChange={(e) => setB(e.target.value)}
              style={{ marginLeft: 8, width: "100%" }}
            />
          </label>
        </div>
        <button type="submit">Calculate</button>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {result !== null && (
        <p style={{ marginTop: 12 }}>
          Result: <strong>{result}</strong>
        </p>
      )}
    </div>
  );
}
