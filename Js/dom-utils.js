export function clearOptions(select) {
  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }
}

export function setLoading(select, text = "Loading…") {
  clearOptions(select);
  const opt = document.createElement("option");
  opt.value = "";
  opt.textContent = text;
  select.appendChild(opt);
  select.disabled = true;
}

export function setOptions(select, items, placeholder) {
  clearOptions(select);
  const placeholderOpt = document.createElement("option");
  placeholderOpt.value = "";
  placeholderOpt.textContent = placeholder;
  select.appendChild(placeholderOpt);

  items.forEach((item) => {
    const opt = document.createElement("option");
    if (typeof item === "string") {
      opt.value = item;
      opt.textContent = item;
    } else {
      opt.value = item.name;
      opt.textContent = item.name;
    }
    select.appendChild(opt);
  });

  select.disabled = false;
}

export function showLoading(el) {
  if (el) el.style.display = "block";
}

export function hideLoading(el) {
  if (el) el.style.display = "none";
}
