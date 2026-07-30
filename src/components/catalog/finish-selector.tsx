import type { ProductVariant } from "@/types/product";

type FinishSelectorProps = {
  variants: ProductVariant[];
  selectedId: string;
  onChange: (id: string) => void;
};

export function FinishSelector({
  variants,
  selectedId,
  onChange,
}: FinishSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-semibold">
        마감 선택
        <span className="ml-2 font-normal text-muted">
          {variants.find((variant) => variant.id === selectedId)?.finish}
        </span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const selected = variant.id === selectedId;
          return (
            <button
              aria-pressed={selected}
              className={`flex min-w-22 items-center justify-center gap-2 border px-4 py-3 text-xs font-medium transition-colors ${
                selected
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-warm-white hover:border-steel"
              }`}
              key={variant.id}
              onClick={() => onChange(variant.id)}
              type="button"
            >
              <span className={`finish-swatch finish-${variant.finish}`} />
              {variant.finish}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
