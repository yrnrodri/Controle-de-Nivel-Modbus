export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString(undefined, { 
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}
