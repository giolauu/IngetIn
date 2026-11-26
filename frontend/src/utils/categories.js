/**
 * Definisi daftar kategori pengingat beserta metadata tampilan
 */
export const CATEGORIES = [
  { id: 'tagihan', label: 'Tagihan', iconName: 'Receipt', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'cicilan', label: 'Cicilan', iconName: 'CreditCard', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'langganan', label: 'Langganan', iconName: 'Repeat', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'servis', label: 'Servis', iconName: 'Wrench', badgeClass: 'bg-teal-50 text-teal-700 border-teal-200' },
  { id: 'lainnya', label: 'Lainnya', iconName: 'Folder', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
];

export function getCategoryMeta(categoryId) {
  const normalized = (categoryId || 'tagihan').toLowerCase();
  const found = CATEGORIES.find((c) => c.id === normalized);
  return found || {
    id: normalized,
    label: normalized.charAt(0).toUpperCase() + normalized.slice(1),
    iconName: 'Tag',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  };
}
