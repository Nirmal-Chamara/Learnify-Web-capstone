import { CheckCircle2, XCircle, AlertTriangle, X } from "lucide-react"

const STYLES = {
  success: {
    wrapper: "border-green-100 bg-white",
    icon:    "text-green-500",
    text:    "text-green-800",
    Icon:    CheckCircle2,
  },
  error: {
    wrapper: "border-red-100 bg-white",
    icon:    "text-red-500",
    text:    "text-red-800",
    Icon:    XCircle,
  },
  warning: {
    wrapper: "border-amber-100 bg-white",
    icon:    "text-amber-500",
    text:    "text-amber-800",
    Icon:    AlertTriangle,
  },
}

export default function Toast({ toasts = [], onRemove }) {
  if (!toasts.length) return null

  return (
    <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map(({ id, message, type = "success" }) => {
        const s = STYLES[type] || STYLES.success
        const Icon = s.Icon
        return (
          <div
            key={id}
            className={`pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-3
              rounded-xl shadow-xl border text-sm font-body
              animate-slide-in-right min-w-[280px] max-w-xs ${s.wrapper}`}
          >
            <Icon size={17} className={`flex-shrink-0 ${s.icon}`} />
            <span className={`flex-1 font-medium text-sm ${s.text}`}>{message}</span>
            <button
              onClick={() => onRemove(id)}
              className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center
                text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
