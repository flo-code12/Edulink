import React from 'react';
export function PageHeader({
  title,
  subtitle,
  action




}: {title: string;subtitle?: string;action?: React.ReactNode;}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        {subtitle &&
        <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        }
      </div>
      {action}
    </div>);

}
const colorMap: Record<
  string,
  {
    bg: string;
    text: string;
    solid: string;
  }> =
{
  blue: {
    bg: 'bg-brand-blue/10',
    text: 'text-brand-blue',
    solid: 'bg-brand-blue'
  },
  green: {
    bg: 'bg-brand-green/10',
    text: 'text-brand-green',
    solid: 'bg-brand-green'
  },
  orange: {
    bg: 'bg-brand-orange/10',
    text: 'text-brand-orange',
    solid: 'bg-brand-orange'
  }
};
export function courseColor(color: string) {
  return colorMap[color] ?? colorMap.blue;
}