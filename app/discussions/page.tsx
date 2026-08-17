"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  getDiscussionItems,
  getDiscussionDetail,
  createDiscussion,
  sendMessage,
  getUsers,
} from "@/lib/api";
import type { DiscussionItem, MessageItem, UserItem } from "@/type";
import { toast } from "sonner";

export default function DiscussionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [discussions, setDiscussions] = useState<DiscussionItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    getDiscussionItems().then(setDiscussions);
    getUsers().then(setUsers);
  }, [user]);

  useEffect(() => {
    if (selectedId) {
      getDiscussionDetail(selectedId).then((d) => {
        setMessages(d.messages || []);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      });
    }
  }, [selectedId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedId) return;
    try {
      await sendMessage(selectedId, newMessage);
      setNewMessage("");
      const d = await getDiscussionDetail(selectedId);
      setMessages(d.messages || []);
      const list = await getDiscussionItems();
      setDiscussions(list);
    } catch {
      toast.error("Erreur lors de l'envoi");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    try {
      const d = await createDiscussion(newTitle || null, [user!.id, selectedUserId]);
      setShowCreate(false);
      setNewTitle("");
      setSelectedUserId(null);
      const list = await getDiscussionItems();
      setDiscussions(list);
      setSelectedId(d.id);
      toast.success("Discussion créée");
    } catch {
      toast.error("Erreur lors de la création");
    }
  };

  const selectedDiscussion = discussions.find((d) => d.id === selectedId);

  if (loading || !user)
    return <div className="p-8 text-center text-slate-500">Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Messages</h1>
            <p className="mt-1 text-sm text-slate-500">
              Discussion entre administrateurs et utilisateurs.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Nouvelle discussion
          </button>
        </div>

        {showCreate && (
          <div className="mb-6 rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Nouvelle discussion
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Titre (optionnel)"
                className="block w-full rounded-2xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <select
                value={selectedUserId ?? ""}
                onChange={(e) => setSelectedUserId(Number(e.target.value))}
                className="block w-full rounded-2xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Sélectionner un utilisateur</option>
                {users
                  .filter((u) => u.id !== user.id)
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.first_name} {u.last_name} ({u.email})
                    </option>
                  ))}
              </select>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="flex gap-6">
          <div className="w-80 flex-shrink-0 space-y-2">
            {discussions.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedId(d.id)}
                className={`w-full rounded-2xl p-4 text-left ring-1 transition ${
                  selectedId === d.id
                    ? "bg-blue-50 ring-blue-200"
                    : "bg-white ring-slate-200 hover:bg-slate-50"
                }`}
              >
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {d.title || `Discussion #${d.id}`}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {d.messages_count} message{d.messages_count !== 1 ? "s" : ""}
                </p>
                {d.last_message && (
                  <p className="mt-1 text-xs text-slate-400 truncate">
                    {d.last_message.user.first_name}: {d.last_message.content}
                  </p>
                )}
              </button>
            ))}
            {discussions.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">
                Aucune discussion
              </p>
            )}
          </div>

          <div className="flex-1 rounded-3xl bg-white shadow ring-1 ring-slate-200">
            {selectedId && selectedDiscussion ? (
              <div className="flex h-[600px] flex-col">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {selectedDiscussion.title || `Discussion #${selectedId}`}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {selectedDiscussion.participants
                      .map((p) => `${p.first_name} ${p.last_name}`)
                      .join(", ")}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.user.id === user.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs rounded-2xl px-4 py-2.5 ${
                          m.user.id === user.id
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-900"
                        }`}
                      >
                        {m.user.id !== user.id && (
                          <p className="mb-1 text-xs font-semibold text-blue-600">
                            {m.user.first_name} {m.user.last_name}
                          </p>
                        )}
                        <p className="text-sm">{m.content}</p>
                        <p
                          className={`mt-1 text-[10px] ${
                            m.user.id === user.id ? "text-blue-200" : "text-slate-400"
                          }`}
                        >
                          {new Date(m.created_at).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={handleSend}
                  className="border-t border-slate-200 px-6 py-4 flex gap-3"
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrire un message..."
                    className="flex-1 rounded-2xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="rounded-2xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Envoyer
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex h-[600px] items-center justify-center text-slate-400">
                Sélectionnez une discussion
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
