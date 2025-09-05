export function formatDate(date) {
  if (date.includes("T") && date.includes("Z")) {
    let removePart = date.substring(date.indexOf("T") + 1, date.indexOf("Z"));
    let newDate = date.split("T" + removePart + "Z");
    return newDate.join("").split("-").reverse().join("/");
  } else if (date.includes("T") && !date.includes("Z")) {
    let newDate = date.split("T");
    return newDate[0].split("-").reverse().join("/");
  } else {
    return date.split("-").reverse().join("/");
  }
}

export function formatDateUS(date) {
  if (date.includes("T") && date.includes("Z")) {
    let removePart = date.substring(date.indexOf("T") + 1, date.indexOf("Z"));
    let newDate = date.split("T" + removePart + "Z");
    return newDate.join("");
  } else if (date.includes("T") && !date.includes("Z")) {
    let newDate = date.split("T");
    return newDate[0];
  } else {
    return date;
  }
}
