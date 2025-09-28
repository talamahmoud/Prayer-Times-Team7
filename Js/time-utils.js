export function timeFormat(time, check) {
  const [hours, minutes] = time.split(":");
  let hour = parseInt(hours, 10);
  const amOrPm = hour >= 12 ? "PM" : "AM";

  if (check) {
    return `${hour}:${minutes} ${amOrPm}`;
  } else {
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${amOrPm}`;
  }
}
