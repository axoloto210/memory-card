import { useEffect } from "react";

export function useRegistBestTime(time: string) {
  useEffect(() => {
    const bestTime = localStorage.getItem("bestTime") ?? "99:59:59";

    if (time < bestTime) {
      localStorage.setItem('bestTime', time);
    }
  }, [time]);

}
