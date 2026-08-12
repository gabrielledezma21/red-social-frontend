export const formatDateTime = (value) => {
  if (!value) return "";

  let date;

  if (typeof value === "string") {
    const localMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (localMatch) {
      const [, day, month, year, hour, minute, second = "0"] = localMatch;
      date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second)
      );
    }
  }

  if (!date) {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date);
};
