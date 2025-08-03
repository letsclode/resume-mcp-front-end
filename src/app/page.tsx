'use client';

import { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [email, setEmail] = useState({ to: '', subject: '', text: '' });
  const [emailStatus, setEmailStatus] = useState('');

  const uploadResume = async () => {
    if (!resumeFile) return;
    const formData = new FormData();
    formData.append('file', resumeFile); // ✅ Correct key name
    await axios.post(`${API_BASE}/upload-resume`, formData);
    alert('Resume uploaded!');
  };

  const askQuestion = async () => {
    const res = await axios.post(`${API_BASE}/ask`, { question });
    setAnswer(res.data.answer);
  };

  const sendEmail = async () => {
    const res = await axios.post(`${API_BASE}/send-email`, email);
    setEmailStatus('Email sent: ' + res.data.messageId);
  };

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🧠 MCP Server Playground</h1>

      <div className="space-y-2">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
        />
        <button
          onClick={uploadResume}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload Resume
        </button>
      </div>

      <div className="space-y-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about the resume..."
          className="border px-4 py-2 w-full"
        />
        <button
          onClick={askQuestion}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Ask
        </button>
        {answer && (
          <p className="mt-2">
            Answer: <strong>{answer}</strong>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <input
          placeholder="Recipient"
          className="border px-4 py-2 w-full"
          value={email.to}
          onChange={(e) => setEmail({ ...email, to: e.target.value })}
        />
        <input
          placeholder="Subject"
          className="border px-4 py-2 w-full"
          value={email.subject}
          onChange={(e) => setEmail({ ...email, subject: e.target.value })}
        />
        <textarea
          placeholder="Message"
          className="border px-4 py-2 w-full"
          rows={4}
          value={email.text}
          onChange={(e) => setEmail({ ...email, text: e.target.value })}
        />
        <button
          onClick={sendEmail}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Send Email
        </button>
        {emailStatus && (
          <p className="mt-2 text-green-600">{emailStatus}</p>
        )}
      </div>
    </main>
  );
}
