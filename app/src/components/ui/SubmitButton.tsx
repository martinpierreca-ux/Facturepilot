"use client";

import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  label: string;
  loadingLabel?: string;
}

export function SubmitButton({
  label,
  loadingLabel = "Chargement…",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? (
        <>
          <span className="spinner" />
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
