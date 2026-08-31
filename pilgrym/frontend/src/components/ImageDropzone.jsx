import React, { useRef, useState } from 'react';

const MAX_FILE_BYTES = 10 * 1024 * 1024;

// Images are stored as data URLs on the package, so they are downscaled in the
// browser first — a 4MB phone photo becomes ~150KB before it ever hits the API.
const resizeToDataUrl = (file, maxDim, keepTransparency) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error(`${file.name} is not a readable image`));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(Math.round(img.width * scale), 1);
        const h = Math.max(Math.round(img.height * scale), 1);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');

        const asPng = keepTransparency && file.type === 'image/png';
        if (!asPng) {
          // JPEG has no alpha channel — paint white first so transparent
          // corners don't come out black.
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
        }
        ctx.drawImage(img, 0, 0, w, h);

        resolve(asPng ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

const ImageDropzone = ({
  value = [],
  onChange,
  multiple = true,
  maxDim = 1600,
  keepTransparency = false,
  max = 8,
  hint = 'PNG or JPG, up to 10MB each',
  previewClass = 'h-24',
}) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const addFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    if (!files.length) {
      setError('Please drop an image file.');
      return;
    }

    setError('');
    setBusy(true);
    try {
      const room = multiple ? Math.max(max - value.length, 0) : 1;
      if (room === 0) {
        setError(`You can add up to ${max} images.`);
        return;
      }

      const accepted = files.slice(0, room);
      const oversized = accepted.filter((f) => f.size > MAX_FILE_BYTES);
      if (oversized.length) {
        setError(`${oversized[0].name} is larger than 10MB.`);
      }

      const urls = await Promise.all(
        accepted
          .filter((f) => f.size <= MAX_FILE_BYTES)
          .map((f) => resizeToDataUrl(f, maxDim, keepTransparency))
      );

      if (urls.length) onChange(multiple ? [...value, ...urls] : [urls[0]]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = (index) => onChange(value.filter((_, i) => i !== index));

  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
        role="button"
        tabIndex={0}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${
          dragging ? 'border-gold-400 bg-gold-50' : 'border-primary-200 bg-primary-50/40 hover:bg-primary-50'
        }`}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="mb-2">
          <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" stroke="#227872" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 15v3.5A1.5 1.5 0 005.5 20h13a1.5 1.5 0 001.5-1.5V15" stroke="#227872" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <p className="text-sm font-semibold text-primary-800">
          {busy ? 'Processing images…' : 'Drag & drop images here'}
        </p>
        <p className="mt-0.5 text-xs text-primary-500">or click to browse — {hint}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {value.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {value.map((src, i) => (
            <div key={`${src.slice(0, 32)}-${i}`} className="group relative">
              <img
                src={src}
                alt={`Upload ${i + 1}`}
                className={`${previewClass} w-auto max-w-[10rem] rounded-lg border border-primary-100 bg-white object-contain`}
              />
              {multiple && i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-primary-900/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Cover
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 rounded-b-lg bg-primary-900/70 p-1 opacity-0 transition group-hover:opacity-100">
                {multiple && (
                  <>
                    <button type="button" onClick={() => move(i, -1)} className="px-1 text-xs text-white disabled:opacity-30" disabled={i === 0} aria-label="Move left">←</button>
                    <button type="button" onClick={() => move(i, 1)} className="px-1 text-xs text-white disabled:opacity-30" disabled={i === value.length - 1} aria-label="Move right">→</button>
                  </>
                )}
                <button type="button" onClick={() => remove(i)} className="px-1 text-xs font-semibold text-red-200 hover:text-red-100" aria-label="Remove image">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
