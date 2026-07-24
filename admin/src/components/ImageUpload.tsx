import { useRef, useState } from "react";
import { uploadImage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export function ImageUpload({ value, onChange, label = "Imagen" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const result = await uploadImage(file);
      onChange(result.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setUploading(false);
    }
  }
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value && (
        <img src={value} alt="Vista previa" className="h-40 w-full max-w-sm rounded-lg object-cover" />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <div className="flex gap-2">
        <Button type="button" variant="outline" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? "Subiendo…" : "Subir imagen"}
        </Button>
        {value && (
          <Button type="button" variant="ghost" onClick={() => onChange("")}>Quitar</Button>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
