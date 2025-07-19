'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
export default function LimitSelector({
  currentLimit,
  searchParams,
}: {
  currentLimit: number;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const limitOptions = [6, 12, 24, 48];

  const handleLimitChange = (value: string) => {
    const params = new URLSearchParams();

    // Preserve existing params except page
    Object.entries(searchParams).forEach(([key, val]) => {
      if (val && key !== 'page') {
        params.set(key, Array.isArray(val) ? val[0] : val);
      }
    });

    params.set('limit', value);
    params.set('page', '1'); // Reset to page 1

    window.location.href = `?${params.toString()}`;
  };

  return (
    <Select value={currentLimit.toString()} onValueChange={handleLimitChange}>
      <SelectTrigger className="w-20 h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {limitOptions.map((limit) => (
          <SelectItem key={limit} value={limit.toString()}>
            {limit}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
