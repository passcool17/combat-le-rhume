// Bannière « Installer l’appli » (Android : beforeinstallprompt ; iPhone : instructions) et bouton « Partager ».
import { useEffect, useState } from "react";
import { usePrefs } from "../lib/stockage.js";
import { Button } from "./ui.jsx";
import { Download, Share2, X } from "./icones.jsx";
import { cn } from "../lib/cn.js";

const isStandalone = () =>
  typeof window !== `undefined` &&
  (window.matchMedia?.(`(display-mode: standalone)`).matches || window.navigator.standalone === true);
const isIOS = () =>
  typeof navigator !== `undefined` &&
  (/iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === `MacIntel` && navigator.maxTouchPoints > 1));

export function InstallBanner() {
  const dismissed = usePrefs((s) => s.installDismissed);
  const dismiss = usePrefs((s) => s.dismissInstall);
  const [promptEvt, setPromptEvt] = useState(null);
  const [installed, setInstalled] = useState(true);
  const [ios, setIos] = useState(false);
  const show = !installed && !dismissed && (promptEvt || ios);
  useEffect(() => {
    document.body.classList.toggle(`clr-has-install`, !!show);
    return () => document.body.classList.remove(`clr-has-install`);
  }, [show]);
  useEffect(() => {
    setInstalled(isStandalone());
    setIos(isIOS());
    if (window.__clrInstallPrompt) setPromptEvt(window.__clrInstallPrompt);
    const onPrompt = (e) => {
      e.preventDefault();
      window.__clrInstallPrompt = e;
      setPromptEvt(e);
    };
    const onInstalled = () => {
      window.__clrInstallPrompt = null;
      setInstalled(true);
    };
    window.addEventListener(`beforeinstallprompt`, onPrompt);
    window.addEventListener(`appinstalled`, onInstalled);
    return () => {
      window.removeEventListener(`beforeinstallprompt`, onPrompt);
      window.removeEventListener(`appinstalled`, onInstalled);
    };
  }, []);
  if (!show) return null;
  return (
    <aside
      aria-label="Installer l’appli"
      data-install={promptEvt ? `android` : `ios`}
      className="clr-install fixed inset-x-3 z-40 mx-auto flex max-w-md items-start gap-3 rounded-[var(--radius-card)] border border-primary/30 bg-primary-soft py-3 pr-2 pl-4 shadow-lg"
    >
      <Download className="mt-3 size-5 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0 flex-1 py-1">
        <p className="font-medium text-primary">Installer l’appli</p>
        {promptEvt ? (
          <>
            <p className="mt-0.5 text-sm text-ink">Accès en un geste depuis l’écran d’accueil, même hors ligne.</p>
            <Button
              className="mt-2"
              onClick={async () => {
                promptEvt.prompt();
                const choice = await promptEvt.userChoice.catch(() => null);
                window.__clrInstallPrompt = null;
                setPromptEvt(null);
                if (choice?.outcome === `accepted`) setInstalled(true);
              }}
            >
              Installer
            </Button>
          </>
        ) : (
          <p className="mt-0.5 text-sm text-ink">
            Sur iPhone : dans Safari, touche <span className="font-medium">Partager</span>{" "}
            <Share2 className="inline size-4 align-[-2px]" aria-hidden="true" />, puis{" "}
            <span className="font-medium">« Sur l’écran d’accueil »</span>.
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Masquer la bannière d’installation"
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface"
      >
        <X className="size-5" aria-hidden="true" />
      </button>
    </aside>
  );
}

export function ShareButton({ className }) {
  const [msg, setMsg] = useState(``);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(``), 4000);
    return () => clearTimeout(t);
  }, [msg]);
  async function share() {
    const url = new URL(import.meta.env.BASE_URL, location.origin).href;
    const data = { title: `Combat le rhume et la grippe`, text: `Guide pratique contre le rhume et la grippe.`, url };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (e) {
        if (e?.name === `AbortError`) return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setMsg(`Lien copié : ${url}`);
    } catch {
      setMsg(`Copie impossible. Le lien : ${url}`);
    }
  }
  return (
    <>
      <button
        type="button"
        onClick={share}
        aria-label="Partager l’appli"
        className={cn(`inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-line bg-surface px-3 text-sm font-medium text-ink`, className)}
      >
        <Share2 className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Partager</span>
      </button>
      <p role="status" aria-live="polite" className={cn(msg ? `fixed inset-x-4 top-4 z-50 mx-auto max-w-md rounded-2xl bg-ink px-4 py-3 text-center text-sm text-bg shadow-lg` : `sr-only`)}>
        {msg}
      </p>
    </>
  );
}
