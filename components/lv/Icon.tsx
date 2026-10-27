import { BarChart3, Check, CheckCheck, ChevronDown, CircleAlert, Database, Inbox, Info, Landmark, Mail, MapPin, Menu, Search, ShieldCheck, Star, UserRound, Users, X } from 'lucide-react';
const icons = {
  'ri-bar-chart-line': BarChart3, 'ri-community-line': Users, 'ri-shield-check-line': ShieldCheck,
  'ri-star-fill': Star, 'ri-star-line': Star, 'ri-check-line': Check, 'ri-search-line': Search,
  'ri-arrow-down-s-line': ChevronDown, 'ri-mail-line': Mail, 'ri-error-warning-line': CircleAlert,
  'ri-database-2-line': Database, 'ri-government-line': Landmark, 'ri-map-pin-2-line': MapPin,
  'ri-inbox-line': Inbox, 'ri-close-line': X, 'ri-menu-line': Menu, 'ri-user-line': UserRound,
  'ri-check-double-line': CheckCheck, 'ri-information-line': Info,
};
/** Local SVGs keep controls visible when third-party stylesheets are unavailable. */
export default function Icon({className = ''}: {className?: string}) {
  const key = className.split(/\s+/).find(value => value in icons) as keyof typeof icons | undefined;
  const Svg = key ? icons[key] : Info;
  return <Svg aria-hidden="true" size="1em" fill={key === 'ri-star-fill' ? 'currentColor' : 'none'} className={`inline-block shrink-0 ${className.replace(/\bri-[a-z0-9-]+\b/g, '')}`}/>;
}
