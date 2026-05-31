import React from 'react'

function Toast({ message, type = 'success' }) {
  if (!message) return null
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-zinc-950/90 border border-zinc-805 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl text-zinc-100 max-w-sm animate-toast-in ring-1 ring-zinc-800">
      <style>{`
        @keyframes toastSlideIn {
          from {
            transform: translateY(1rem) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        .animate-toast-in {
          animation: toastSlideIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <div className={`p-1.5 rounded-xl flex items-center justify-center ${
        type === 'error'
          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
      }`}>
        {type === 'error' ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )}
      </div>
      <div className="text-sm font-semibold pr-1 select-none">
        {message}
      </div>
    </div>
  )
}

export default Toast
