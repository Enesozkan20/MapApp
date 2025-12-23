import { defaultIcon, visitIcon, homeIcon, jobIcon, parkIcon } from "./ui.js";

export function getNoteIcon(status) {
  switch (status) {
    case "visit":
      return visitIcon;
    case "home":
      return homeIcon;
    case "job":
      return jobIcon;
    case "park":
      return parkIcon;
    default:
      return defaultIcon;
  }
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("tr", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getStatus = (status) => {
  switch (status) {
    case "visit":
      return "ziyaret";
    case "home":
      return "Ev";
    case "job":
      return "Is";
    case "park":
      return "Park yeri";
    default:
      return "Tanimsiz";
  }
};

//ayni sorun farkli cozum
export const statusObj = {
  visit: "Ziyaret",
  park: "Park yeri",
  home: "Ev",
  job: "Is",
};
