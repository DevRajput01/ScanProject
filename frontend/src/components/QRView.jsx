import { useParams } from 'react-router-dom';
import { useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const PROFILE_BASE = typeof window !== 'undefined'
  ? `${window.location.origin}/profile`
  : 'http://localhost:5173/profile';

export default function QRView() {
  const { id } = useParams();
  const qrRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const profileUrl = `${PROFILE_BASE}/${id}`;

  const downloadPng = useCallback(() => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const a = document.createElement('a');
      a.download = `scanmyqr-${id}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svg));
  }, [id]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select and copy
      const input = document.createElement('input');
      input.value = profileUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [profileUrl]);

  if (!id) {
    return (
      <div className="rounded-2xl shadow-card bg-white p-8 text-center text-gray-500">
        Invalid profile. <a href="/" className="text-primary-600 underline">Go home</a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Success! Your QR code is ready</h1>
      <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8 flex flex-col items-center">
        <p className="text-gray-600 mb-6">Scan or share the link to view your profile.</p>
        <div ref={qrRef} className="p-4 bg-white rounded-2xl border border-gray-100 inline-block">
          <QRCodeSVG value={profileUrl} size={220} level="M" includeMargin />
        </div>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={downloadPng}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700"
          >
            <Download size={18} />
            Download PNG
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-500 break-all max-w-full">{profileUrl}</p>
      </div>
    </div>
  );
}
