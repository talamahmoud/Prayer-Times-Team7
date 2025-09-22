export async function handleFetch(url, options = {}, errorMsg = "Failed to fetch") {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(errorMsg);
  }
  return res.json();
}
