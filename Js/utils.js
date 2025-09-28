export async function handleFetch(
  url,
  options = {},
  errorMsg = "Failed to fetch"
) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(errorMsg);
    }
    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return { error: true, message: errorMsg };
  }
}
