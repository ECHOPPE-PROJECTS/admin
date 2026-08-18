"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const sections = [
  {
    title: "Connexion",
    content: [
      "Accédez à l'adresse de l'application (URL de déploiement ou http://localhost:3000).",
      "Entrez votre adresse email et votre mot de passe.",
      "Après connexion, vous êtes redirigé vers le tableau de bord.",
    ],
  },
  {
    title: "Tableau de bord",
    content: [
      "Affiche un résumé : nombre total d'utilisateurs, d'incidents, de notifications et d'activités.",
      "Un graphique circulaire montre la répartition des incidents par statut.",
      "La section Notifications affiche les dernières notifications reçues.",
    ],
  },
  {
    title: "Gestion des utilisateurs",
    content: [
      "Page Utilisateurs : liste de tous les comptes avec leur rôle, département et statut (actif/inactif).",
      "Pour créer un utilisateur, cliquez sur « Nouvel utilisateur » et remplissez le formulaire (nom, email, mot de passe, rôle, département).",
      "Pour supprimer un utilisateur, cliquez sur « Supprimer » dans la ligne correspondante.",
      "Rôles disponibles : Administrateur, Technicien, Utilisateur.",
    ],
  },
  {
    title: "Gestion des incidents",
    content: [
      "Page Incidents : liste de tous les tickets avec numéro, titre, auteur, statut et priorité.",
      "Cliquez sur un ticket pour voir le détail et les actions disponibles.",
      "Assigner un technicien : sélectionnez un technicien dans le menu déroulant et cliquez « Assigner ».",
      "Résoudre un ticket : cliquez « Résoudre » quand le problème est traité. L'utilisateur sera notifié.",
      "Fermer un ticket : cliquez « Fermer » pour clôturer définitivement le ticket.",
      "Le statut du ticket suit le cycle : Nouveau → Assigné → En cours → Résolu → Fermé.",
    ],
  },
  {
    title: "Messagerie",
    content: [
      "Page Messages : système de discussion entre administrateurs et utilisateurs.",
      "Pour démarrer une discussion, cliquez « Nouvelle discussion » et sélectionnez un utilisateur.",
      "Les messages apparaissent en temps réel dans une interface de chat.",
      "Les participants à une discussion sont affichés en haut de la conversation.",
      "Chaque nouveau message déclenche une notification pour les autres participants.",
    ],
  },
  {
    title: "Paramètres",
    content: [
      "Page Paramètres : configuration de l'application.",
      "Onglet Profil : affiche les informations de votre compte.",
      "Onglet Catégories : gérer les catégories d'incidents (ex: Matériel, Logiciel, Réseau).",
      "Onglet Priorités : gérer les niveaux de priorité (1=Faible à 4=Critique) avec délai SLA.",
      "Onglet Statuts : gérer les statuts des tickets (Nouveau, Assigné, En cours, Résolu, Fermé).",
      "Onglet Rôles : gérer les rôles utilisateurs (Administrateur, Technicien, Utilisateur).",
      "Onglet Départements : gérer les départements de l'organisation.",
      "Pour ajouter un élément, remplissez le formulaire et cliquez « Ajouter ».",
      "Pour supprimer, cliquez « Supprimer » dans la colonne Action du tableau.",
    ],
  },
  {
    title: "Journal d'audit",
    content: [
      "Page Audit : affiche l'historique de toutes les actions effectuées dans le système.",
      "Chaque entrée montre : l'utilisateur, l'action, la description, l'adresse IP et la date.",
      "Permet de tracer qui a fait quoi et quand (création de ticket, changement de statut, etc.).",
    ],
  },
  {
    title: "Notifications",
    content: [
      "Les notifications apparaissent automatiquement lors d'événements importants :",
      "• Nouvel incident créé → notification pour les administrateurs",
      "• Ticket assigné → notification pour le technicien et l'auteur",
      "• Statut mis à jour → notification pour l'auteur",
      "• Ticket résolu → notification pour l'auteur (possibilité de fermer ou rouvrir)",
      "• Nouveau message → notification pour les autres participants",
      "Le compteur de notifications non lues s'affiche dans l'en-tête.",
    ],
  },
  {
    title: "Cycle de vie d'un ticket",
    content: [
      "1. L'utilisateur crée un incident → Statut : Nouveau",
      "2. L'admin assigne un technicien → Statut : Assigné",
      "3. Le technicien travaille sur le problème → Statut : En cours",
      "4. Le technicien résout le ticket → Statut : Résolu + notification à l'utilisateur",
      "5. L'utilisateur confirme la résolution → Statut : Fermé",
      "   OU L'utilisateur n'est pas satisfait → Rouvre le ticket → retour à En cours",
    ],
  },
];

export default function DocumentationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) return <div className="p-8 text-center text-slate-500">Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">Documentation</h1>
          <p className="mt-1 text-sm text-slate-500">
            Guide d&apos;utilisation de l&apos;application Echoppe - Gestion des Incidents.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200"
            >
              <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
              <ul className="mt-4 space-y-2">
                {section.content.map((line, j) => (
                  <li key={j} className="text-sm leading-relaxed text-slate-700">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl bg-slate-950 p-6 text-center text-sm text-slate-400">
          <p className="font-semibold text-white">Echoppe - Gestion des Incidents</p>
          <p className="mt-2">
            Application de helpdesk pour la gestion des incidents informatiques.
          </p>
        </div>
      </div>
    </div>
  );
}
