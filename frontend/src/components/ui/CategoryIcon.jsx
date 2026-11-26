import { Receipt, CreditCard, Repeat, Wrench, Folder, Tag } from 'lucide-react';

export default function CategoryIcon({ name, className = 'w-4 h-4' }) {
  switch (name) {
    case 'Receipt':
      return <Receipt className={className} />;
    case 'CreditCard':
      return <CreditCard className={className} />;
    case 'Repeat':
      return <Repeat className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Folder':
      return <Folder className={className} />;
    default:
      return <Tag className={className} />;
  }
}
