// Date-only strings parse as UTC midnight, so format in UTC to keep dates
// stable regardless of the timezone that renders them.
const zhDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string) {
  return zhDateFormatter.format(new Date(date));
}
