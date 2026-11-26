import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ReminderCard from './ReminderCard';

export default function ReminderGroup({
  title,
  count = 0,
  icon: Icon,
  badgeColor = 'bg-slate-100 text-slate-700',
  description,
  reminders = [],
  defaultOpen = true,
  collapsible = true,
  onMarkDone,
  onEdit,
  onDelete,
  onViewLogs,
  emptyMessage = 'Tidak ada pengingat dalam kategori ini.',
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="space-y-3">
      {/* Group Header */}
      <div
        className={`flex items-center justify-between py-2 px-1 rounded-xl transition-colors ${
          collapsible ? 'cursor-pointer select-none hover:bg-slate-100/70' : ''
        }`}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-700">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {title}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}>
                {count}
              </span>
            </div>
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
        </div>

        {collapsible && (
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
            aria-label={isOpen ? 'Tutup grup' : 'Buka grup'}
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Grid of Cards */}
      {isOpen && (
        <>
          {reminders.length === 0 ? (
            <div className="p-6 bg-white/60 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400">
              {emptyMessage}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onMarkDone={onMarkDone}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onViewLogs={onViewLogs}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
